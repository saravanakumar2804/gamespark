import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

export default function Navbar({ onMenuClick }) {
  const [q, setQ] = useState('');
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) nav(`/?search=${encodeURIComponent(q.trim())}`);
  };

  const s = {
    bar: {
      position: 'sticky', top: 0, height: 60,
      background: 'rgba(240,242,248,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 16px', zIndex: 100,
    },
    hamburger: {
      display: 'none', // shown on mobile via media query override in className
      background: 'none', border: 'none',
      fontSize: 22, cursor: 'pointer',
      color: 'var(--dark)', padding: 4, flexShrink: 0,
    },
    wrap: { flex: 1, maxWidth: 440, position: 'relative' },
    input: {
      width: '100%', padding: '9px 14px 9px 38px',
      borderRadius: 99, border: '2px solid #e5e7eb',
      background: '#fff', fontSize: 13, fontWeight: 600,
      fontFamily: 'Nunito,sans-serif', color: 'var(--dark)', outline: 'none',
    },
    icon: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9ca3af' },
    acts: { display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 },
    streak: { display: 'flex', alignItems: 'center', gap: 4, background: 'linear-gradient(135deg,#ffd166,#ff9f43)', color: '#1a1a2e', padding: '5px 11px', borderRadius: 99, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' },
    btn: (p) => ({ display: 'inline-flex', alignItems: 'center', padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 800, cursor: 'pointer', border: p ? 'none' : `2px solid ${SITE_CONFIG.secondaryColor}`, background: p ? `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)` : 'transparent', color: p ? '#fff' : SITE_CONFIG.secondaryColor, fontFamily: 'Nunito,sans-serif', whiteSpace: 'nowrap' }),
    chip: { display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '2px solid #e5e7eb', borderRadius: 99, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  };

  return (
    <header style={s.bar}>
      {/* Hamburger — visible on mobile only */}
      <button
        style={s.hamburger}
        className="mobile-menu-btn"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .navbar-streak   { display: none !important; }
          .navbar-signup   { display: none !important; }
        }
      `}</style>

      {/* Search */}
      <form style={s.wrap} onSubmit={handleSearch}>
        <span style={s.icon}>🔍</span>
        <input
          style={s.input}
          placeholder={`Search games...`}
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={e => { e.target.style.borderColor = SITE_CONFIG.primaryColor; }}
          onBlur={e => { e.target.style.borderColor = '#e5e7eb'; }}
        />
      </form>

      <div style={s.acts}>
        {user && (
          <div style={s.streak} className="navbar-streak">
            🔥 {user.streak} day{user.streak !== 1 ? 's' : ''}
          </div>
        )}

        {user ? (
          <>
            <div style={s.chip} onClick={() => nav('/profile')}>
              👤 {user.username}
              <span style={{ background: SITE_CONFIG.primaryColor, color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 99 }}>Lv.{user.level}</span>
            </div>
            <button style={s.btn(false)} onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <button style={s.btn(false)} onClick={() => nav('/login')}>Login</button>
            <button style={s.btn(true)} className="navbar-signup" onClick={() => nav('/register')}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
}
