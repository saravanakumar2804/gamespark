import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const API_URL = process.env.REACT_APP_API_URL || "https://gamespark-api.onrender.com";

// Detect if device is touch/mobile
const isMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window);

// ── On-screen D-Pad controller for mobile ────────────────────────────────────
// Simulates keyboard key presses so games that use arrow keys / WASD work on mobile
function MobileController({ visible }) {
  if (!visible) return null;

  const [pressed, setPressed] = useState({});

  const sendKey = (key, down) => {
    const eventType = down ? 'keydown' : 'keyup';
    const iframe = document.querySelector('#game-iframe');
    const target = iframe?.contentWindow || window;

    // Dispatch to iframe content window
    try {
      const evt = new KeyboardEvent(eventType, {
        key, code: key === 'ArrowUp' ? 'ArrowUp' : key === 'ArrowDown' ? 'ArrowDown' : key === 'ArrowLeft' ? 'ArrowLeft' : key === 'ArrowRight' ? 'ArrowRight' : key === ' ' ? 'Space' : key,
        bubbles: true, cancelable: true, keyCode: key === 'ArrowUp' ? 38 : key === 'ArrowDown' ? 40 : key === 'ArrowLeft' ? 37 : key === 'ArrowRight' ? 39 : key === ' ' ? 32 : 65,
      });
      target.document?.dispatchEvent(evt);
      document.dispatchEvent(evt);
    } catch(e) {}

    setPressed(p => ({ ...p, [key]: down }));
  };

  const btn = (key, label, style = {}) => ({
    onTouchStart: (e) => { e.preventDefault(); sendKey(key, true); },
    onTouchEnd:   (e) => { e.preventDefault(); sendKey(key, false); },
    onMouseDown:  (e) => { e.preventDefault(); sendKey(key, true); },
    onMouseUp:    (e) => { e.preventDefault(); sendKey(key, false); },
  });

  const btnStyle = (key) => ({
    width: 52, height: 52,
    borderRadius: 10,
    background: pressed[key] ? 'rgba(255,107,53,0.9)' : 'rgba(255,255,255,0.18)',
    border: `2px solid ${pressed[key] ? '#ff6b35' : 'rgba(255,255,255,0.4)'}`,
    color: '#fff',
    fontSize: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
    transition: 'background 0.1s',
    fontWeight: 800,
  });

  return (
    <div style={{
      position: 'absolute',
      bottom: 60,
      left: 0, right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '0 16px',
      zIndex: 5,
      pointerEvents: 'none',
    }}>
      {/* LEFT: D-Pad */}
      <div style={{ pointerEvents: 'all' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '52px 52px 52px', gridTemplateRows: '52px 52px 52px', gap: 4 }}>
          <div />
          <div style={btnStyle('ArrowUp')} {...btn('ArrowUp', '▲')}>▲</div>
          <div />
          <div style={btnStyle('ArrowLeft')} {...btn('ArrowLeft', '◄')}>◄</div>
          <div style={{ ...btnStyle(' '), fontSize: 11 }} {...btn(' ', 'OK')}>OK</div>
          <div style={btnStyle('ArrowRight')} {...btn('ArrowRight', '►')}>►</div>
          <div />
          <div style={btnStyle('ArrowDown')} {...btn('ArrowDown', '▼')}>▼</div>
          <div />
        </div>
      </div>

      {/* RIGHT: Action buttons */}
      <div style={{ pointerEvents: 'all', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ ...btnStyle('z'), background: 'rgba(124,58,237,0.7)', border: '2px solid #7c3aed', fontSize: 13, fontWeight: 800 }} {...btn('z', 'B')}>B</div>
          <div style={{ ...btnStyle('x'), background: 'rgba(6,214,160,0.7)', border: '2px solid #06d6a0', fontSize: 13, fontWeight: 800 }} {...btn('x', 'A')}>A</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ ...btnStyle('Enter'), background: 'rgba(255,107,53,0.7)', border: '2px solid #ff6b35', fontSize: 11, fontWeight: 800 }} {...btn('Enter', '↵')}>↵</div>
          <div style={{ ...btnStyle('Escape'), background: 'rgba(107,114,128,0.7)', border: '2px solid #6b7280', fontSize: 10, fontWeight: 800 }} {...btn('Escape', 'ESC')}>ESC</div>
        </div>
      </div>
    </div>
  );
}

