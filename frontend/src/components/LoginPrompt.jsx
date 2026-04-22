import React from 'react';
import { useNavigate } from 'react-router-dom';
import SITE_CONFIG from '../siteConfig';

export default function LoginPrompt({ game, onClose }) {
  const nav = useNavigate();

  const overlay = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.88)',
    zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16,
  };

  const modal = {
    background: '#fff', borderRadius: 20, padding: '36px 28px',
    width: '100%', maxWidth: 360,
    textAlign: 'center',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
    animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
  };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <style>{`@keyframes popIn{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>

        {/* Game preview */}
        <div style={{ width: 72, height: 72, borderRadius: 18, background: game?.bg || `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {game?.thumbnail
            ? <img src={game.thumbnail} alt={game.title} style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }}/>
            : <span>{game?.icon || '🎮'}</span>
          }
        </div>

        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
          Ready to play?
        </div>

        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>
          <strong style={{ color: '#1a1a2e' }}>{game?.title || 'This game'}</strong> is waiting for you!
        </div>

        <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24, lineHeight: 1.5 }}>
          Create a free account to track your scores, earn XP, save favourites and compete on the leaderboard.
        </div>

        {/* Benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
          {[['🏆','Earn XP & Level up'],['❤️','Save favourites'],['🔥','Daily streaks'],['🥇','Leaderboard rank']].map(([icon, text]) => (
            <div key={text} style={{ background: '#f9fafb', borderRadius: 10, padding: '8px 10px', fontSize: 11, fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, textAlign: 'left' }}>
              <span style={{ fontSize: 14 }}>{icon}</span> {text}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={() => nav('/register')}
          style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', marginBottom: 10, boxShadow: `0 4px 16px ${SITE_CONFIG.primaryColor}50` }}
        >
          🚀 Sign Up Free — Play Now
        </button>

        <button
          onClick={() => nav('/login')}
          style={{ width: '100%', padding: '11px', background: 'transparent', border: `2px solid ${SITE_CONFIG.secondaryColor}`, borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', color: SITE_CONFIG.secondaryColor, marginBottom: 12 }}
        >
          Already have an account? Login
        </button>

        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
