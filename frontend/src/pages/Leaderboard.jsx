// Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export function Leaderboard() {
  const [lb, setLb] = useState([]);
  const { API } = useAuth();
  useEffect(() => { axios.get(`${API}/api/games/leaderboard`).then(r => setLb(r.data.leaderboard)).catch(() => {}); }, []);
  const medals = ['🥇','🥈','🥉'];
  const p = { padding: 28, maxWidth: 700, margin: '0 auto' };
  const card = { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px #0000000a' };
  return (
    <>
      <Helmet><title>Leaderboard — GameSpark</title><meta name="description" content="See the top GameSpark players. Who has the highest XP and longest streak?" /></Helmet>
      <div style={p}>
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>🏆 Top Players</div>
        <div style={card}>
          {lb.length === 0 ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No players yet. Be the first!</div> : lb.map((u, i) => (
            <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < lb.length-1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ fontSize: 22, width: 36, textAlign: 'center' }}>{medals[i] || `#${i+1}`}</div>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#ff6b35,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{u.username[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{u.username}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Level {u.level} · {u.gamesPlayed} games · 🔥 {u.streak} streak</div>
              </div>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 16, fontWeight: 700, color: '#ff6b35' }}>{u.xp} XP</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// CategoryPage.jsx
// import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import GamePlayer from '../components/GamePlayer';
import AdZone from '../components/AdZone';

const FALLBACK = [
  { id: 'snake', title: 'Snake Classic', category: 'arcade', rating: 4.7, badge: 'HOT', icon: '🐍', bg: 'linear-gradient(135deg,#15803d,#166534)', url: 'https://playsnake.org/' },
  { id: 'tetris', title: 'Tetris', category: 'puzzle', rating: 4.9, badge: 'TOP', icon: '🟦', bg: 'linear-gradient(135deg,#1d4ed8,#1e40af)', url: 'https://tetr.io/' },
  { id: '2048', title: '2048', category: 'puzzle', rating: 4.8, badge: 'HOT', icon: '🔢', bg: 'linear-gradient(135deg,#d97706,#b45309)', url: 'https://play2048.co/' },
  { id: 'chess', title: 'Chess', category: 'strategy', rating: 4.9, badge: 'TOP', icon: '♟️', bg: 'linear-gradient(135deg,#374151,#1f2937)', url: 'https://lichess.org/embed/game/demo' },
  { id: 'dino', title: 'Dino Jump', category: 'casual', rating: 4.3, badge: 'NEW', icon: '🦕', bg: 'linear-gradient(135deg,#78350f,#92400e)', url: 'https://chromedino.com/' },
  { id: 'solitaire', title: 'Solitaire', category: 'casual', rating: 4.7, badge: 'TOP', icon: '🃏', bg: 'linear-gradient(135deg,#065f46,#064e3b)', url: 'https://www.solitr.com/klondike-solitaire' },
  { id: 'sudoku', title: 'Sudoku', category: 'puzzle', rating: 4.8, badge: '', icon: '🔢', bg: 'linear-gradient(135deg,#1d4ed8,#1e40af)', url: 'https://sudoku.com/' },
  { id: 'wordle', title: 'Wordle', category: 'casual', rating: 4.9, badge: 'HOT', icon: '🔤', bg: 'linear-gradient(135deg,#15803d,#166534)', url: 'https://wordleunlimited.org/' },
];

export function CategoryPage() {
  const { cat } = useParams();
  const [activeGame, setActiveGame] = useState(null);
  const filtered = FALLBACK.filter(g => g.category === cat);
  const label = cat.charAt(0).toUpperCase() + cat.slice(1);
  const p = { padding: 28 };
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(165px,1fr))', gap: 16 };
  return (
    <>
      <Helmet><title>{label} Games — GameSpark Free Online Games</title><meta name="description" content={`Play free ${label} games online on GameSpark. No download needed. Best ${label} games for all ages!`} /></Helmet>
      <div style={p}>
        <AdZone slot="2233445566" format="horizontal" style={{ height: 90, marginBottom: 24 }} />
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{label} Games</div>
        {filtered.length === 0
          ? <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>More {label} games coming soon! Add your GamePix API key for 1500+ games.</div>
          : <div style={grid}>{filtered.map(g => <GameCard key={g.id} game={g} onClick={setActiveGame} />)}</div>
        }
        {activeGame && <GamePlayer game={activeGame} onClose={() => setActiveGame(null)} />}
      </div>
    </>
  );
}

