import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';
import AdZone from '../components/AdZone';
import GameCard from '../components/GameCard';
import GamePlayer from '../components/GamePlayer';

const API_URL = process.env.REACT_APP_API_URL || 'https://gamespark-api.onrender.com';

// Category keyword mapping
const CAT_KEYWORDS = {
  action:      ["action","fight","battle","war","combat"],
  puzzle:      ["puzzle","brain","logic","match","word","quiz"],
  racing:      ["racing","race","car","drive","speed","kart"],
  sports:      ["sport","football","soccer","basketball","tennis","golf","cricket"],
  adventure:   ["adventure","rpg","quest","explore","platform"],
  arcade:      ["arcade","classic","retro","platform","runner"],
  strategy:    ["strategy","chess","board","tower","defense"],
  shooter:     ["shooter","shoot","gun","sniper","battle"],
  casual:      ["casual","idle","clicker","relax","hyper"],
  multiplayer: ["multiplayer","io","online","pvp","versus"],
};

// Famous games per category
const FAMOUS_BY_CAT = {
  shooter:     [{ id: "krunker", title: "Krunker.io", rating: "4.8", badge: "HOT", icon: "🔫", bg: "linear-gradient(135deg,#1e1b4b,#312e81)", url: "https://krunker.io/", category: "shooter" }, { id: "shell", title: "Shell Shockers", rating: "4.7", badge: "HOT", icon: "🥚", bg: "linear-gradient(135deg,#d97706,#b45309)", url: "https://shellshock.io/", category: "shooter" }],
  multiplayer: [{ id: "slither", title: "Slither.io", rating: "4.7", badge: "HOT", icon: "🐍", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://slither.io/", category: "multiplayer" }, { id: "agar", title: "Agar.io", rating: "4.6", badge: "HOT", icon: "🔵", bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", url: "https://agar.io/", category: "multiplayer" }],
  racing:      [{ id: "smashkarts", title: "Smash Karts", rating: "4.8", badge: "HOT", icon: "🏎️", bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", url: "https://smashkarts.io/", category: "racing" }],
  puzzle:      [{ id: "2048g", title: "2048", rating: "4.8", badge: "TOP", icon: "🔢", bg: "linear-gradient(135deg,#d97706,#b45309)", url: "https://play2048.co/", category: "puzzle" }, { id: "wordle", title: "Wordle", rating: "4.9", badge: "HOT", icon: "🔤", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://wordleunlimited.org/", category: "puzzle" }],
  strategy:    [{ id: "chess", title: "Chess", rating: "4.9", badge: "TOP", icon: "♟️", bg: "linear-gradient(135deg,#374151,#1f2937)", url: "https://www.chess.com/play/computer", category: "strategy" }],
  casual:      [{ id: "wordle", title: "Wordle", rating: "4.9", badge: "HOT", icon: "🔤", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://wordleunlimited.org/", category: "casual" }, { id: "solitaire", title: "Solitaire", rating: "4.7", badge: "TOP", icon: "🃏", bg: "linear-gradient(135deg,#065f46,#064e3b)", url: "https://www.solitr.com/klondike-solitaire", category: "casual" }],
  arcade:      [{ id: "flappy", title: "Flappy Bird", rating: "4.5", badge: "HOT", icon: "🐦", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://flappybird.io/", category: "arcade" }, { id: "dino", title: "Dino Run", rating: "4.5", badge: "NEW", icon: "🦕", bg: "linear-gradient(135deg,#78350f,#92400e)", url: "https://chromedino.com/", category: "arcade" }],
};

function badge() { const r = Math.random(); return r > 0.85 ? "HOT" : r > 0.75 ? "NEW" : ""; }

export function CategoryPage() {
  const { cat } = useParams();
  const [games, setGames]     = useState(FAMOUS_BY_CAT[cat] || []);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState(null);
  const seenIds = useRef(new Set((FAMOUS_BY_CAT[cat] || []).map(g => g.id)));

  const label = cat.charAt(0).toUpperCase() + cat.slice(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const keywords = CAT_KEYWORDS[cat] || [cat];
        // Fetch all pages and filter by category
        const res  = await fetch(`${API_URL}/api/games?page=1&limit=96`);
        const data = await res.json();
        const allItems = data.items || [];

        const catGames = allItems
          .filter(g => {
            if (!g.url) return false;
            if (seenIds.current.has(String(g.id))) return false;
            const gameCat = (g.category || '').toLowerCase();
            return keywords.some(kw => gameCat.includes(kw));
          })
          .map(g => {
            seenIds.current.add(String(g.id));
            return { id: String(g.id), title: g.title, category: (g.category || cat).toLowerCase(), thumbnail: g.thumbnail || '', url: g.url, rating: (Math.random() * 1.5 + 3.5).toFixed(1), badge: badge() };
          });

        setGames(prev => [...prev, ...catGames]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [cat]);

  return (
    <>
      <Helmet>
        <title>{label} Games — Play Free {label} Games Online | {SITE_CONFIG.name}</title>
        <meta name="description" content={`Play free ${label} games online on ${SITE_CONFIG.name}. Best ${label} games — no download, no sign-up needed. Updated weekly!`} />
        <meta name="keywords" content={`free ${cat} games, ${cat} games online, browser ${cat} games, play ${cat} games free`} />
        <link rel="canonical" href={`${SITE_CONFIG.url}/category/${cat}`} />
      </Helmet>
      <div style={{ padding: '20px' }}>
        <AdZone slot="2233445566" format="horizontal" style={{ height: 90, marginBottom: 20 }} />
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          {cat === 'action' ? '⚔️' : cat === 'puzzle' ? '🧩' : cat === 'racing' ? '🏎️' : cat === 'sports' ? '⚽' : cat === 'arcade' ? '🕹️' : cat === 'strategy' ? '♟️' : cat === 'shooter' ? '🎯' : cat === 'casual' ? '🎈' : cat === 'multiplayer' ? '👥' : '🗺️'} {label} Games
        </div>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Free {label} games — play instantly in your browser, no download needed.</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 50, color: '#6b7280' }}>Loading {label} games...</div>
        ) : games.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: '#6b7280' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎮</div>
            More {label} games coming soon!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(155px,1fr))', gap: 14 }}>
            {games.map(g => <GameCard key={g.id} game={g} onClick={setActiveGame} />)}
          </div>
        )}

        {activeGame && <GamePlayer game={activeGame} onClose={() => setActiveGame(null)} />}
      </div>
    </>
  );
}

// ── Leaderboard ────────────────────────────────────────────────────────────────
export function Leaderboard() {
  const [lb, setLb]   = useState([]);
  const { API }       = useAuth();
  useEffect(() => {
    fetch(`${API}/api/games/leaderboard`)
      .then(r => r.json()).then(d => setLb(d.leaderboard || [])).catch(() => {});
  }, []);

  const medals = ['🥇','🥈','🥉'];

  return (
    <>
      <Helmet>
        <title>Leaderboard — {SITE_CONFIG.name}</title>
        <meta name="description" content={`See the top players on ${SITE_CONFIG.name}. Who has the highest XP?`} />
      </Helmet>
      <div style={{ padding: '20px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🏆 Top Players</div>
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 12px #0000000a' }}>
          {lb.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>No players yet. Be the first!</div>
          ) : lb.map((u, i) => (
            <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < lb.length-1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ fontSize: 20, width: 32, textAlign: 'center' }}>{medals[i] || `#${i+1}`}</div>
              <div style={{ width: 38, height: 38, background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{u.username[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{u.username}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Level {u.level} · {u.gamesPlayed} games · 🔥 {u.streak} streak</div>
              </div>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: SITE_CONFIG.primaryColor }}>{u.xp} XP</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Privacy ────────────────────────────────────────────────────────────────────
export function Privacy() {
  return (
    <>
      <Helmet><title>Privacy Policy — {SITE_CONFIG.name}</title></Helmet>
      <div style={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: '28px 32px', boxShadow: '0 2px 12px #0000000a', lineHeight: 1.8, color: '#374151', fontSize: 14 }}>
          <h1 style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, color: '#1a1a2e', marginBottom: 16 }}>Privacy Policy</h1>
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString('en-IN')}</p>
          <h2 style={{ marginTop: 18, marginBottom: 6, fontSize: 15 }}>Information We Collect</h2>
          <p>When you create an account on {SITE_CONFIG.name}, we collect your username, email address, and encrypted password. We also track which games you play and how long you play them to provide personalised recommendations and leaderboard features.</p>
          <h2 style={{ marginTop: 18, marginBottom: 6, fontSize: 15 }}>Cookies and Advertising</h2>
          <p>{SITE_CONFIG.name} uses Google AdSense to display advertisements. Google may use cookies to show you relevant ads. You can opt out at <a href="https://adssettings.google.com" style={{ color: SITE_CONFIG.primaryColor }}>adssettings.google.com</a>.</p>
          <h2 style={{ marginTop: 18, marginBottom: 6, fontSize: 15 }}>Contact</h2>
          <p>Email: <a href={`mailto:${SITE_CONFIG.contactEmail}`} style={{ color: SITE_CONFIG.primaryColor }}>{SITE_CONFIG.contactEmail}</a></p>
        </div>
      </div>
    </>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
export function About() {
  return (
    <>
      <Helmet><title>About {SITE_CONFIG.name} — Free Online Games</title></Helmet>
      <div style={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: '28px 32px', boxShadow: '0 2px 12px #0000000a', lineHeight: 1.8, color: '#374151', fontSize: 14 }}>
          <h1 style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, color: '#1a1a2e', marginBottom: 16 }}>About {SITE_CONFIG.name}</h1>
          <p>{SITE_CONFIG.name} is a free online gaming platform where anyone can play {SITE_CONFIG.gamesCount} browser games instantly — no download, no payment, no hassle. Action, puzzle, racing, sports, arcade, strategy, shooter, multiplayer and more.</p>
          <h2 style={{ marginTop: 18, marginBottom: 6, fontSize: 15 }}>Our Mission</h2>
          <p>To provide the best free gaming experience on the internet with new games every week, daily challenges, leaderboards and a community of players.</p>
          <h2 style={{ marginTop: 18, marginBottom: 6, fontSize: 15 }}>Contact Us</h2>
          <p>Email: <a href={`mailto:${SITE_CONFIG.contactEmail}`} style={{ color: SITE_CONFIG.primaryColor }}>{SITE_CONFIG.contactEmail}</a></p>
        </div>
      </div>
    </>
  );
}

// ── Not Found ─────────────────────────────────────────────────────────────────
export function NotFound() {
  const nav = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 64, fontWeight: 900, color: SITE_CONFIG.primaryColor }}>404</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12, marginBottom: 24 }}>Page not found!</div>
      <button onClick={() => nav('/')} style={{ padding: '12px 28px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>Back to Games</button>
    </div>
  );
}

export default Leaderboard;
