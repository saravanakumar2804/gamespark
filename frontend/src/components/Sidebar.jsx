import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const cats = [
  { label: 'Action', icon: '⚔️', slug: 'action' },
  { label: 'Puzzle', icon: '🧩', slug: 'puzzle' },
  { label: 'Racing', icon: '🏎️', slug: 'racing' },
  { label: 'Sports', icon: '⚽', slug: 'sports' },
  { label: 'Adventure', icon: '🗺️', slug: 'adventure' },
  { label: 'Arcade', icon: '🕹️', slug: 'arcade' },
  { label: 'Strategy', icon: '♟️', slug: 'strategy' },
  { label: 'Shooter', icon: '🎯', slug: 'shooter' },
  { label: 'Casual', icon: '🎈', slug: 'casual' },
  { label: 'Multiplayer', icon: '👥', slug: 'multiplayer' },
];

const s = {
  sidebar: { position: 'fixed', top: 0, left: 0, width: 'var(--sidebar-w)', height: '100vh', background: 'var(--sidebar)', display: 'flex', flexDirection: 'column', zIndex: 200, overflowY: 'auto' },
  logo: { padding: '20px 16px 14px', borderBottom: '1px solid #ffffff12', display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { width: 36, height: 36, background: 'linear-gradient(135deg,#ff6b35,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  logoText: { fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: 1 },
  sectionLabel: { fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#ffffff30', textTransform: 'uppercase', padding: '16px 16px 4px' },
  nav: { flex: 1, padding: '6px 10px' },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, color: active ? '#fff' : '#ffffff99', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: active ? 'linear-gradient(90deg,#ff6b3530,transparent)' : 'none', borderLeft: active ? '3px solid #ff6b35' : '3px solid transparent', transition: 'all 0.2s', border: 'none', width: '100%', textAlign: 'left', marginBottom: 2 }),
  footer: { padding: 14, borderTop: '1px solid #ffffff10' },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  statBox: { background: 'var(--sidebar2)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' },
  statNum: { fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: '#ff6b35' },
  statLabel: { fontSize: 10, color: '#ffffff44', marginTop: 2, fontWeight: 600 },
};

export default function Sidebar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();

  const go = (path) => nav(path);
  const active = (path) => loc.pathname === path;
  const catActive = (slug) => loc.pathname === `/category/${slug}`;

  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <div style={s.logoIcon}>⚡</div>
        <div style={s.logoText}>Game<span style={{ color: '#ff6b35' }}>Spark</span></div>
      </div>

      <nav style={s.nav}>
        <div style={s.sectionLabel}>Menu</div>
        <button style={s.navItem(active('/'))} onClick={() => go('/')}>🏠 <span>Home</span></button>
        <button style={s.navItem(active('/leaderboard'))} onClick={() => go('/leaderboard')}>🏆 <span>Leaderboard</span></button>
        {user && <button style={s.navItem(active('/profile'))} onClick={() => go('/profile')}>👤 <span>My Profile</span></button>}
        {user?.role === 'admin' && <button style={s.navItem(active('/admin'))} onClick={() => go('/admin')}>⚙️ <span>Admin Panel</span></button>}

        <div style={s.sectionLabel}>Categories</div>
        {cats.map(c => (
          <button key={c.slug} style={s.navItem(catActive(c.slug))} onClick={() => go(`/category/${c.slug}`)}>
            <span style={{ fontSize: 15 }}>{c.icon}</span> <span>{c.label}</span>
          </button>
        ))}

        <div style={s.sectionLabel}>Info</div>
        <button style={s.navItem(active('/about'))} onClick={() => go('/about')}>ℹ️ <span>About</span></button>
        <button style={s.navItem(active('/privacy'))} onClick={() => go('/privacy')}>🔒 <span>Privacy Policy</span></button>
      </nav>

      <div style={s.footer}>
        <div style={s.statGrid}>
          <div style={s.statBox}><div style={s.statNum}>1500+</div><div style={s.statLabel}>Games</div></div>
          <div style={s.statBox}><div style={s.statNum}>FREE</div><div style={s.statLabel}>Always</div></div>
          <div style={s.statBox}><div style={s.statNum}>24/7</div><div style={s.statLabel}>Online</div></div>
          <div style={s.statBox}><div style={s.statNum}>0</div><div style={s.statLabel}>Downloads</div></div>
        </div>
      </div>
    </aside>
  );
}
