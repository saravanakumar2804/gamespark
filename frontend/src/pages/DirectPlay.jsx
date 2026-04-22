import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GamePlayer from '../components/GamePlayer';
import LoginPrompt from '../components/LoginPrompt';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

// Famous games lookup for direct play links
const FAMOUS_GAMES = {
  "krunker":    { id:"krunker",    title:"Krunker.io",      category:"shooter",     rating:"4.9", icon:"🔫", bg:"linear-gradient(135deg,#1e1b4b,#312e81)", url:"https://krunker.io/" },
  "slither":    { id:"slither",    title:"Slither.io",      category:"multiplayer", rating:"4.8", icon:"🐍", bg:"linear-gradient(135deg,#15803d,#166534)", url:"https://slither.io/" },
  "agar":       { id:"agar",       title:"Agar.io",         category:"multiplayer", rating:"4.7", icon:"🔵", bg:"linear-gradient(135deg,#0891b2,#0e7490)", url:"https://agar.io/" },
  "shell":      { id:"shell",      title:"Shell Shockers",  category:"shooter",     rating:"4.8", icon:"🥚", bg:"linear-gradient(135deg,#d97706,#b45309)", url:"https://shellshock.io/" },
  "smashkarts": { id:"smashkarts", title:"Smash Karts",     category:"racing",      rating:"4.9", icon:"🏎️", bg:"linear-gradient(135deg,#7c3aed,#5b21b6)", url:"https://smashkarts.io/" },
  "1v1lol":     { id:"1v1lol",     title:"1v1.LOL",         category:"shooter",     rating:"4.7", icon:"🏗️", bg:"linear-gradient(135deg,#374151,#1f2937)", url:"https://1v1.lol/" },
  "diep":       { id:"diep",       title:"Diep.io",         category:"shooter",     rating:"4.6", icon:"💥", bg:"linear-gradient(135deg,#dc2626,#b91c1c)", url:"https://diep.io/" },
  "paper":      { id:"paper",      title:"Paper.io 2",      category:"multiplayer", rating:"4.5", icon:"📄", bg:"linear-gradient(135deg,#0f766e,#0d9488)", url:"https://paper-io.com/" },
  "2048g":      { id:"2048g",      title:"2048",            category:"puzzle",      rating:"4.8", icon:"🔢", bg:"linear-gradient(135deg,#d97706,#b45309)", url:"https://play2048.co/" },
  "snakeg":     { id:"snakeg",     title:"Snake Classic",   category:"arcade",      rating:"4.7", icon:"🐍", bg:"linear-gradient(135deg,#15803d,#166534)", url:"https://playsnake.org/" },
  "chess":      { id:"chess",      title:"Chess",           category:"strategy",    rating:"4.9", icon:"♟️", bg:"linear-gradient(135deg,#374151,#1f2937)", url:"https://www.chess.com/play/computer" },
  "wordle":     { id:"wordle",     title:"Wordle",          category:"casual",      rating:"4.9", icon:"🔤", bg:"linear-gradient(135deg,#15803d,#166534)", url:"https://wordleunlimited.org/" },
  "dino":       { id:"dino",       title:"Dino Run",        category:"arcade",      rating:"4.5", icon:"🦕", bg:"linear-gradient(135deg,#78350f,#92400e)", url:"https://chromedino.com/" },
  "tetris":     { id:"tetris",     title:"Tetris",          category:"puzzle",      rating:"4.9", icon:"🟦", bg:"linear-gradient(135deg,#1d4ed8,#1e40af)", url:"https://tetr.io/" },
  "flappy":     { id:"flappy",     title:"Flappy Bird",     category:"arcade",      rating:"4.5", icon:"🐦", bg:"linear-gradient(135deg,#15803d,#166534)", url:"https://flappybird.io/" },
  "pacman":     { id:"pacman",     title:"Pac-Man",         category:"arcade",      rating:"4.8", icon:"👾", bg:"linear-gradient(135deg,#1e1b4b,#312e81)", url:"https://freepacman.org/" },
  "solitaire":  { id:"solitaire",  title:"Solitaire",       category:"casual",      rating:"4.7", icon:"🃏", bg:"linear-gradient(135deg,#065f46,#064e3b)", url:"https://www.solitr.com/klondike-solitaire" },
  "sudoku":     { id:"sudoku",     title:"Sudoku",          category:"puzzle",      rating:"4.8", icon:"🔢", bg:"linear-gradient(135deg,#1d4ed8,#1e40af)", url:"https://sudoku.com/" },
  "mahjong":    { id:"mahjong",    title:"Mahjong",         category:"puzzle",      rating:"4.6", icon:"🀄", bg:"linear-gradient(135deg,#b45309,#92400e)", url:"https://www.mahjong.co/" },
  "memory":     { id:"memory",     title:"Memory Match",    category:"puzzle",      rating:"4.4", icon:"🧠", bg:"linear-gradient(135deg,#7c3aed,#5b21b6)", url:"https://www.helpfulgames.com/subjects/brain-training/memory.html" },
};

