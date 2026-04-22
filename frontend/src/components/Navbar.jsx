import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

export default function Navbar({ onMenuClick }) {
  const [q, setQ]        = useState('');
  const { user, logout } = useAuth();
  const nav              = useNavigate();
  const location         = useLocation();

  // Sync input with URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get('search') || '');
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) nav(`/?search=${encodeURIComponent(trimmed)}`);
    else nav('/');
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQ(val);
    if (val === '') nav('/');
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(240,242,248,0.97)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e5e7eb',
      // Fixed height so nothing wraps
      height: 54,
      display: 'flex', alignItems: 'center',
      padding: '0 8px',
      gap: 6,
      overflow: 'hidden', // prevent any overflow
    }}>

      {/* Hamburger — fixed width, never shrinks */}
      <button
        onClick={onMenuClick}
        aria-label="Menu"
        style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#1a1a2e', padding: '0 4px', flexShrink: 0, lineHeight: 1 }}
      >
        ☰
      </button>

      {/* Search — takes remaining space, min 0 so it can shrink */}
      <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9ca3af', pointerEvents: 'none' }}>🔍</span>
        <input
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '7px 10px 7px 28px',
            borderRadius: 99, border: '2px solid #e5e7eb',
            background: '#fff', fontSize: 13, fontWeight: 600,
            fontFamily: 'Nunito,sans-serif', color: '#1a1a2e', outline: 'none',
          }}
          placeholder="Search games..."
          value={q}
          onChange={handleChange}
          onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
      </form>

      {/* Right side — carefully sized so nothing overflows */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        {user ? (
          <>
            {/* Streak badge — hide on phones < 380px */}
            <div className="gs-streak" style={{
              display: 'flex', alignItems: 'center', gap: 3,
              background: 'linear-gradient(135deg,#ffd166,#ff9f43)',
              color: '#1a1a2e', padding: '4px 8px', borderRadius: 99,
              fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              🔥{user.streak}
            </div>

            {/* Username + level — truncated, tappable to profile */}
            <div
              onClick={() => nav('/profile')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: '#fff', border: '1.5px solid #e5e7eb',
                borderRadius: 99, padding: '4px 8px',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
                maxWidth: 100, overflow: 'hidden',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 60 }}>
                {user.username}
              </span>
              <span style={{ background: SITE_CONFIG.primaryColor, color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 99, flexShrink: 0 }}>
                Lv{user.level}
              </span>
            </div>

            {/* Logout — shows icon on mobile, icon+text on desktop */}
            <button
              onClick={logout}
              title="Logout"
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: '#fef2f2', border: '1.5px solid #fca5a5',
                borderRadius: 99, padding: '4px 10px',
                fontSize: 11, fontWeight: 800, cursor: 'pointer',
                color: '#dc2626', fontFamily: 'Nunito,sans-serif',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              <span>↩</span>
              <span className="gs-logout-text">Logout</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => nav('/login')}
              style={{ padding: '5px 12px', borderRadius: 99, border: `1.5px solid ${SITE_CONFIG.secondaryColor}`, background: 'transparent', fontSize: 11, fontWeight: 800, cursor: 'pointer', color: SITE_CONFIG.secondaryColor, fontFamily: 'Nunito,sans-serif', whiteSpace: 'nowrap' }}>
              Login
            </button>
            <button onClick={() => nav('/register')} className="gs-signup"
              style={{ padding: '5px 12px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, fontSize: 11, fontWeight: 800, cursor: 'pointer', color: '#fff', fontFamily: 'Nunito,sans-serif', whiteSpace: 'nowrap' }}>
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Responsive tweaks */}
      <style>{`
        /* Below 380px: hide streak, hide logout text, hide signup */
        @media (max-width: 380px) {
          .gs-streak      { display: none !important; }
          .gs-logout-text { display: none !important; }
          .gs-signup      { display: none !important; }
        }
        /* 381-480px: hide streak only */
        @media (min-width: 381px) and (max-width: 480px) {
          .gs-streak { display: none !important; }
        }
      `}</style>
    </header>
  );
}
