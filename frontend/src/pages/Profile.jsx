import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

const API_URL = process.env.REACT_APP_API_URL || 'https://gamespark-api.onrender.com';

const FAMOUS_GAMES = [
  { id: "krunker", title: "Krunker.io", category: "shooter", url: "https://krunker.io/", icon: "🔫", bg: "linear-gradient(135deg,#1e1b4b,#312e81)" },
  { id: "slither", title: "Slither.io", category: "multiplayer", url: "https://slither.io/", icon: "🐍", bg: "linear-gradient(135deg,#15803d,#166534)" },
  { id: "agar",    title: "Agar.io",    category: "multiplayer", url: "https://agar.io/",   icon: "🔵", bg: "linear-gradient(135deg,#0891b2,#0e7490)" },
  { id: "2048g",   title: "2048",       category: "puzzle",      url: "https://play2048.co/", icon: "🔢", bg: "linear-gradient(135deg,#d97706,#b45309)" },
  { id: "chess",   title: "Chess",      category: "strategy",    url: "https://www.chess.com/play/computer", icon: "♟️", bg: "linear-gradient(135deg,#374151,#1f2937)" },
  { id: "wordle",  title: "Wordle",     category: "casual",      url: "https://wordleunlimited.org/", icon: "🔤", bg: "linear-gradient(135deg,#15803d,#166534)" },
  { id: "tetris",  title: "Tetris",     category: "puzzle",      url: "https://tetr.io/", icon: "🟦", bg: "linear-gradient(135deg,#1d4ed8,#1e40af)" },
  { id: "flappy",  title: "Flappy Bird",category: "arcade",      url: "https://flappybird.io/", icon: "🐦", bg: "linear-gradient(135deg,#15803d,#166534)" },
];

export default function Profile() {
  const { user, logout, loading, API } = useAuth();
  const [history, setHistory]   = useState([]);
  const [allGames, setAllGames] = useState(FAMOUS_GAMES);
  const [activeGame, setActiveGame] = useState(null);
  const nav = useNavigate();

  // FIX: Wait for loading to complete before checking auth
  // Without this, page redirects to login on every refresh before token is verified
  useEffect(() => {
    if (loading) return; // Still checking token — don't redirect yet
    if (!user) { nav('/login'); return; }

    axios.get(`${API}/api/games/history`).then(r => setHistory(r.data.sessions)).catch(() => {});
    fetch(`${API_URL}/api/games?page=1&limit=96`)
      .then(r => r.json())
      .then(data => {
        if (data.items?.length > 0) setAllGames([...FAMOUS_GAMES, ...data.items]);
      }).catch(() => {});
  }, [user, loading]);

  // Show spinner while auth is being verified
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTopColor: SITE_CONFIG.primaryColor, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 12, color: '#6b7280' }}>Loading...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user) return null;

  const favouriteGames = (user.favourites || [])
    .map(fid => allGames.find(g => String(g.id) === String(fid)))
    .filter(Boolean);

  const fmtTime = (s) => !s ? '0s' : s < 60 ? `${s}s` : `${Math.floor(s/60)}m`;
  const card = { background: '#fff', borderRadius: 14, padding: '18px', boxShadow: '0 2px 12px #0000000a', marginBottom: 14 };

  return (
    <>
      <Helmet><title>{user.username} — {SITE_CONFIG.name}</title></Helmet>
      <div style={{ padding: '16px', maxWidth: 860, margin: '0 auto' }}>

        {/* Profile header */}
        <div style={{ ...card, background: 'linear-gradient(135deg,#0d0d1a,#1a1a2e)', color: '#fff', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ width: 58, height: 58, background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            {user.username[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{user.username}</div>
            <div style={{ fontSize: 12, color: '#ffffff77', marginBottom: 7 }}>{user.email}</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              <span style={{ background: SITE_CONFIG.primaryColor, color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 99 }}>Level {user.level}</span>
              <span style={{ background: '#ffd16620', color: '#ffd166', fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 99 }}>🔥 {user.streak} streak</span>
              <span style={{ background: '#06d6a020', color: '#06d6a0', fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 99 }}>⚡ {user.xp} XP</span>
            </div>
          </div>
          <button onClick={() => { logout(); nav('/'); }} style={{ background: '#ff4444', border: 'none', color: '#fff', padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Logout</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginBottom: 14 }}>
          {[['🎮', user.gamesPlayed || 0, 'Games Played'], ['⏱️', fmtTime(user.totalPlayTime || 0), 'Total Time'], ['🔥', user.streak || 0, 'Day Streak'], ['⚡', user.xp || 0, 'XP Earned']].map(([icon, val, label]) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '14px', textAlign: 'center', boxShadow: '0 2px 8px #0000000a' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, color: SITE_CONFIG.primaryColor }}>{val}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Favourite games */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            ❤️ My Favourite Games <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>({favouriteGames.length})</span>
          </div>
          {favouriteGames.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🤍</div>
              No favourites yet! Click ❤️ while playing to save games here.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 10 }}>
              {favouriteGames.map(game => (
                <div key={game.id} onClick={() => setActiveGame(game)} style={{ background: game.bg || '#1a1a2e', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
                    {game.thumbnail ? <img src={game.thumbnail} alt={game.title} style={{ width: '100%', height: 80, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} /> : game.icon || '🎮'}
                  </div>
                  <div style={{ padding: '6px 8px', background: 'rgba(0,0,0,0.4)' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{game.title}</div>
                    <div style={{ fontSize: 9, color: '#ffffff66' }}>{game.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>🎖️ Badges</div>
          {user.badges?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {user.badges.map((b, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg,#ffd166,#ff9f43)', color: '#1a1a2e', padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800 }}>🏅 {b.name}</div>
              ))}
            </div>
          ) : <div style={{ color: '#9ca3af', fontSize: 13 }}>Play games to earn badges!</div>}
        </div>

        {/* Game history */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>🕐 Recently Played</div>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', background: '#f9fafb', borderRadius: 9 }}>
                  <div style={{ fontSize: 18 }}>🎮</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{s.gameTitle}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{new Date(s.startTime).toLocaleDateString('en-IN')} · {s.gameCategory}</div>
                  </div>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 12, fontWeight: 700, color: SITE_CONFIG.primaryColor }}>{fmtTime(s.duration || 0)}</div>
                </div>
              ))}
            </div>
          ) : <div style={{ color: '#9ca3af', fontSize: 13 }}>No games played yet!</div>}
        </div>
      </div>

      {activeGame && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 10, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 960, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, color: '#fff' }}>{activeGame.title}</span>
            <button onClick={() => setActiveGame(null)} style={{ background: '#ffffff18', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✕ Close</button>
          </div>
          <iframe key={activeGame.id} src={activeGame.url} title={activeGame.title} style={{ width: '100%', maxWidth: 960, height: 'calc(100dvh - 80px)', border: 'none', borderRadius: 10 }} allow="fullscreen" allowFullScreen sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock" />
        </div>
      )}
    </>
  );
}
