import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const API_URL = process.env.REACT_APP_API_URL || "https://gamespark-api.onrender.com";

export default function GamePlayer({ game, onClose }) {
  const { user, toggleFavourite, API } = useAuth();
  const [loading, setLoading]         = useState(true);
  const [sessionId, setSessionId]     = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [rewardCooldown, setRewardCooldown] = useState(false);
  const [rewardMsg, setRewardMsg]     = useState('');
  const [xpPopup, setXpPopup]         = useState(null);
  const iframeRef = useRef(null);
  const isFav = user?.favourites?.includes(game.id);

  useEffect(() => {
    // Start session tracking
    if (user) {
      axios.post(`${API}/api/games/start`, {
        gameId: game.id, gameTitle: game.title, gameCategory: game.category,
      }).then(r => setSessionId(r.data.sessionId)).catch(() => {});
    }

    document.body.style.overflow = "hidden";

    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [game.id]);

  const handleClose = async () => {
    if (sessionId && user) {
      try { await axios.post(`${API}/api/games/end`, { sessionId }); } catch {}
    }
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch {}
    }
    onClose();
  };

  const handleFullscreen = async () => {
    const container = document.getElementById("game-modal-container");
    try {
      if (!document.fullscreenElement) await container?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      try {
        const iframe = iframeRef.current;
        if (iframe?.requestFullscreen) await iframe.requestFullscreen();
        else if (iframe?.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
      } catch {}
    }
  };

  // ── Rewarded Ad System ────────────────────────────────────────────────────
  // GamePix shows interstitial ads automatically inside their games.
  // For rewarded ads (user chooses to watch for XP), we show a simulated
  // ad using GamePix interstitial then award XP on completion.

  const handleWatchAd = async () => {
    if (rewardCooldown || !user) return;
    setShowRewardAd(true);
    setRewardMsg('');
  };

  const handleAdWatched = async () => {
    // User completed the ad — award XP
    setShowRewardAd(false);
    try {
      const res = await axios.post(`${API}/api/games/reward-ad`, { xpAmount: 50 });
      if (res.data.success) {
        setXpPopup(`+${res.data.xpEarned} XP earned!`);
        setTimeout(() => setXpPopup(null), 3000);
        // Set cooldown so user cannot spam ads
        setRewardCooldown(true);
        setTimeout(() => setRewardCooldown(false), 5 * 60 * 1000); // 5 min cooldown
      }
    } catch {
      setRewardMsg('Could not award XP. Try again later.');
    }
  };

  const handleAdSkipped = () => {
    setShowRewardAd(false);
    setRewardMsg('Watch the full ad to earn XP!');
    setTimeout(() => setRewardMsg(''), 3000);
  };

  const handleShare = () => {
    const text = `Play ${game.title} free — no download!\n${window.location.origin}`;
    if (navigator.share) navigator.share({ title: game.title, text, url: window.location.origin });
    else navigator.clipboard.writeText(window.location.origin).then(() => alert("Link copied!"));
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const overlay = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.94)",
    zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 8,
  };

  const modal = {
    background: "#0d0d1a",
    borderRadius: 14,
    width: "100%", maxWidth: 1000,
    height: "calc(100dvh - 16px)",
    maxHeight: "calc(100dvh - 16px)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 30px 80px #00000080",
    position: "relative",
  };

  const header = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px", borderBottom: "1px solid #ffffff10", flexShrink: 0,
  };

  const frameWrap = {
    flex: 1, position: "relative", background: "#000",
    minHeight: 0, overflow: "hidden",
  };

  const footer = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderTop: "1px solid #ffffff10",
    flexShrink: 0, flexWrap: "wrap",
  };

  const aBtn = (active, color) => ({
    display: "flex", alignItems: "center", gap: 5,
    padding: "6px 12px", borderRadius: 99,
    border: `2px solid ${color || (active ? "#ff6b35" : "#ffffff30")}`,
    background: active ? "#ff6b3520" : "transparent",
    color: color || (active ? "#ff6b35" : "#fff"),
    fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: "Nunito,sans-serif",
    whiteSpace: "nowrap",
  });

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div style={modal} id="game-modal-container">

        {/* Header */}
        <div style={header}>
          <div style={{ fontFamily: "Orbitron,monospace", fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "55%" }}>
            {game.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#ffffff55" }}>⭐ {game.rating} · {game.category}</span>
            <button onClick={handleClose} style={{ background: "#ffffff18", border: "none", color: "#fff", width: 28, height: 28, borderRadius: 7, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* XP popup */}
        {xpPopup && (
          <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#ff6b35,#ff8c42)", color: "#fff", padding: "10px 24px", borderRadius: 99, fontSize: 14, fontWeight: 800, zIndex: 10, fontFamily: "Orbitron,monospace", boxShadow: "0 4px 20px #ff6b3560", animation: "fadeup 0.4s ease-out" }}>
            {xpPopup}
            <style>{`@keyframes fadeup{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          </div>
        )}

        {/* Rewarded Ad Overlay */}
        {showRewardAd && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ fontFamily: "Orbitron,monospace", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Watch Ad → Earn 50 XP</div>
            <div style={{ fontSize: 13, color: "#ffffff77", maxWidth: 300, textAlign: "center" }}>Watch a short ad to support GameSpark and earn XP to level up faster!</div>

            {/* GamePix Ad Placeholder — in production GamePix serves real ads here */}
            <div style={{ width: 320, height: 240, background: "#1a1a2e", border: "2px solid #ff6b35", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ fontSize: 40 }}>📺</div>
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 13, color: "#ff6b35" }}>Advertisement</div>
              <div style={{ fontSize: 12, color: "#ffffff55" }}>GamePix Ad Network</div>
              {/* In production GamePix injects real ad here via their SDK */}
              <div id="gamepix-rewarded-ad" />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleAdSkipped} style={{ padding: "10px 24px", background: "transparent", border: "2px solid #ffffff30", color: "#ffffff77", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito,sans-serif" }}>
                Skip (no XP)
              </button>
              <button onClick={handleAdWatched} style={{ padding: "10px 28px", background: "linear-gradient(135deg,#ff6b35,#ff8c42)", border: "none", color: "#fff", borderRadius: 99, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "Nunito,sans-serif", boxShadow: "0 4px 14px #ff6b3550" }}>
                ✅ Claim 50 XP
              </button>
            </div>
            <div style={{ fontSize: 11, color: "#ffffff33" }}>Rewarded ads support free gaming for everyone</div>
          </div>
        )}

        {/* Game iframe */}
        <div style={frameWrap}>
          {loading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: "#fff", zIndex: 2, background: "#0d0d1a" }}>
              <div style={{ width: 48, height: 48, border: "4px solid #ffffff15", borderTopColor: "#ff6b35", borderRadius: "50%", animation: "gspin 0.8s linear infinite" }} />
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 13, color: "#ffffff99" }}>Loading {game.title}...</div>
              <style>{`@keyframes gspin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          <iframe
            key={game.id}
            ref={iframeRef}
            src={game.url}
            title={game.title}
            style={{ width: "100%", height: "100%", border: "none", position: "absolute", top: 0, left: 0, display: loading ? "none" : "block" }}
            onLoad={() => setLoading(false)}
            allow="fullscreen; autoplay; pointer-lock"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals"
          />
        </div>

        {/* Footer */}
        <div style={footer}>
          <span style={{ fontSize: 11, color: "#ffffff33", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            🎮 {game.title}
          </span>

          {/* Rewarded Ad button */}
          {user && (
            <button
              style={{ ...aBtn(false, rewardCooldown ? "#ffffff30" : "#ffd166"), color: rewardCooldown ? "#ffffff44" : "#ffd166" }}
              onClick={handleWatchAd}
              disabled={rewardCooldown}
              title={rewardCooldown ? "Available again in 5 minutes" : "Watch an ad to earn XP"}
            >
              {rewardCooldown ? "⏳ Cooldown" : "📺 Watch Ad +50 XP"}
            </button>
          )}

          {rewardMsg && <span style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700 }}>{rewardMsg}</span>}

          {user && (
            <button style={aBtn(isFav)} onClick={() => toggleFavourite(game.id)}>
              {isFav ? "❤️ Saved" : "🤍 Save"}
            </button>
          )}

          <button style={aBtn(false)} onClick={handleShare}>🔗 Share</button>

          <button style={aBtn(isFullscreen)} onClick={handleFullscreen}>
            {isFullscreen ? "⛶ Exit" : "⛶ Fullscreen"}
          </button>
        </div>

      </div>
    </div>
  );
}
