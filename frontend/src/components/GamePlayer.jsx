import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function GamePlayer({ game, onClose }) {
  const { user, toggleFavourite, API } = useAuth();
  const [loading, setLoading]   = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const isFav = user?.favourites?.includes(game.id);

  useEffect(() => {
    // Start session tracking
    if (user) {
      axios.post(`${API}/api/games/start`, {
        gameId:       game.id,
        gameTitle:    game.title,
        gameCategory: game.category,
      }).then(r => setSessionId(r.data.sessionId)).catch(() => {});
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [game.id]); // depend on game.id so it re-runs if a new game opens

  const handleClose = async () => {
    if (sessionId && user) {
      try { await axios.post(`${API}/api/games/end`, { sessionId }); } catch {}
    }
    onClose();
  };

  // ── Styles ──────────────────────────────────────────────────────────────
  const ov     = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
  const modal  = { background: "#0d0d1a", borderRadius: 16, width: "100%", maxWidth: 980, maxHeight: "95vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 30px 80px #00000080" };
  const header = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid #ffffff10" };
  const footer = { padding: "10px 18px", borderTop: "1px solid #ffffff10", display: "flex", alignItems: "center", gap: 10 };
  const aBtn   = liked => ({ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 99, border: `2px solid ${liked ? "#ff6b35" : "#ffffff30"}`, background: liked ? "#ff6b3520" : "transparent", color: liked ? "#ff6b35" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito,sans-serif" });

  return (
    <div style={ov} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div style={modal}>

        {/* Header */}
        <div style={header}>
          <div style={{ fontFamily: "Orbitron,monospace", fontSize: 14, fontWeight: 700, color: "#fff" }}>
            {game.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#ffffff55" }}>⭐ {game.rating} · {game.category}</span>
            <button onClick={handleClose} style={{ background: "#ffffff18", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 8, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* Game frame */}
        <div style={{ flex: 1, position: "relative", minHeight: 520, background: "#000" }}>
          {loading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: "#fff", zIndex: 2 }}>
              <div style={{ width: 44, height: 44, border: "4px solid #ffffff20", borderTopColor: "#ff6b35", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 13 }}>Loading {game.title}...</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/*
            KEY FIX: The "key" prop = game.id forces React to completely
            destroy and recreate the iframe every time a different game opens.
            Without this, the iframe just changes its src but keeps the old
            game running — which was causing "all games show same game" bug.
          */}
          <iframe
            key={game.id}
            src={game.url}
            title={game.title}
            style={{ width: "100%", height: "100%", minHeight: 520, border: "none", display: loading ? "none" : "block" }}
            onLoad={() => setLoading(false)}
            allow="fullscreen; autoplay"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
          />
        </div>

        {/* Footer actions */}
        <div style={footer}>
          <span style={{ fontSize: 12, color: "#ffffff44", flex: 1 }}>🎮 {game.title}</span>

          {user && (
            <button style={aBtn(isFav)} onClick={() => toggleFavourite(game.id)}>
              {isFav ? "❤️ Saved" : "🤍 Save"}
            </button>
          )}

          <button style={aBtn(false)} onClick={() => {
            const text = `Play ${game.title} free on GameSpark!\n${window.location.origin}`;
            if (navigator.share) navigator.share({ title: game.title, text, url: window.location.origin });
            else navigator.clipboard.writeText(window.location.origin).then(() => alert("Link copied!"));
          }}>🔗 Share</button>

          <button style={aBtn(false)} onClick={() => {
            const el = document.querySelector("iframe");
            if (el?.requestFullscreen) el.requestFullscreen();
            else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen();
          }}>⛶ Fullscreen</button>
        </div>

      </div>
    </div>
  );
}
