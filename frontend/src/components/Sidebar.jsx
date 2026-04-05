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

export default function Sidebar({ onClose }) {
  const nav  = useNavigate();
  const loc  = useLocation();
  const { user } = useAuth();

  const go = (path) => { nav(path); onClose?.(); };
  const active    = (p) => loc.pathname === p;
  const catActive = (s) => loc.pathname === `/category/${s}`;

  const s = {
    sidebar: {
      width: 'var(--sidebar-w, 240px)',
      minWidth: 240,
      height: '100vh',
      background: 'var(--sidebar)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', overflowX: 'hidden',
    },
    logo: { padding: '16px 16px 12px', borderBottom: '1px solid #ffffff12', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' },
    logoLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    logoIcon: { width: 34, height: 34, background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, overflow: 'hidden', flexShrink: 0 },
    logoText: { fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 14, color: '#fff', letterSpacing: 0.5 },
    closeBtn: { background: '#ffffff18', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 7, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    secLabel: { fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#ffffff30', textTransform: 'uppercase', padding: '14px 16px 4px' },
    nav: { flex: 1, padding: '4px 10px' },
    item: (a) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, color: a ? '#fff' : '#ffffff99', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: a ? `linear-gradient(90deg,${SITE_CONFIG.primaryColor}25,transparent)` : 'none', borderLeft: a ? `3px solid ${SITE_CONFIG.primaryColor}` : '3px solid transparent', transition: 'all 0.15s', border: 'none', width: '100%', textAlign: 'left', marginBottom: 1, fontFamily: 'Nunito,sans-serif' }),
    footer: { padding: 12, borderTop: '1px solid #ffffff10' },
    statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 },
    statBox: { background: 'var(--sidebar2)', borderRadius: 9, padding: '8px', textAlign: 'center' },
    statNum: { fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, color: SITE_CONFIG.primaryColor },
    statLbl: { fontSize: 9, color: '#ffffff44', marginTop: 2, fontWeight: 600 },
  };

  // Build display name split for coloring last 5 chars
  const name = SITE_CONFIG.name;
  const nameStart = name.length > 5 ? name.slice(0, name.length - 5) : name;
  const nameEnd   = name.length > 5 ? name.slice(-5) : '';

  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <div style={s.logoLeft}>
          <div style={s.logoIcon}>
            {SITE_CONFIG.logoImageUrl
              ? <img src={SITE_CONFIG.logoImageUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span>{SITE_CONFIG.logoEmoji}</span>
            }
          </div>
          <div style={s.logoText}>
            {nameStart}<span style={{ color: SITE_CONFIG.primaryColor }}>{nameEnd}</span>
          </div>
        </div>
        {/* Close button for mobile */}
        <button style={s.closeBtn} onClick={onClose} className="sidebar-close-btn" aria-label="Close menu">✕</button>
      </div>

      <nav style={s.nav}>
        <div style={s.secLabel}>Menu</div>
        <button style={s.item(active('/'))}            onClick={() => go('/')}>🏠 <span>Home</span></button>
        <button style={s.item(active('/leaderboard'))} onClick={() => go('/leaderboard')}>🏆 <span>Leaderboard</span></button>
        {user     && <button style={s.item(active('/profile'))} onClick={() => go('/profile')}>👤 <span>My Profile</span></button>}
        {user?.role === 'admin' && <button style={s.item(active('/admin'))} onClick={() => go('/admin')}>⚙️ <span>Admin Panel</span></button>}

        <div style={s.secLabel}>Categories</div>
        {cats.map(c => (
          <button key={c.slug} style={s.item(catActive(c.slug))} onClick={() => go(`/category/${c.slug}`)}>
            <span style={{ fontSize: 14 }}>{c.icon}</span><span>{c.label}</span>
          </button>
        ))}

        <div style={s.secLabel}>Info</div>
        <button style={s.item(active('/about'))}   onClick={() => go('/about')}>ℹ️ <span>About</span></button>
        <button style={s.item(active('/privacy'))} onClick={() => go('/privacy')}>🔒 <span>Privacy</span></button>
      </nav>

      <div style={s.footer}>
        <div style={s.statGrid}>
          {SITE_CONFIG.sidebarStats.map(({ num, label }) => (
            <div key={label} style={s.statBox}>
              <div style={s.statNum}>{num}</div>
              <div style={s.statLbl}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hide close btn on desktop */}
      <style>{`
        @media (min-width: 769px) { .sidebar-close-btn { display: none !important; } }
        @media (max-width: 768px) { aside { min-width: 240px; width: 240px; } }
      `}</style>
    </aside>
  );
}
