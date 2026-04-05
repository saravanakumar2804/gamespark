// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// const s = {
//   bar: { position: 'sticky', top: 0, height: 64, background: 'rgba(240,242,248,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', zIndex: 100 },
//   searchWrap: { flex: 1, maxWidth: 480, position: 'relative' },
//   searchInput: { width: '100%', padding: '10px 18px 10px 42px', borderRadius: 99, border: '2px solid #e5e7eb', background: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito,sans-serif', color: 'var(--dark)', transition: 'all 0.2s', outline: 'none' },
//   searchIcon: { position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#9ca3af' },
//   actions: { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' },
//   streak: { display: 'flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#ffd166,#ff9f43)', color: '#1a1a2e', padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 800 },
//   btn: (primary) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 99, fontSize: 13, fontWeight: 800, cursor: 'pointer', border: primary ? 'none' : '2px solid var(--secondary)', background: primary ? 'linear-gradient(135deg,#ff6b35,#ff8c42)' : 'transparent', color: primary ? '#fff' : 'var(--secondary)', transition: 'all 0.2s', boxShadow: primary ? '0 4px 14px #ff6b3540' : 'none' }),
//   userChip: { display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '2px solid var(--border)', borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
// };

// export default function Navbar() {
//   const [q, setQ] = useState('');
//   const { user, logout } = useAuth();
//   const nav = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (q.trim()) nav(`/?search=${encodeURIComponent(q.trim())}`);
//   };

//   return (
//     <header style={s.bar}>
//       <form style={s.searchWrap} onSubmit={handleSearch}>
//         <span style={s.searchIcon}>🔍</span>
//         <input
//           style={s.searchInput}
//           placeholder="Search 1500+ games..."
//           value={q}
//           onChange={e => setQ(e.target.value)}
//           onFocus={e => { e.target.style.borderColor = '#ff6b35'; e.target.style.boxShadow = '0 0 0 3px #ff6b3520'; }}
//           onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
//         />
//       </form>

//       <div style={s.actions}>
//         {user && <div style={s.streak}>🔥 {user.streak} day{user.streak !== 1 ? 's' : ''}</div>}

//         {user ? (
//           <>
//             <div style={s.userChip} onClick={() => nav('/profile')}>
//               👤 {user.username}
//               <span style={{ background: '#ff6b35', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 99 }}>Lv.{user.level}</span>
//             </div>
//             <button style={s.btn(false)} onClick={logout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <button style={s.btn(false)} onClick={() => nav('/login')}>Login</button>
//             <button style={s.btn(true)} onClick={() => nav('/register')}>Sign Up Free</button>
//           </>
//         )}
//       </div>
//     </header>
//   );
// }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

export default function Navbar() {
  const [q, setQ] = useState('');
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) nav(`/?search=${encodeURIComponent(q.trim())}`);
  };

  const s = {
    bar:   { position: 'sticky', top: 0, height: 64, background: 'rgba(240,242,248,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', zIndex: 100 },
    wrap:  { flex: 1, maxWidth: 480, position: 'relative' },
    input: { width: '100%', padding: '10px 18px 10px 42px', borderRadius: 99, border: '2px solid #e5e7eb', background: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito,sans-serif', color: 'var(--dark)', outline: 'none', transition: 'all 0.2s' },
    icon:  { position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#9ca3af' },
    acts:  { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' },
    streak:{ display: 'flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#ffd166,#ff9f43)', color: '#1a1a2e', padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 800 },
    btn:   (p) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 99, fontSize: 13, fontWeight: 800, cursor: 'pointer', border: p ? 'none' : `2px solid ${SITE_CONFIG.secondaryColor}`, background: p ? `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)` : 'transparent', color: p ? '#fff' : SITE_CONFIG.secondaryColor, transition: 'all 0.2s', fontFamily: 'Nunito,sans-serif' }),
    chip:  { display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '2px solid #e5e7eb', borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' },
  };

  return (
    <header style={s.bar}>
      <form style={s.wrap} onSubmit={handleSearch}>
        <span style={s.icon}>🔍</span>
        <input
          style={s.input}
          placeholder={`Search ${SITE_CONFIG.gamesCount} games...`}
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={e => { e.target.style.borderColor = SITE_CONFIG.primaryColor; e.target.style.boxShadow = `0 0 0 3px ${SITE_CONFIG.primaryColor}20`; }}
          onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
        />
      </form>

      <div style={s.acts}>
        {user && <div style={s.streak}>🔥 {user.streak} day{user.streak !== 1 ? 's' : ''}</div>}

        {user ? (
          <>
            <div style={s.chip} onClick={() => nav('/profile')}>
              👤 {user.username}
              <span style={{ background: SITE_CONFIG.primaryColor, color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 99 }}>Lv.{user.level}</span>
            </div>
            <button style={s.btn(false)} onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <button style={s.btn(false)} onClick={() => nav('/login')}>Login</button>
            <button style={s.btn(true)}  onClick={() => nav('/register')}>Sign Up Free</button>
          </>
        )}
      </div>
    </header>
  );
}
