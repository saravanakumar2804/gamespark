import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function GamePlayer({ game, onClose }) {
  const { user, toggleFavourite, API } = useAuth();
  const [loading, setLoading]     = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const isFav = user?.favourites?.includes(game.id);

  useEffect(() => {
    if (user) {
      axios.post(`${API}/api/games/start`, {
        gameId: game.id, gameTitle: game.title, gameCategory: game.category,
      }).then(r => setSessionId(r.data.sessionId)).catch(() => {});
    }
    document.body.style.overflow = "hidden";

    // Listen for fullscreen changes so button stays in sync
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
    // Exit fullscreen if open
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch {}
    }
    onClose();
  };

  // FIX: fullscreen the modal CONTAINER (not just iframe)
  // This prevents the black screen that happens when only the iframe goes fullscreen
  const handleFullscreen = async () => {
    const container = document.getElementById("game-modal-container");
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      // Fallback: try fullscreening the iframe directly
      try {
        const iframe = iframeRef.current;
        if (iframe?.requestFullscreen) await iframe.requestFullscreen();
        else if (iframe?.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
      } catch {}
    }
  };

  const handleShare = () => {
    const text = `Play ${game.title} free online — no download needed!\n${window.location.origin}`;
    if (navigator.share) {
      navigator.share({ title: game.title, text, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}`).then(() => alert("Link copied!"));
    }
  };

  // ── Styles ──────────────────────────────────────────────────────────────
  const overlay = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.94)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
  };

  const modalStyle = {
    background: "#0d0d1a",
    borderRadius: 14,
    width: "100%",
    // FIX: use dvh (dynamic viewport height) on mobile so browser chrome doesn't cut it off
    maxWidth: 1000,
    height: "calc(100dvh - 16px)",
    maxHeight: "calc(100dvh - 16px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 30px 80px #00000080",
  };

  const header = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px", borderBottom: "1px solid #ffffff10",
    flexShrink: 0,
  };

  const frameWrap = {
    flex: 1,
    position: "relative",
    background: "#000",
    // FIX: min-height 0 so flex child doesn't overflow on mobile
    minHeight: 0,
    overflow: "hidden",
  };

  const iframeStyle = {
    width: "100%",
    height: "100%",
    border: "none",
    display: loading ? "none" : "block",
    // FIX: ensure iframe fills the container fully on mobile
    position: "absolute",
    top: 0, left: 0,
  };

  const footer = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderTop: "1px solid #ffffff10",
    flexShrink: 0, flexWrap: "wrap",
  };

  const aBtn = (active) => ({
    display: "flex", alignItems: "center", gap: 5,
    padding: "6px 12px", borderRadius: 99,
    border: `2px solid ${active ? "#ff6b35" : "#ffffff30"}`,
    background: active ? "#ff6b3520" : "transparent",
    color: active ? "#ff6b35" : "#fff",
    fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: "Nunito,sans-serif",
    whiteSpace: "nowrap",
  });

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
      {/* id needed for fullscreen targeting */}
      <div style={modalStyle} id="game-modal-container">

        {/* Header */}
        <div style={header}>
          <div style={{ fontFamily: "Orbitron,monospace", fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
            {game.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#ffffff55" }}>⭐ {game.rating} · {game.category}</span>
            <button onClick={handleClose} style={{ background: "#ffffff18", border: "none", color: "#fff", width: 28, height: 28, borderRadius: 7, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* Game iframe */}
        <div style={frameWrap}>
          {/* Loading spinner — no mention of GamePix */}
          {loading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: "#fff", zIndex: 2, background: "#0d0d1a" }}>
              <div style={{ width: 48, height: 48, border: "4px solid #ffffff15", borderTopColor: "#ff6b35", borderRadius: "50%", animation: "gspin 0.8s linear infinite" }} />
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 13, color: "#ffffff99" }}>
                Loading {game.title}...
              </div>
              <style>{`@keyframes gspin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/*
            KEY FIX: key={game.id} forces React to destroy + recreate
            iframe every time a new game opens — prevents same-game bug
          */}
          <iframe
            key={game.id}
            ref={iframeRef}
            src={game.url}
            title={game.title}
            style={iframeStyle}
            onLoad={() => setLoading(false)}
            allow="fullscreen; autoplay; pointer-lock"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals"
          />
        </div>

        {/* Footer actions */}
        <div style={footer}>
          <span style={{ fontSize: 11, color: "#ffffff33", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            🎮 {game.title}
          </span>

          {user && (
            <button style={aBtn(isFav)} onClick={() => toggleFavourite(game.id)}>
              {isFav ? "❤️ Saved" : "🤍 Save"}
            </button>
          )}

          <button style={aBtn(false)} onClick={handleShare}>
            🔗 Share
          </button>

          <button style={aBtn(isFullscreen)} onClick={handleFullscreen}>
            {isFullscreen ? "⛶ Exit" : "⛶ Fullscreen"}
          </button>
        </div>

      </div>
    </div>
  );
}
