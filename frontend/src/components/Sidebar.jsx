// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// const cats = [
//   { label: 'Action', icon: '⚔️', slug: 'action' },
//   { label: 'Puzzle', icon: '🧩', slug: 'puzzle' },
//   { label: 'Racing', icon: '🏎️', slug: 'racing' },
//   { label: 'Sports', icon: '⚽', slug: 'sports' },
//   { label: 'Adventure', icon: '🗺️', slug: 'adventure' },
//   { label: 'Arcade', icon: '🕹️', slug: 'arcade' },
//   { label: 'Strategy', icon: '♟️', slug: 'strategy' },
//   { label: 'Shooter', icon: '🎯', slug: 'shooter' },
//   { label: 'Casual', icon: '🎈', slug: 'casual' },
//   { label: 'Multiplayer', icon: '👥', slug: 'multiplayer' },
// ];

// const s = {
//   sidebar: { position: 'fixed', top: 0, left: 0, width: 'var(--sidebar-w)', height: '100vh', background: 'var(--sidebar)', display: 'flex', flexDirection: 'column', zIndex: 200, overflowY: 'auto' },
//   logo: { padding: '20px 16px 14px', borderBottom: '1px solid #ffffff12', display: 'flex', alignItems: 'center', gap: 10 },
//   logoIcon: { width: 36, height: 36, background: 'linear-gradient(135deg,#ff6b35,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
//   logoText: { fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: 1 },
//   sectionLabel: { fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#ffffff30', textTransform: 'uppercase', padding: '16px 16px 4px' },
//   nav: { flex: 1, padding: '6px 10px' },
//   navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, color: active ? '#fff' : '#ffffff99', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: active ? 'linear-gradient(90deg,#ff6b3530,transparent)' : 'none', borderLeft: active ? '3px solid #ff6b35' : '3px solid transparent', transition: 'all 0.2s', border: 'none', width: '100%', textAlign: 'left', marginBottom: 2 }),
//   footer: { padding: 14, borderTop: '1px solid #ffffff10' },
//   statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
//   statBox: { background: 'var(--sidebar2)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' },
//   statNum: { fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: '#ff6b35' },
//   statLabel: { fontSize: 10, color: '#ffffff44', marginTop: 2, fontWeight: 600 },
// };

// export default function Sidebar() {
//   const nav = useNavigate();
//   const loc = useLocation();
//   const { user } = useAuth();

//   const go = (path) => nav(path);
//   const active = (path) => loc.pathname === path;
//   const catActive = (slug) => loc.pathname === `/category/${slug}`;

//   return (
//     <aside style={s.sidebar}>
//       <div style={s.logo}>
//         <div style={s.logoIcon}>⚡</div>
//         <div style={s.logoText}>Game<span style={{ color: '#ff6b35' }}>Spark</span></div>
//       </div>

//       <nav style={s.nav}>
//         <div style={s.sectionLabel}>Menu</div>
//         <button style={s.navItem(active('/'))} onClick={() => go('/')}>🏠 <span>Home</span></button>
//         <button style={s.navItem(active('/leaderboard'))} onClick={() => go('/leaderboard')}>🏆 <span>Leaderboard</span></button>
//         {user && <button style={s.navItem(active('/profile'))} onClick={() => go('/profile')}>👤 <span>My Profile</span></button>}
//         {user?.role === 'admin' && <button style={s.navItem(active('/admin'))} onClick={() => go('/admin')}>⚙️ <span>Admin Panel</span></button>}

//         <div style={s.sectionLabel}>Categories</div>
//         {cats.map(c => (
//           <button key={c.slug} style={s.navItem(catActive(c.slug))} onClick={() => go(`/category/${c.slug}`)}>
//             <span style={{ fontSize: 15 }}>{c.icon}</span> <span>{c.label}</span>
//           </button>
//         ))}

//         <div style={s.sectionLabel}>Info</div>
//         <button style={s.navItem(active('/about'))} onClick={() => go('/about')}>ℹ️ <span>About</span></button>
//         <button style={s.navItem(active('/privacy'))} onClick={() => go('/privacy')}>🔒 <span>Privacy Policy</span></button>
//       </nav>

