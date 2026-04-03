import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import GameCard from '../components/GameCard';
import GamePlayer from '../components/GamePlayer';
import AdZone from '../components/AdZone';
import { useAuth } from '../hooks/useAuth';

const GAMEPIX_KEY = process.env.REACT_APP_GAMEPIX_KEY || '';

// Fallback games that actually embed (open source, verified)
const FALLBACK_GAMES = [
  { id: 'snake', title: 'Snake Classic', category: 'arcade', rating: 4.7, badge: 'HOT', icon: '🐍', bg: 'linear-gradient(135deg,#15803d,#166534)', url: 'https://playsnake.org/' },
  { id: 'tetris', title: 'Tetris', category: 'puzzle', rating: 4.9, badge: 'TOP', icon: '🟦', bg: 'linear-gradient(135deg,#1d4ed8,#1e40af)', url: 'https://tetr.io/' },
  { id: '2048', title: '2048', category: 'puzzle', rating: 4.8, badge: 'HOT', icon: '🔢', bg: 'linear-gradient(135deg,#d97706,#b45309)', url: 'https://play2048.co/' },
  { id: 'chess', title: 'Chess', category: 'strategy', rating: 4.9, badge: 'TOP', icon: '♟️', bg: 'linear-gradient(135deg,#374151,#1f2937)', url: 'https://lichess.org/embed/game/demo' },
  { id: 'flappy', title: 'Flappy Bird', category: 'arcade', rating: 4.5, badge: 'HOT', icon: '🐦', bg: 'linear-gradient(135deg,#15803d,#166534)', url: 'https://flappybird.io/' },
  { id: 'dino', title: 'Dino Jump', category: 'casual', rating: 4.3, badge: 'NEW', icon: '🦕', bg: 'linear-gradient(135deg,#78350f,#92400e)', url: 'https://chromedino.com/' },
  { id: 'mahjong', title: 'Mahjong', category: 'puzzle', rating: 4.6, badge: '', icon: '🀄', bg: 'linear-gradient(135deg,#b45309,#92400e)', url: 'https://www.mahjong.co/' },
  { id: 'solitaire', title: 'Solitaire', category: 'casual', rating: 4.7, badge: 'TOP', icon: '🃏', bg: 'linear-gradient(135deg,#065f46,#064e3b)', url: 'https://www.solitr.com/klondike-solitaire' },
  { id: 'sudoku', title: 'Sudoku', category: 'puzzle', rating: 4.8, badge: '', icon: '🔢', bg: 'linear-gradient(135deg,#1d4ed8,#1e40af)', url: 'https://sudoku.com/' },
  { id: 'pacman', title: 'Pac-Man', category: 'arcade', rating: 4.8, badge: 'HOT', icon: '👾', bg: 'linear-gradient(135deg,#1e1b4b,#312e81)', url: 'https://www.google.com/logos/2010/pacman10-i.html' },
  { id: 'wordle', title: 'Wordle', category: 'casual', rating: 4.9, badge: 'HOT', icon: '🔤', bg: 'linear-gradient(135deg,#15803d,#166534)', url: 'https://wordleunlimited.org/' },
  { id: 'memory', title: 'Memory Match', category: 'puzzle', rating: 4.4, badge: 'NEW', icon: '🧠', bg: 'linear-gradient(135deg,#7c3aed,#5b21b6)', url: 'https://www.helpfulgames.com/subjects/brain-training/memory.html' },
];

const CATEGORIES = ['All', 'Action', 'Puzzle', 'Racing', 'Sports', 'Adventure', 'Arcade', 'Strategy', 'Shooter', 'Casual', 'Multiplayer'];

