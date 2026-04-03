import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function GamePlayer({ game, onClose }) {
  const { user, toggleFavourite, API } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const isFav = user?.favourites?.includes(game.id);
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Start tracking session if logged in
    if (user) {
      axios.post(`${API}/api/games/start`, {
        gameId: game.id,
        gameTitle: game.title,
        gameCategory: game.category
      }).then(r => setSessionId(r.data.sessionId)).catch(() => {});
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      // End session on close
      if (sessionId && user) {
        axios.post(`${API}/api/games/end`, { sessionId }).catch(() => {});
      }
    };
  }, []);

  const handleClose = async () => {
    if (sessionId && user) {
      try { await axios.post(`${API}/api/games/end`, { sessionId }); } catch {}
    }
    onClose();
  };

  const ov = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };
  const modal = { background: '#0d0d1a', borderRadius: 16, width: '100%', maxWidth: 960, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
  const header = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #ffffff10' };
  const title = { fontFamily: 'Orbitron,monospace', fontSize: 15, fontWeight: 700, color: '#fff' };
  const closeBtn = { background: '#ffffff18', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: 8, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const frame = { flex: 1, position: 'relative', minHeight: 500 };
  const footer = { padding: '12px 20px', borderTop: '1px solid #ffffff10', display: 'flex', alignItems: 'center', gap: 10 };
  const actionBtn = (liked) => ({ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 99, border: `2px solid ${liked ? '#ff6b35' : '#ffffff30'}`, background: liked ? '#ff6b3520' : 'transparent', color: liked ? '#ff6b35' : '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' });

  return (
    <div style={ov} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div style={modal}>
        <div style={header}>
          <div style={title}>{game.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#ffffff66' }}>⭐ {game.rating} · {game.category}</span>
            <button style={closeBtn} onClick={handleClose}>✕</button>
          </div>
        </div>

        <div style={frame}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#fff' }}>
              <div style={{ width: 44, height: 44, border: '4px solid #ffffff20', borderTopColor: '#ff6b35', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13 }}>Loading {game.title}...</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          <iframe
            src={game.url}
            title={game.title}
            style={{ width: '100%', height: '100%', minHeight: 500, border: 'none', display: loading ? 'none' : 'block' }}
            onLoad={() => setLoading(false)}
            allow="fullscreen"
            allowFullScreen
          />
        </div>

        <div style={footer}>
          <span style={{ fontSize: 12, color: '#ffffff55', flex: 1 }}>🎮 Playing: {game.title}</span>
          {user && (
            <button style={actionBtn(isFav)} onClick={() => toggleFavourite(game.id)}>
              {isFav ? '❤️ Saved' : '🤍 Save'}
            </button>
          )}
          <button style={actionBtn(false)} onClick={() => {
            if (navigator.share) navigator.share({ title: game.title, text: `Play ${game.title} free on GameSpark!`, url: window.location.href });
            else navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'));
          }}>🔗 Share</button>
          <button style={actionBtn(false)} onClick={() => {
            const el = document.querySelector('iframe');
            if (el?.requestFullscreen) el.requestFullscreen();
          }}>⛶ Fullscreen</button>
        </div>
      </div>
    </div>
  );
}
