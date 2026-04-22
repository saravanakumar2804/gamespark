import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginPrompt from './LoginPrompt';

const MOBILE_FRIENDLY_IDS = [
  'snake','slither','agar','wordle','2048','sudoku','solitaire','mahjong',
  'memory','flappy','dino','paper','krunker','shell','smashkarts','1v1',
  'tetris','pacman','chess','diep',
];

const isMobile = () => window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function GameCard({ game, onClick }) {
  const { user }        = useAuth();
  const [hovered, setHovered]   = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleClick = () => {
    if (!user) {
      // Guest user — show login prompt
      setShowLogin(true);
    } else {
      onClick(game);
    }
  };

  const mobile = isMobile();
  const friendlyId = (game.id || '').toLowerCase();
  const isFriendly = MOBILE_FRIENDLY_IDS.some(k => friendlyId.includes(k));

  return (
    <>
      <div
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff',
          borderRadius: 14,
          overflow: 'hidden',
          cursor: 'pointer',
          border: `2px solid ${hovered ? '#ff6b35' : 'transparent'}`,
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: hovered ? '0 16px 40px rgba(255,107,53,0.15)' : '0 2px 12px #0000000a',
          transition: 'all 0.22s cubic-bezier(.4,0,.2,1)',
          position: 'relative',
        }}
      >
        {/* Thumbnail */}
        <div style={{ width: '100%', height: 120, background: game.bg || 'linear-gradient(135deg,#ff6b35,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, position: 'relative', overflow: 'hidden' }}>
          {game.thumbnail ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <span style={{ display: game.thumbnail ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 48, position: game.thumbnail ? 'absolute' : 'static' }}>
            {game.icon || '🎮'}
          </span>

          {/* Play overlay on hover */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
            <div style={{ width: 44, height: 44, background: '#ff6b35', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff', boxShadow: '0 0 20px #ff6b3580' }}>▶</div>
          </div>

          {/* Badge */}
          {game.badge && (
            <div style={{ position: 'absolute', top: 7, left: 7, background: game.badge === 'HOT' ? '#ff6b35' : game.badge === 'NEW' ? '#06d6a0' : '#ffd166', color: game.badge === 'NEW' ? '#0d0d1a' : '#fff', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase' }}>
              {game.badge}
            </div>
          )}

          {/* Mobile-friendly indicator on mobile */}
          {mobile && (
            <div style={{ position: 'absolute', top: 7, right: 7, background: isFriendly ? '#06d6a0' : '#374151', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }} title={isFriendly ? 'Works on mobile' : 'Better on desktop'}>
              {isFriendly ? '📱✓' : '🖥️'}
            </div>
          )}

          {/* Login lock icon for guests */}
          {!user && (
            <div style={{ position: 'absolute', bottom: 7, right: 7, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 3 }}>
              🔒 Login
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '9px 11px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{game.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: '#f3f4f6', color: '#6b7280' }}>{game.category}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ffd166' }}>⭐ {game.rating}</span>
          </div>
        </div>
      </div>

      {/* Login prompt modal */}
      {showLogin && (
        <LoginPrompt game={game} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
}
