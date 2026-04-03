import React from 'react';

export default function GameCard({ game, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={() => onClick(game)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        border: `2px solid ${hovered ? '#ff6b35' : 'transparent'}`,
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px #ff6b3518' : '0 2px 12px #0000000a',
        transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
        position: 'relative',
      }}
    >
      {/* Thumbnail */}
      <div style={{ width: '100%', height: 130, background: game.bg || 'linear-gradient(135deg,#ff6b35,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative', overflow: 'hidden' }}>
        {game.thumbnail ? (
          <img src={game.thumbnail} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <span>{game.icon || '🎮'}</span>
        )}
        {/* Play overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
          <div style={{ width: 44, height: 44, background: '#ff6b35', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff' }}>▶</div>
        </div>
        {/* Badge */}
        {game.badge && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: game.badge === 'HOT' ? '#ff6b35' : game.badge === 'NEW' ? '#06d6a0' : '#ffd166', color: game.badge === 'NEW' ? '#0d0d1a' : '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>
            {game.badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{game.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#f3f4f6', color: '#6b7280' }}>{game.category}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#ffd166' }}>⭐ {game.rating}</span>
        </div>
      </div>
    </div>
  );
}