export default function Home() {
  const [games, setGames] = useState(FALLBACK_GAMES);
  const [filtered, setFiltered] = useState(FALLBACK_GAMES);
  const [activeGame, setActiveGame] = useState(null);
  const [activeCat, setActiveCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();
  const searchQ = new URLSearchParams(location.search).get('search') || '';

  // Load GamePix games
  useEffect(() => {
    if (!GAMEPIX_KEY || GAMEPIX_KEY === 'YOUR_GAMEPIX_API_KEY') {
      setGames(FALLBACK_GAMES);
      setFiltered(FALLBACK_GAMES);
      setLoading(false);
      return;
    }
    fetch(`https://api.gamepix.com/v2/feed?key=${GAMEPIX_KEY}&limit=200`)
      .then(r => r.json())
      .then(data => {
        if (data?.data?.length) {
          const mapped = data.data.map(g => ({
            id: g.id, title: g.title, category: g.categories?.[0] || 'arcade',
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            thumbnail: g.thumbnail, url: g.url, badge: Math.random() > 0.8 ? 'HOT' : Math.random() > 0.9 ? 'NEW' : ''
          }));
          setGames(mapped); setFiltered(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter by category and search
  useEffect(() => {
    let list = games;
    if (activeCat !== 'All') list = list.filter(g => g.category?.toLowerCase() === activeCat.toLowerCase());
    if (searchQ) list = list.filter(g => g.title.toLowerCase().includes(searchQ.toLowerCase()) || g.category?.toLowerCase().includes(searchQ.toLowerCase()));
    setFiltered(list);
  }, [activeCat, searchQ, games]);

  const p = { padding: '24px 28px 60px' };
  const hero = { background: 'linear-gradient(135deg,#0d0d1a,#1a1a2e)', borderRadius: 20, padding: '36px 40px', marginBottom: 28, position: 'relative', overflow: 'hidden' };
  const tag = { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ff6b3520', border: '1px solid #ff6b35', color: '#ff6b35', fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 99, marginBottom: 12 };
  const h1 = { fontFamily: 'Orbitron,monospace', fontSize: 'clamp(20px,3vw,32px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 10 };
  const sub = { color: '#ffffff77', fontSize: 14, fontWeight: 600, marginBottom: 20, maxWidth: 420 };
  const secHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 };
  const secTitle = { fontFamily: 'Orbitron,monospace', fontSize: 15, fontWeight: 700, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: 8 };
  const dot = { width: 8, height: 8, borderRadius: '50%', background: '#ff6b35', boxShadow: '0 0 8px #ff6b35' };
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(165px,1fr))', gap: 16, marginBottom: 32 };
  const catRow = { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24, scrollbarWidth: 'none' };
  const chip = (active) => ({ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', border: `2px solid ${active ? '#ff6b35' : 'transparent'}`, background: active ? '#fff8f5' : '#fff', color: active ? '#ff6b35' : 'var(--dark)', boxShadow: '0 2px 8px #0000000a', transition: 'all 0.2s' });

  return (
    <>
      <Helmet>
        <title>GameSpark — Play 1500+ Free Online Games | No Download Needed</title>
        <meta name="description" content="Play 1500+ free online games on GameSpark. Action, puzzle, racing, sports and more. No download, no sign-up needed. New games added weekly!" />
      </Helmet>

      <div style={p}>
        {/* Top AdSense Banner */}
        <AdZone slot="1234567890" format="horizontal" style={{ height: 90 }} />

        {/* Hero */}
        <div style={hero}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 300, height: 300, background: 'radial-gradient(circle,#ff6b3530,transparent 70%)', pointerEvents: 'none' }} />
          <div style={tag}>⚡ 1500+ Games — 100% Free</div>
          <h1 style={h1}>Play. Compete.<br /><span style={{ color: '#ff6b35' }}>Win Big.</span></h1>
          <p style={sub}>No downloads. No sign-up required. Jump into thousands of free games instantly!</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['1500+','Games'],['Free','Always'],['0','Downloads']].map(([n,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, color: '#06d6a0' }}>{n}</div>
                <div style={{ fontSize: 11, color: '#ffffff55', fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        {user && (
          <div style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 20, padding: '22px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, color: '#fff' }}>
            <div style={{ fontSize: 36, background: '#ffffff20', width: 60, height: 60, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🏆</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, opacity: 0.7, marginBottom: 4 }}>DAILY CHALLENGE</div>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Play 5 games today!</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Complete the challenge to earn 500 XP and a special badge</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 22, fontWeight: 700, color: '#ffd166' }}>{user.gamesPlayed || 0}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>games played today</div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div style={catRow}>
          {CATEGORIES.map(cat => (
            <button key={cat} style={chip(activeCat === cat)} onClick={() => setActiveCat(cat)}>{cat}</button>
          ))}
        </div>

        {/* Search result notice */}
        {searchQ && (
          <div style={{ marginBottom: 16, padding: '10px 16px', background: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
            🔍 Results for "{searchQ}" — {filtered.length} games found
          </div>
        )}

        {/* Games Grid */}
        <div style={secHeader}>
          <div style={secTitle}><div style={dot} /> {searchQ ? 'Search Results' : activeCat === 'All' ? '🔥 Trending Games' : `${activeCat} Games`}</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)', fontWeight: 700 }}>Loading games...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)', fontWeight: 700 }}>No games found. Try another search!</div>
        ) : (
          <div style={grid}>
            {filtered.slice(0, 24).map(game => (
              <GameCard key={game.id} game={game} onClick={setActiveGame} />
            ))}
          </div>
        )}

        {/* Mid AdSense */}
        <AdZone slot="0987654321" format="rectangle" style={{ height: 250 }} />

        {/* More games */}
        {filtered.length > 24 && (
          <>
            <div style={{ ...secHeader, marginTop: 16 }}>
              <div style={secTitle}><div style={dot} /> 🆕 More Games</div>
            </div>
            <div style={grid}>
              {filtered.slice(24).map(game => (
                <GameCard key={game.id} game={game} onClick={setActiveGame} />
              ))}
            </div>
          </>
        )}

        {/* Bottom AdSense */}
        <AdZone slot="1122334455" format="horizontal" style={{ height: 90 }} />

        {/* SEO content for Google */}
        <div style={{ marginTop: 40, padding: '28px', background: '#fff', borderRadius: 16, fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>
          <h2 style={{ fontFamily: 'Orbitron,monospace', fontSize: 16, color: 'var(--dark)', marginBottom: 12 }}>About GameSpark</h2>
          <p>GameSpark is your ultimate destination for free online games. Play over 1500 browser games including action, puzzle, racing, sports, adventure, arcade, strategy, shooter and casual games — all completely free with no download required.</p>
          <p style={{ marginTop: 10 }}>Whether you enjoy challenging puzzle games to train your brain, fast-paced action games, relaxing casual games, or competitive multiplayer games, GameSpark has something for everyone of all ages. New games are added every week!</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {['free online games','browser games','no download games','html5 games','puzzle games free','action games online','racing games','sports games free','arcade games','casual games'].map(kw => (
              <span key={kw} style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{kw}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Game Player Modal */}
      {activeGame && <GamePlayer game={activeGame} onClose={() => setActiveGame(null)} />}
    </>
  );
}
