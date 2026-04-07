import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

const cats = [
  { label: 'Action',      icon: '⚔️', slug: 'action'      },
  { label: 'Puzzle',      icon: '🧩', slug: 'puzzle'      },
  { label: 'Racing',      icon: '🏎️', slug: 'racing'      },
  { label: 'Sports',      icon: '⚽', slug: 'sports'      },
  { label: 'Adventure',   icon: '🗺️', slug: 'adventure'   },
  { label: 'Arcade',      icon: '🕹️', slug: 'arcade'      },
  { label: 'Strategy',    icon: '♟️', slug: 'strategy'    },
  { label: 'Shooter',     icon: '🎯', slug: 'shooter'     },
  { label: 'Casual',      icon: '🎈', slug: 'casual'      },
  { label: 'Multiplayer', icon: '👥', slug: 'multiplayer' },
];

export default function Sidebar({ open, onClose }) {
  const nav = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();

  const go = (path) => {
    nav(path);
    onClose(); // always close sidebar after navigation (important for mobile)
  };

  const isActive    = (p) => loc.pathname === p;
  const isCatActive = (s) => loc.pathname === `/category/${s}`;

  const item = (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px',
    borderRadius: 10,
    color: active ? '#fff' : '#ffffffaa',
    fontSize: 13, fontWeight: 700,
    cursor: 'pointer',
    background: active ? `linear-gradient(90deg,${SITE_CONFIG.primaryColor}28,transparent)` : 'transparent',
    borderLeft: `3px solid ${active ? SITE_CONFIG.primaryColor : 'transparent'}`,
    transition: 'all 0.15s',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    marginBottom: 2,
    fontFamily: 'Nunito,sans-serif',
  });

  const nameStart = SITE_CONFIG.name.length > 5 ? SITE_CONFIG.name.slice(0, -5) : SITE_CONFIG.name;
  const nameEnd   = SITE_CONFIG.name.length > 5 ? SITE_CONFIG.name.slice(-5) : '';

  return (
    <>
      {/* The sidebar itself */}
      <aside style={{
        position: 'fixed', top: 0, left: 0,
        width: 240,
        height: '100vh',
        background: 'var(--sidebar, #0d0d1a)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto', overflowX: 'hidden',
        zIndex: 200,
        // Desktop: always visible
        // Mobile: slide in/out
        transform: open ? 'translateX(0)' : undefined,
        transition: 'transform 0.28s cubic-bezier(.4,0,.2,1)',
      }} className={`sidebar-panel${open ? ' open' : ''}`}>

        {/* Logo row */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid #ffffff12', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => go('/')}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, overflow: 'hidden' }}>
              {SITE_CONFIG.logoImageUrl
                ? <img src={SITE_CONFIG.logoImageUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span>{SITE_CONFIG.logoEmoji}</span>
              }
            </div>
            <span style={{ fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 14, color: '#fff' }}>
              {nameStart}<span style={{ color: SITE_CONFIG.primaryColor }}>{nameEnd}</span>
            </span>
          </div>
          {/* Close button — only visible on mobile */}
          <button
            onClick={onClose}
            className="sidebar-close"
            style={{ background: '#ffffff15', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 7, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >✕</button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '6px 10px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#ffffff30', textTransform: 'uppercase', padding: '12px 4px 4px' }}>Menu</div>

          <button style={item(isActive('/'))}           onClick={() => go('/')}>🏠 <span>Home</span></button>
          <button style={item(isActive('/leaderboard'))}onClick={() => go('/leaderboard')}>🏆 <span>Leaderboard</span></button>
          <button style={item(isActive('/feedback'))}   onClick={() => go('/feedback')}>💬 <span>Feedback</span></button>
          <button style={item(isActive('/my-games'))}   onClick={() => go('/my-games')}>🕹️ <span>My Games (Add Yours)</span></button>
          {user     && <button style={item(isActive('/profile'))} onClick={() => go('/profile')}>👤 <span>My Profile</span></button>}
          {user?.role === 'admin' && <button style={item(isActive('/admin'))} onClick={() => go('/admin')}>⚙️ <span>Admin Panel</span></button>}

          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#ffffff30', textTransform: 'uppercase', padding: '12px 4px 4px' }}>Categories</div>

          {/* FIX: categories now use go() which navigates AND closes sidebar */}
          {cats.map(c => (
            <button key={c.slug} style={item(isCatActive(c.slug))} onClick={() => go(`/category/${c.slug}`)}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}

          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#ffffff30', textTransform: 'uppercase', padding: '12px 4px 4px' }}>Info</div>
          <button style={item(isActive('/about'))}   onClick={() => go('/about')}>ℹ️ <span>About</span></button>
          <button style={item(isActive('/privacy'))} onClick={() => go('/privacy')}>🔒 <span>Privacy Policy</span></button>
        </nav>

        {/* Stats */}
        <div style={{ padding: 12, borderTop: '1px solid #ffffff10', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {SITE_CONFIG.sidebarStats.map(({ num, label }) => (
              <div key={label} style={{ background: '#1a1a2e', borderRadius: 9, padding: 8, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, color: SITE_CONFIG.primaryColor }}>{num}</div>
                <div style={{ fontSize: 9, color: '#ffffff44', marginTop: 2, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile/Desktop CSS */}
      <style>{`
        /* Desktop: sidebar always visible */
        @media (min-width: 769px) {
          .sidebar-panel { transform: translateX(0) !important; }
          .sidebar-close  { display: none !important; }
        }
        /* Mobile: sidebar hidden by default, slides in when .open */
        @media (max-width: 768px) {
          .sidebar-panel { transform: translateX(-100%); }
          .sidebar-panel.open { transform: translateX(0) !important; }
        }
      `}</style>
    </>
  );
}
