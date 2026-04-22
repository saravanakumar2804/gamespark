import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

// Built-in famous games for fast lookup
const FAMOUS_GAMES = {
  "krunker":    { url:"https://krunker.io/",         icon:"🔫", bg:"linear-gradient(135deg,#1e1b4b,#312e81)" },
  "slither":    { url:"https://slither.io/",         icon:"🐍", bg:"linear-gradient(135deg,#15803d,#166534)" },
  "agar":       { url:"https://agar.io/",            icon:"🔵", bg:"linear-gradient(135deg,#0891b2,#0e7490)" },
  "shell":      { url:"https://shellshock.io/",      icon:"🥚", bg:"linear-gradient(135deg,#d97706,#b45309)" },
  "smashkarts": { url:"https://smashkarts.io/",      icon:"🏎️", bg:"linear-gradient(135deg,#7c3aed,#5b21b6)" },
  "1v1lol":     { url:"https://1v1.lol/",            icon:"🏗️", bg:"linear-gradient(135deg,#374151,#1f2937)" },
  "diep":       { url:"https://diep.io/",            icon:"💥", bg:"linear-gradient(135deg,#dc2626,#b91c1c)" },
  "paper":      { url:"https://paper-io.com/",       icon:"📄", bg:"linear-gradient(135deg,#0f766e,#0d9488)" },
  "2048g":      { url:"https://play2048.co/",        icon:"🔢", bg:"linear-gradient(135deg,#d97706,#b45309)" },
  "snakeg":     { url:"https://playsnake.org/",      icon:"🐍", bg:"linear-gradient(135deg,#15803d,#166534)" },
  "chess":      { url:"https://www.chess.com/play/computer", icon:"♟️", bg:"linear-gradient(135deg,#374151,#1f2937)" },
  "wordle":     { url:"https://wordleunlimited.org/", icon:"🔤", bg:"linear-gradient(135deg,#15803d,#166534)" },
  "dino":       { url:"https://chromedino.com/",     icon:"🦕", bg:"linear-gradient(135deg,#78350f,#92400e)" },
  "tetris":     { url:"https://tetr.io/",            icon:"🟦", bg:"linear-gradient(135deg,#1d4ed8,#1e40af)" },
  "flappy":     { url:"https://flappybird.io/",      icon:"🐦", bg:"linear-gradient(135deg,#15803d,#166534)" },
  "pacman":     { url:"https://freepacman.org/",     icon:"👾", bg:"linear-gradient(135deg,#1e1b4b,#312e81)" },
  "solitaire":  { url:"https://www.solitr.com/klondike-solitaire", icon:"🃏", bg:"linear-gradient(135deg,#065f46,#064e3b)" },
  "sudoku":     { url:"https://sudoku.com/",         icon:"🔢", bg:"linear-gradient(135deg,#1d4ed8,#1e40af)" },
  "mahjong":    { url:"https://www.mahjong.co/",     icon:"🀄", bg:"linear-gradient(135deg,#b45309,#92400e)" },
  "memory":     { url:"https://www.helpfulgames.com/subjects/brain-training/memory.html", icon:"🧠", bg:"linear-gradient(135deg,#7c3aed,#5b21b6)" },
};