export default function DirectPlay() {
  const { gameId }            = useParams();
  const [searchParams]        = useSearchParams();
  const { user, loading }     = useAuth();
  const nav                   = useNavigate();
  const [gameOpen, setGameOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const title = searchParams.get('title') || gameId;
  const game  = FAMOUS_GAMES[gameId] || { id: gameId, title, category: 'game', rating: '4.5', icon: '🎮', bg: 'linear-gradient(135deg,#ff6b35,#7c3aed)', url: '' };

  // Auto-open the game if user is logged in
  React.useEffect(() => {
    if (!loading) {
      if (user) setGameOpen(true);
      else setShowLogin(true);
    }
  }, [user, loading]);

  return (
    <>
      <Helmet>
        <title>Play {game.title} — Challenge on {SITE_CONFIG.name}</title>
        <meta name="description" content={`You've been challenged to play ${game.title} on ${SITE_CONFIG.name}! Can you beat your friend? Play free online now.`} />
      </Helmet>

      {/* Challenge landing page */}
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
        {/* Game preview */}
        <div style={{ width: 100, height: 100, borderRadius: 22, background: game.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, margin: '0 auto 20px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}>
          {game.icon}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ffd16620', border: '1px solid #ffd166', color: '#b45309', fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 99, marginBottom: 14 }}>
          🏆 You've Been Challenged!
        </div>

        <h1 style={{ fontFamily: 'Orbitron,monospace', fontSize: 'clamp(20px,5vw,32px)', fontWeight: 900, color: '#1a1a2e', marginBottom: 10 }}>
          {game.title}
        </h1>

        <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 360, lineHeight: 1.6, marginBottom: 28 }}>
          A friend challenged you to play <strong>{game.title}</strong> on {SITE_CONFIG.name}. Can you beat their score? Play free now!
        </p>

        {/* Action button */}
        {!loading && (
          user ? (
            <button onClick={() => setGameOpen(true)}
              style={{ padding: '14px 40px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 99, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', boxShadow: `0 6px 20px ${SITE_CONFIG.primaryColor}50`, marginBottom: 14 }}>
              🎮 Accept Challenge — Play Now!
            </button>
          ) : (
            <>
              <button onClick={() => nav('/register')}
                style={{ padding: '14px 40px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 99, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', boxShadow: `0 6px 20px ${SITE_CONFIG.primaryColor}50`, marginBottom: 12 }}>
                🚀 Sign Up Free & Accept Challenge
              </button>
              <button onClick={() => nav('/login')}
                style={{ padding: '10px 28px', background: 'transparent', border: `2px solid ${SITE_CONFIG.secondaryColor}`, borderRadius: 99, fontSize: 14, fontWeight: 800, cursor: 'pointer', color: SITE_CONFIG.secondaryColor, fontFamily: 'Nunito,sans-serif' }}>
                Already have an account? Login
              </button>
            </>
          )
        )}

        <button onClick={() => nav('/')} style={{ marginTop: 16, background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
          Browse all games →
        </button>
      </div>

      {/* Direct game player */}
      {gameOpen && game.url && <GamePlayer game={game} onClose={() => { setGameOpen(false); nav('/'); }} />}

      {/* Login prompt */}
      {showLogin && !user && <LoginPrompt game={game} onClose={() => setShowLogin(false)} />}
    </>
  );
}