// ── Main GamePlayer ───────────────────────────────────────────────────────────
export default function GamePlayer({ game, onClose }) {
  const { user, toggleFavourite, API } = useAuth();
  const [loading, setLoading]         = useState(true);
  const [sessionId, setSessionId]     = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [rewardCooldown, setRewardCooldown] = useState(false);
  const [xpPopup, setXpPopup]         = useState(null);
  const [mobile, setMobile]           = useState(isMobile());
  const iframeRef = useRef(null);
  const isFav = user?.favourites?.includes(game.id);

  useEffect(() => {
    if (user) {
      axios.post(`${API}/api/games/start`, {
        gameId: game.id, gameTitle: game.title, gameCategory: game.category,
      }).then(r => setSessionId(r.data.sessionId)).catch(() => {});
    }
    document.body.style.overflow = "hidden";
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    const onResize = () => setMobile(isMobile());
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("fullscreenchange", onFsChange);
      window.removeEventListener('resize', onResize);
    };
  }, [game.id]);

  const handleClose = async () => {
    if (sessionId && user) {
      try { await axios.post(`${API}/api/games/end`, { sessionId }); } catch {}
    }
    if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} }
    onClose();
  };

  const handleFullscreen = async () => {
    const el = document.getElementById("game-modal-container");
    try {
      if (!document.fullscreenElement) await el?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      try {
        const f = iframeRef.current;
        if (f?.requestFullscreen) await f.requestFullscreen();
        else if (f?.webkitRequestFullscreen) f.webkitRequestFullscreen();
      } catch {}
    }
  };

  const handleWatchAd = () => { if (!rewardCooldown && user) setShowRewardAd(true); };

  const handleAdWatched = async () => {
    setShowRewardAd(false);
    try {
      const res = await axios.post(`${API}/api/games/reward-ad`, { xpAmount: 50 });
      if (res.data.success) {
        setXpPopup(`+${res.data.xpEarned} XP!`);
        setTimeout(() => setXpPopup(null), 3000);
        setRewardCooldown(true);
        setTimeout(() => setRewardCooldown(false), 5 * 60 * 1000);
      }
    } catch {}
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: game.title, url: window.location.origin });
    else navigator.clipboard.writeText(window.location.origin).then(() => alert("Link copied!"));
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const overlay = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)",
    zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 6,
  };
  const modal = {
    background: "#0d0d1a", borderRadius: 12, width: "100%", maxWidth: 1000,
    height: "calc(100dvh - 12px)", maxHeight: "calc(100dvh - 12px)",
    display: "flex", flexDirection: "column", overflow: "hidden",
    position: "relative",
  };
  const header = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 12px", borderBottom: "1px solid #ffffff10", flexShrink: 0,
  };
  const footer = {
    display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
    borderTop: "1px solid #ffffff10", flexShrink: 0, flexWrap: "wrap",
  };
  const aBtn = (active, color) => ({
    display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 99,
    border: `2px solid ${color || (active ? "#ff6b35" : "#ffffff30")}`,
    background: active ? "#ff6b3520" : "transparent",
    color: color || (active ? "#ff6b35" : "#fff"),
    fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito,sans-serif", whiteSpace: "nowrap",
  });

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div style={modal} id="game-modal-container">

        {/* Header */}
        <div style={header}>
          <div style={{ fontFamily: "Orbitron,monospace", fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "55%" }}>
            {game.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: "#ffffff44" }}>⭐ {game.rating} · {game.category}</span>
            <button onClick={handleClose} style={{ background: "#ffffff18", border: "none", color: "#fff", width: 26, height: 26, borderRadius: 6, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* XP popup */}
        {xpPopup && (
          <div style={{ position: "absolute", top: 50, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#ff6b35,#ff8c42)", color: "#fff", padding: "8px 20px", borderRadius: 99, fontSize: 14, fontWeight: 800, zIndex: 10, fontFamily: "Orbitron,monospace" }}>
            {xpPopup}
          </div>
        )}

        {/* Rewarded Ad */}
        {showRewardAd && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontFamily: "Orbitron,monospace", fontSize: 16, fontWeight: 700, color: "#fff" }}>Watch Ad → Earn 50 XP</div>
            <div style={{ width: 300, height: 200, background: "#1a1a2e", border: "2px solid #ff6b35", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 36 }}>📺</div>
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 12, color: "#ff6b35" }}>Advertisement</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowRewardAd(false)} style={{ padding: "9px 20px", background: "transparent", border: "2px solid #ffffff30", color: "#ffffff77", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito,sans-serif" }}>Skip</button>
              <button onClick={handleAdWatched} style={{ padding: "9px 24px", background: "linear-gradient(135deg,#ff6b35,#ff8c42)", border: "none", color: "#fff", borderRadius: 99, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "Nunito,sans-serif" }}>✅ Claim 50 XP</button>
            </div>
          </div>
        )}

        {/* Game area */}
        <div style={{ flex: 1, position: "relative", background: "#000", minHeight: 0, overflow: "hidden" }}>
          {loading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff", zIndex: 2, background: "#0d0d1a" }}>
              <div style={{ width: 44, height: 44, border: "4px solid #ffffff15", borderTopColor: "#ff6b35", borderRadius: "50%", animation: "gspin 0.8s linear infinite" }} />
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 12, color: "#ffffff88" }}>Loading {game.title}...</div>
              <style>{`@keyframes gspin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          <iframe
            key={game.id}
            id="game-iframe"
            ref={iframeRef}
            src={game.url}
            title={game.title}
            style={{ width: "100%", height: "100%", border: "none", position: "absolute", top: 0, left: 0, display: loading ? "none" : "block" }}
            onLoad={() => setLoading(false)}
            allow="fullscreen; autoplay; pointer-lock"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals"
          />

          {/* Mobile D-Pad controls — shown when user toggles */}
          {mobile && !loading && (
            <MobileController visible={showControls} />
          )}

          {/* Mobile controls toggle button — floating */}
          {mobile && !loading && (
            <button
              onClick={() => setShowControls(c => !c)}
              style={{
                position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)',
                background: showControls ? '#ff6b35' : 'rgba(255,255,255,0.2)',
                border: `2px solid ${showControls ? '#ff6b35' : 'rgba(255,255,255,0.4)'}`,
                color: '#fff', borderRadius: 99, padding: '6px 16px',
                fontSize: 12, fontWeight: 800, cursor: 'pointer', zIndex: 6,
                fontFamily: 'Nunito,sans-serif', whiteSpace: 'nowrap',
              }}
            >
              {showControls ? '🎮 Hide Controls' : '🎮 Show Controls'}
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={footer}>
          <span style={{ fontSize: 10, color: "#ffffff33", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🎮 {game.title}</span>

          {user && (
            <button style={aBtn(false, rewardCooldown ? "#ffffff30" : "#ffd166")} onClick={handleWatchAd} disabled={rewardCooldown}>
              {rewardCooldown ? "⏳" : "📺 +50 XP"}
            </button>
          )}

          {user && (
            <button style={aBtn(isFav)} onClick={() => toggleFavourite(game.id)}>
              {isFav ? "❤️" : "🤍"}
            </button>
          )}

          <button style={aBtn(false)} onClick={handleShare}>🔗</button>
          <button style={aBtn(isFullscreen)} onClick={handleFullscreen}>⛶</button>
        </div>
      </div>
    </div>
  );
}