export default function DirectPlay() {
  const { gameId }        = useParams();
  const [searchParams]    = useSearchParams();
  const { user, loading } = useAuth();
  const nav               = useNavigate();

  const [gameOpen, setGameOpen] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  // Build game object from query params + fallback lookup
  const title   = searchParams.get('title') || decodeURIComponent(gameId || 'Game');
  // FIX: URL comes from the challenge link query param — this works for ALL games including GamePix
  const gameUrl = searchParams.get('url') ? decodeURIComponent(searchParams.get('url')) : (FAMOUS_GAMES[gameId]?.url || '');
  const icon    = FAMOUS_GAMES[gameId]?.icon || '🎮';
  const bg      = FAMOUS_GAMES[gameId]?.bg   || `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`;

  const game = { id: gameId, title, url: gameUrl, category: 'challenge', rating: '4.8', icon, bg };

  // Once auth finishes loading, if user is logged in → auto-open game
  useEffect(() => {
    if (!loading) setGameReady(true);
  }, [loading]);

  // Loading state
  if (!gameReady) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f2f8' }}>
        <div style={{ width:36, height:36, border:`4px solid #f0f0f0`, borderTopColor:SITE_CONFIG.primaryColor, borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // If no game URL found — show friendly error
  if (!gameUrl) {
    return (
      <div style={{ minHeight:'70vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>😕</div>
        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:20, color:'#1a1a2e', marginBottom:10 }}>Game Not Found</h1>
        <p style={{ color:'#6b7280', marginBottom:20 }}>This challenge link may have expired or the game is no longer available.</p>
        <button onClick={()=>nav('/')} style={{ padding:'11px 28px', background:`linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color:'#fff', border:'none', borderRadius:99, fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>Browse All Games</button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Challenge: Play {title} — {SITE_CONFIG.name}</title>
        <meta name="description" content={`You've been challenged to play ${title} on ${SITE_CONFIG.name}! Accept and beat your friend. Play free online now.`} />
      </Helmet>

      {/* Challenge landing */}
      <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, textAlign:'center' }}>

        {/* Game icon */}
        <div style={{ width:96, height:96, borderRadius:22, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, margin:'0 auto 18px', boxShadow:'0 12px 32px rgba(0,0,0,0.12)' }}>
          {icon}
        </div>

        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#ffd16615', border:'1px solid #ffd166', color:'#92400e', fontSize:12, fontWeight:800, padding:'4px 14px', borderRadius:99, marginBottom:14 }}>
          🏆 You've Been Challenged!
        </div>

        <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'clamp(20px,5vw,30px)', fontWeight:900, color:'#1a1a2e', marginBottom:10 }}>
          {title}
        </h1>

        <p style={{ color:'#6b7280', fontSize:14, maxWidth:360, lineHeight:1.65, marginBottom:30 }}>
          A friend challenged you to play <strong>{title}</strong> on {SITE_CONFIG.name}. Can you beat their score? Play free now!
        </p>

        {user ? (
          /* Logged in — open game directly */
          <button
            onClick={() => setGameOpen(true)}
            style={{ padding:'14px 44px', background:`linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color:'#fff', border:'none', borderRadius:99, fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:`0 6px 22px ${SITE_CONFIG.primaryColor}50`, marginBottom:14 }}
          >
            🎮 Accept Challenge — Play Now!
          </button>
        ) : (
          /* Guest — prompt to sign up */
          <>
            <p style={{ fontSize:13, color:'#9ca3af', marginBottom:14 }}>Sign up free to accept challenges and track your score!</p>
            <button onClick={() => nav(`/register?redirect=/play/${gameId}?title=${encodeURIComponent(title)}&url=${encodeURIComponent(gameUrl)}`)}
              style={{ padding:'14px 44px', background:`linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color:'#fff', border:'none', borderRadius:99, fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:`0 6px 22px ${SITE_CONFIG.primaryColor}50`, marginBottom:12 }}>
              🚀 Sign Up Free & Play Now
            </button>
            <button onClick={() => nav('/login')}
              style={{ padding:'10px 30px', background:'transparent', border:`2px solid ${SITE_CONFIG.secondaryColor}`, borderRadius:99, fontSize:14, fontWeight:800, cursor:'pointer', color:SITE_CONFIG.secondaryColor, fontFamily:'Nunito,sans-serif', marginBottom:16 }}>
              Already have account? Login
            </button>
          </>
        )}

        <button onClick={()=>nav('/')} style={{ background:'none', border:'none', color:'#9ca3af', fontSize:12, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
          Browse all games on {SITE_CONFIG.name} →
        </button>
      </div>

      {/* Game modal — opens when Accept is clicked */}
      {gameOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:1000, display:'flex', flexDirection:'column' }}>
          {/* Simple header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'#0d0d1a', borderBottom:'1px solid #ffffff10', flexShrink:0 }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:13, fontWeight:700, color:'#fff' }}>{icon} {title}</div>
            <button onClick={()=>{ setGameOpen(false); }} style={{ background:'#ffffff18', border:'none', color:'#fff', padding:'6px 14px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>✕ Close</button>
          </div>
          {/* Game iframe — full remaining height */}
          <iframe
            key={gameId}
            src={gameUrl}
            title={title}
            style={{ flex:1, border:'none', width:'100%' }}
            allow="fullscreen; autoplay; pointer-lock"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals"
          />
        </div>
      )}
    </>
  );
}
