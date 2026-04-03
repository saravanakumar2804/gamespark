import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, logout, API } = useAuth();
  const [history, setHistory] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) { nav('/login'); return; }
    axios.get(`${API}/api/games/history`).then(r => setHistory(r.data.sessions)).catch(() => {});
  }, [user]);

  if (!user) return null;

  const fmtTime = (s) => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
  const p = { padding: '28px', maxWidth: 800, margin: '0 auto' };
  const card = { background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px #0000000a', marginBottom: 20 };
  const statGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12, marginBottom: 20 };
  const statBox = { background: '#f9fafb', borderRadius: 12, padding: '16px', textAlign: 'center' };
  const statNum = { fontFamily: 'Orbitron,monospace', fontSize: 22, fontWeight: 700, color: '#ff6b35' };
  const statLabel = { fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 };

  return (
    <>
      <Helmet><title>{user.username} — GameSpark Profile</title></Helmet>
      <div style={p}>
        {/* Profile header */}
        <div style={{ ...card, background: 'linear-gradient(135deg,#0d0d1a,#1a1a2e)', color: '#fff', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#ff6b35,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
            {user.username[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user.username}</div>
            <div style={{ fontSize: 13, color: '#ffffff77', marginBottom: 8 }}>{user.email}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ background: '#ff6b35', color: '#fff', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 99 }}>Level {user.level}</span>
              <span style={{ background: '#ffd16620', color: '#ffd166', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 99 }}>🔥 {user.streak} day streak</span>
              <span style={{ background: '#06d6a020', color: '#06d6a0', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 99 }}>⚡ {user.xp} XP</span>
            </div>
          </div>
          <button onClick={() => { logout(); nav('/'); }} style={{ background: '#ff4444', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Logout</button>
        </div>

        {/* Stats */}
        <div style={statGrid}>
          {[['🎮', user.gamesPlayed || 0, 'Games Played'], ['⏱️', fmtTime(user.totalPlayTime || 0), 'Total Time'], ['🔥', user.streak || 0, 'Day Streak'], ['⚡', user.xp || 0, 'XP Earned']].map(([icon, val, label]) => (
            <div key={label} style={statBox}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={statNum}>{val}</div>
              <div style={statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎖️ Badges Earned</div>
          {user.badges?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {user.badges.map((b, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg,#ffd166,#ff9f43)', color: '#1a1a2e', padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 800 }}>
                  🏅 {b.name}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>No badges yet. Keep playing to earn them! 🎮</div>
          )}
        </div>

        {/* Play history */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🕐 Recent Games</div>
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px', background: '#f9fafb', borderRadius: 10 }}>
                  <div style={{ fontSize: 24 }}>🎮</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{s.gameTitle}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(s.startTime).toLocaleDateString('en-IN')} · {s.gameCategory}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, color: '#ff6b35' }}>{fmtTime(s.duration || 0)}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>played</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>No games played yet. Start playing to see your history!</div>
          )}
        </div>
      </div>
    </>
  );
}