//       <div style={s.footer}>
//         <div style={s.statGrid}>
//           <div style={s.statBox}><div style={s.statNum}>1500+</div><div style={s.statLabel}>Games</div></div>
//           <div style={s.statBox}><div style={s.statNum}>FREE</div><div style={s.statLabel}>Always</div></div>
//           <div style={s.statBox}><div style={s.statNum}>24/7</div><div style={s.statLabel}>Online</div></div>
//           <div style={s.statBox}><div style={s.statNum}>0</div><div style={s.statLabel}>Downloads</div></div>
//         </div>
//       </div>
//     </aside>
//   );
// }
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

export default function Sidebar() {
  const nav  = useNavigate();
  const loc  = useLocation();
  const { user } = useAuth();

  const active    = (path)  => loc.pathname === path;
  const catActive = (slug)  => loc.pathname === `/category/${slug}`;

  const s = {
    sidebar: { position: 'fixed', top: 0, left: 0, width: 'var(--sidebar-w)', height: '100vh', background: 'var(--sidebar)', display: 'flex', flexDirection: 'column', zIndex: 200, overflowY: 'auto' },
    logo:    { padding: '20px 16px 14px', borderBottom: '1px solid #ffffff12', display: 'flex', alignItems: 'center', gap: 10 },
    logoIcon:{ width: 36, height: 36, background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, overflow: 'hidden', flexShrink: 0 },
    logoText:{ fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: 1 },
    secLabel:{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#ffffff30', textTransform: 'uppercase', padding: '16px 16px 4px' },
    nav:     { flex: 1, padding: '6px 10px' },
    item:    (a) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, color: a ? '#fff' : '#ffffff99', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: a ? `linear-gradient(90deg,${SITE_CONFIG.primaryColor}30,transparent)` : 'none', borderLeft: a ? `3px solid ${SITE_CONFIG.primaryColor}` : '3px solid transparent', transition: 'all 0.2s', border: 'none', width: '100%', textAlign: 'left', marginBottom: 2, fontFamily: 'Nunito,sans-serif' }),
    footer:  { padding: 14, borderTop: '1px solid #ffffff10' },
    statGrid:{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
    statBox: { background: 'var(--sidebar2)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' },
    statNum: { fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: SITE_CONFIG.primaryColor },
    statLbl: { fontSize: 10, color: '#ffffff44', marginTop: 2, fontWeight: 600 },
  };

  return (
    <aside style={s.sidebar}>
      {/* Logo — controlled by siteConfig.js */}
      <div style={s.logo}>
        <div style={s.logoIcon}>
          {SITE_CONFIG.logoImageUrl
            ? <img src={SITE_CONFIG.logoImageUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span>{SITE_CONFIG.logoEmoji}</span>
          }
        </div>
        <div style={s.logoText}>
          {SITE_CONFIG.name.slice(0, -5) || SITE_CONFIG.name}
          <span style={{ color: SITE_CONFIG.primaryColor }}>
            {SITE_CONFIG.name.slice(-5) || ""}
          </span>
        </div>
      </div>

      <nav style={s.nav}>
        <div style={s.secLabel}>Menu</div>
        <button style={s.item(active('/'))}            onClick={() => nav('/')}>🏠 <span>Home</span></button>
        <button style={s.item(active('/leaderboard'))} onClick={() => nav('/leaderboard')}>🏆 <span>Leaderboard</span></button>
        {user     && <button style={s.item(active('/profile'))} onClick={() => nav('/profile')}>👤 <span>My Profile</span></button>}
        {user?.role === 'admin' && <button style={s.item(active('/admin'))} onClick={() => nav('/admin')}>⚙️ <span>Admin Panel</span></button>}

        <div style={s.secLabel}>Categories</div>
        {cats.map(c => (
          <button key={c.slug} style={s.item(catActive(c.slug))} onClick={() => nav(`/category/${c.slug}`)}>
            <span style={{ fontSize: 15 }}>{c.icon}</span> <span>{c.label}</span>
          </button>
        ))}

        <div style={s.secLabel}>Info</div>
        <button style={s.item(active('/about'))}   onClick={() => nav('/about')}>ℹ️ <span>About</span></button>
        <button style={s.item(active('/privacy'))} onClick={() => nav('/privacy')}>🔒 <span>Privacy Policy</span></button>
      </nav>

      {/* Stats — controlled by siteConfig.js */}
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
    </aside>
  );
}