// Privacy.jsx
export function Privacy() {
  const p = { padding: 28, maxWidth: 800, margin: '0 auto' };
  const card = { background: '#fff', borderRadius: 16, padding: '32px 36px', boxShadow: '0 2px 12px #0000000a', lineHeight: 1.8, color: '#374151', fontSize: 14 };
  return (
    <>
      <Helmet><title>Privacy Policy — GameSpark</title></Helmet>
      <div style={p}>
        <div style={card}>
          <h1 style={{ fontFamily: 'Orbitron,monospace', fontSize: 22, color: 'var(--dark)', marginBottom: 20 }}>Privacy Policy</h1>
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString('en-IN')}</p>
          <h2 style={{ marginTop: 20, marginBottom: 8, fontSize: 16 }}>Information We Collect</h2>
          <p>When you create an account on GameSpark, we collect your username, email address, and encrypted password. We also track which games you play and how long you play them to provide personalised recommendations and leaderboard features.</p>
          <h2 style={{ marginTop: 20, marginBottom: 8, fontSize: 16 }}>How We Use Your Information</h2>
          <p>Your information is used to maintain your account, track your gaming progress, display leaderboard rankings, and improve our services. We do not sell your personal information to third parties.</p>
          <h2 style={{ marginTop: 20, marginBottom: 8, fontSize: 16 }}>Cookies and Advertising</h2>
          <p>GameSpark uses Google AdSense to display advertisements. Google may use cookies to show you relevant ads based on your browsing history. You can opt out of personalised advertising at <a href="https://adssettings.google.com" style={{ color: '#ff6b35' }}>adssettings.google.com</a>.</p>
          <h2 style={{ marginTop: 20, marginBottom: 8, fontSize: 16 }}>Data Security</h2>
          <p>All passwords are encrypted using bcrypt. We use HTTPS for all data transmission. Your data is stored securely on MongoDB Atlas servers.</p>
          <h2 style={{ marginTop: 20, marginBottom: 8, fontSize: 16 }}>Contact</h2>
          <p>For privacy concerns, contact us at: <a href="mailto:admin@gamespark.com" style={{ color: '#ff6b35' }}>admin@gamespark.com</a></p>
        </div>
      </div>
    </>
  );
}

// About.jsx
export function About() {
  const p = { padding: 28, maxWidth: 800, margin: '0 auto' };
  const card = { background: '#fff', borderRadius: 16, padding: '32px 36px', boxShadow: '0 2px 12px #0000000a', lineHeight: 1.8, color: '#374151', fontSize: 14 };
  return (
    <>
      <Helmet><title>About GameSpark — Free Online Games</title></Helmet>
      <div style={p}>
        <div style={card}>
          <h1 style={{ fontFamily: 'Orbitron,monospace', fontSize: 22, color: 'var(--dark)', marginBottom: 20 }}>About GameSpark</h1>
          <p>GameSpark is a free online gaming platform where anyone can play 1500+ browser games instantly — no download, no payment, no hassle. We believe fun should be accessible to everyone.</p>
          <p style={{ marginTop: 14 }}>Our platform features action games, puzzle games, racing games, sports games, arcade classics, strategy games and much more — all playable directly in your browser on any device.</p>
          <h2 style={{ marginTop: 20, marginBottom: 8, fontSize: 16 }}>Our Mission</h2>
          <p>To provide the best free gaming experience on the internet — with new games added every week, daily challenges, leaderboards and a community of players who love to compete and have fun.</p>
          <h2 style={{ marginTop: 20, marginBottom: 8, fontSize: 16 }}>Contact Us</h2>
          <p>Email: <a href="mailto:admin@gamespark.com" style={{ color: '#ff6b35' }}>admin@gamespark.com</a></p>
        </div>
      </div>
    </>
  );
}

// NotFound.jsx
import { useNavigate } from 'react-router-dom';
export function NotFound() {
  const nav = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 64, fontWeight: 900, color: '#ff6b35' }}>404</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 12, marginBottom: 24 }}>Page not found!</div>
      <button onClick={() => nav('/')} style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Back to Games</button>
    </div>
  );
}

export default Leaderboard;
