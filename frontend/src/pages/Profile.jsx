import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

const API_URL = process.env.REACT_APP_API_URL || 'https://gamespark-api.onrender.com';

// Same famous games list — needed to show favourites
const FAMOUS_GAMES = [
  { id: "krunker", title: "Krunker.io", category: "shooter", url: "https://krunker.io/", icon: "🔫" },
  { id: "slither", title: "Slither.io", category: "multiplayer", url: "https://slither.io/", icon: "🐍" },
  { id: "agar",    title: "Agar.io",    category: "multiplayer", url: "https://agar.io/",   icon: "🔵" },
  { id: "2048g",   title: "2048",       category: "puzzle",      url: "https://play2048.co/", icon: "🔢" },
  { id: "chess",   title: "Chess",      category: "strategy",    url: "https://www.chess.com/play/computer", icon: "♟️" },
  { id: "wordle",  title: "Wordle",     category: "casual",      url: "https://wordleunlimited.org/", icon: "🔤" },
  { id: "tetris",  title: "Tetris",     category: "puzzle",      url: "https://tetr.io/", icon: "🟦" },
  { id: "flappy",  title: "Flappy Bird",category: "arcade",      url: "https://flappybird.io/", icon: "🐦" },
  { id: "shell",   title: "Shell Shockers", category: "shooter", url: "https://shellshock.io/", icon: "🥚" },
  { id: "smashkarts", title: "Smash Karts", category: "racing",  url: "https://smashkarts.io/", icon: "🏎️" },
];

export default function Profile() {
  const { user, logout, API } = useAuth();
  const [history, setHistory]   = useState([]);
  const [allGames, setAllGames] = useState(FAMOUS_GAMES);
  const [activeGame, setActiveGame] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) { nav('/login'); return; }
    // Load game history
    axios.get(`${API}/api/games/history`).then(r => setHistory(r.data.sessions)).catch(() => {});
    // Load GamePix games so we can display favourites
    fetch(`${API_URL}/api/games?page=1&limit=96`)
      .then(r => r.json())
      .then(data => {
        const items = data.items || [];
        if (items.length > 0) setAllGames([...FAMOUS_GAMES, ...items]);
      }).catch(() => {});
  }, [user]);

  if (!user) return null;

  // Get full game objects for favourites
  const favouriteGames = (user.favourites || [])
    .map(fid => allGames.find(g => String(g.id) === String(fid)))
    .filter(Boolean);

  const fmtTime = (s) => !s ? '0s' : s < 60 ? `${s}s` : `${Math.floor(s/60)}m`;

  const card  = { background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 12px #0000000a', marginBottom: 16 };
  const sGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10, marginBottom: 16 };
  const sBox  = { background: '#f9fafb', borderRadius: 10, padding: '14px', textAlign: 'center' };
  const sNum  = { fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 700, color: SITE_CONFIG.primaryColor };
  const sLbl  = { fontSize: 11, color: '#6b7280', marginTop: 3, fontWeight: 600 };

  return (
    <>
      <Helmet><title>{user.username} — {SITE_CONFIG.name}</title></Helmet>
      <div style={{ padding: '20px', maxWidth: 860, margin: '0 auto' }}>

        {/* Profile header */}
        <div style={{ ...card, background: 'linear-gradient(135deg,#0d0d1a,#1a1a2e)', color: '#fff', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
            {user.username[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{user.username}</div>
            <div style={{ fontSize: 12, color: '#ffffff77', marginBottom: 8 }}>{user.email}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: `${SITE_CONFIG.primaryColor}`, color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 99 }}>Level {user.level}</span>
              <span style={{ background: '#ffd16620', color: '#ffd166', fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 99 }}>🔥 {user.streak} day streak</span>
              <span style={{ background: '#06d6a020', color: '#06d6a0', fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 99 }}>⚡ {user.xp} XP</span>
            </div>
          </div>
          <button onClick={() => { logout(); nav('/'); }} style={{ background: '#ff4444', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Logout</button>
        </div>

        {/* Stats */}
        <div style={sGrid}>
          {[['🎮', user.gamesPlayed || 0, 'Games Played'], ['⏱️', fmtTime(user.totalPlayTime || 0), 'Total Time'], ['🔥', user.streak || 0, 'Day Streak'], ['⚡', user.xp || 0, 'XP Earned']].map(([icon, val, label]) => (
            <div key={label} style={sBox}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={sNum}>{val}</div>
              <div style={sLbl}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── FAVOURITE GAMES ─────────────────────────────────────────── */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            ❤️ My Favourite Games
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>({favouriteGames.length})</span>
          </div>

          {favouriteGames.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🤍</div>
              No favourites yet! Click the ❤️ Save button while playing a game to add it here.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
              {favouriteGames.map(game => (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game)}
                  style={{ background: game.bg || `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', border: `2px solid ${SITE_CONFIG.primaryColor}30` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {game.thumbnail
                    ? <img src={game.thumbnail} alt={game.title} style={{ width: '100%', height: 90, objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                    : <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>{game.icon || '🎮'}</div>
                  }
                  <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.4)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{game.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: '#ffffff88', fontWeight: 600 }}>{game.category}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: SITE_CONFIG.primaryColor, padding: '1px 7px', borderRadius: 99 }}>▶ Play</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🎖️ Badges Earned</div>
          {user.badges?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {user.badges.map((b, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg,#ffd166,#ff9f43)', color: '#1a1a2e', padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 800 }}>
                  🏅 {b.name}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#6b7280', fontSize: 13 }}>No badges yet. Keep playing to earn them! 🎮</div>
          )}
        </div>

        {/* Game history */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🕐 Recently Played</div>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#f9fafb', borderRadius: 10 }}>
                  <div style={{ fontSize: 20 }}>🎮</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{s.gameTitle}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{new Date(s.startTime).toLocaleDateString('en-IN')} · {s.gameCategory}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 12, fontWeight: 700, color: SITE_CONFIG.primaryColor }}>{fmtTime(s.duration || 0)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#6b7280', fontSize: 13 }}>No games played yet. Start playing!</div>
          )}
        </div>
      </div>

      {/* Game Player Modal */}
      {activeGame && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <iframe
            key={activeGame.id}
            src={activeGame.url}
            title={activeGame.title}
            style={{ width: '90vw', height: '80vh', border: 'none', borderRadius: 12 }}
            allow="fullscreen"
            allowFullScreen
          />
          <button onClick={() => setActiveGame(null)} style={{ position: 'absolute', top: 16, right: 16, background: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 800, cursor: 'pointer' }}>✕ Close</button>
        </div>
      )}
    </>
  );
}
