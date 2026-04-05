// import React, { useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../hooks/useAuth';

// export default function Admin() {
//   const { user, API } = useAuth();
//   const nav = useNavigate();
//   const [data, setData] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab] = useState('dashboard');

//   useEffect(() => {
//     if (!user) { nav('/login'); return; }
//     if (user.role !== 'admin') { nav('/'); return; }
//     loadData();
//   }, [user]);

//   const loadData = async () => {
//     try {
//       const [dash, usrs] = await Promise.all([
//         axios.get(`${API}/api/admin/dashboard`),
//         axios.get(`${API}/api/admin/users`)
//       ]);
//       setData(dash.data);
//       setUsers(usrs.data.users);
//     } catch { nav('/'); }
//     finally { setLoading(false); }
//   };

//   const searchUsers = async (q) => {
//     setSearch(q);
//     const r = await axios.get(`${API}/api/admin/users?search=${q}`);
//     setUsers(r.data.users);
//   };

//   const fmtTime = (s) => !s ? '0s' : s < 60 ? `${s}s` : `${Math.floor(s/60)}m`;

//   if (loading) return <div style={{ padding: 60, textAlign: 'center', fontFamily: 'Orbitron,monospace' }}>Loading admin panel...</div>;

//   const p = { padding: 28 };
//   const card = { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px #0000000a', marginBottom: 20 };
//   const statGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 };
//   const statBox = (color) => ({ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 14, padding: '18px', textAlign: 'center' });
//   const statNum = (color) => ({ fontFamily: 'Orbitron,monospace', fontSize: 26, fontWeight: 700, color });
//   const tabBtn = (active) => ({ padding: '8px 20px', borderRadius: 99, border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', background: active ? '#ff6b35' : '#f3f4f6', color: active ? '#fff' : 'var(--muted)', marginRight: 8 });

//   return (
//     <>
//       <Helmet><title>Admin Panel — GameSpark</title></Helmet>
//       <div style={p}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
//           <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 700 }}>⚙️ Admin Panel</div>
//           <span style={{ background: '#ff6b35', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99 }}>LIVE DATA</span>
//         </div>

//         {/* Tabs */}
//         <div style={{ marginBottom: 24 }}>
//           <button style={tabBtn(tab === 'dashboard')} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
//           <button style={tabBtn(tab === 'users')} onClick={() => setTab('users')}>👥 Users</button>
//           <button style={tabBtn(tab === 'games')} onClick={() => setTab('games')}>🎮 Top Games</button>
//         </div>

//         {tab === 'dashboard' && data && (
//           <>
//             <div style={statGrid}>
//               <div style={statBox('#ff6b35')}><div style={{ fontSize: 20, marginBottom: 8 }}>👥</div><div style={statNum('#ff6b35')}>{data.totalUsers}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Users</div></div>
//               <div style={statBox('#7c3aed')}><div style={{ fontSize: 20, marginBottom: 8 }}>🎮</div><div style={statNum('#7c3aed')}>{data.totalSessions}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Sessions</div></div>
//               <div style={statBox('#06d6a0')}><div style={{ fontSize: 20, marginBottom: 8 }}>🆕</div><div style={statNum('#06d6a0')}>{data.todayUsers}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>New Today</div></div>
//               <div style={statBox('#ffd166')}><div style={{ fontSize: 20, marginBottom: 8 }}>⏱️</div><div style={statNum('#ffd166')}>{fmtTime(data.totalPlayTime)}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Playtime</div></div>
//             </div>

//             <div style={card}>
//               <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🕐 Recent Signups</div>
//               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//                 <thead>
//                   <tr style={{ background: '#f9fafb' }}>
//                     {['Username','Email','Games','Time','Streak','XP','Joined'].map(h => (
//                       <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: 12 }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.recentUsers.map(u => (
//                     <tr key={u._id} style={{ borderTop: '1px solid #f0f0f0' }}>
//                       <td style={{ padding: '10px 12px', fontWeight: 700 }}>{u.username}</td>
//                       <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{u.email}</td>
//                       <td style={{ padding: '10px 12px', fontFamily: 'Orbitron,monospace', color: '#ff6b35' }}>{u.gamesPlayed}</td>
//                       <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{fmtTime(u.totalPlayTime)}</td>
//                       <td style={{ padding: '10px 12px', color: '#ffd166', fontWeight: 700 }}>🔥 {u.streak}</td>
//                       <td style={{ padding: '10px 12px', fontFamily: 'Orbitron,monospace', color: '#7c3aed' }}>{u.xp}</td>
//                       <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {tab === 'users' && (
//           <div style={card}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
//               <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700 }}>👥 All Users ({users.length})</div>
//               <input style={{ flex: 1, maxWidth: 280, padding: '8px 14px', borderRadius: 8, border: '2px solid #e5e7eb', fontSize: 13, fontFamily: 'Nunito,sans-serif', outline: 'none' }}
//                 placeholder="Search by name or email..." value={search} onChange={e => searchUsers(e.target.value)} />
//             </div>
//             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//               <thead>
//                 <tr style={{ background: '#f9fafb' }}>
//                   {['Username','Email','Level','Games','Streak','XP','Role','Joined'].map(h => (
//                     <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: 12 }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map(u => (
//                   <tr key={u._id} style={{ borderTop: '1px solid #f0f0f0', cursor: 'pointer' }}>
//                     <td style={{ padding: '10px 12px', fontWeight: 700 }}>{u.username}</td>
//                     <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{u.email}</td>
//                     <td style={{ padding: '10px 12px' }}><span style={{ background: '#ff6b3520', color: '#ff6b35', fontWeight: 800, padding: '2px 8px', borderRadius: 99, fontSize: 12 }}>Lv.{u.level}</span></td>
//                     <td style={{ padding: '10px 12px', fontFamily: 'Orbitron,monospace', color: '#ff6b35' }}>{u.gamesPlayed}</td>
//                     <td style={{ padding: '10px 12px', color: '#ffd166', fontWeight: 700 }}>🔥 {u.streak}</td>
//                     <td style={{ padding: '10px 12px', fontFamily: 'Orbitron,monospace', color: '#7c3aed' }}>{u.xp}</td>
//                     <td style={{ padding: '10px 12px' }}><span style={{ background: u.role === 'admin' ? '#7c3aed20' : '#f3f4f6', color: u.role === 'admin' ? '#7c3aed' : 'var(--muted)', fontWeight: 700, padding: '2px 8px', borderRadius: 99, fontSize: 12 }}>{u.role}</span></td>
//                     <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {tab === 'games' && data && (
//           <div style={card}>
//             <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎮 Most Played Games</div>
//             {data.topGames.map((g, i) => (
//               <div key={g._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
//                 <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 16, fontWeight: 700, color: i < 3 ? '#ffd166' : 'var(--muted)', width: 30 }}>#{i+1}</div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 14, fontWeight: 800 }}>{g.title}</div>
//                   <div style={{ fontSize: 12, color: 'var(--muted)' }}>{g.plays} plays · {fmtTime(g.totalTime)} total</div>
//                 </div>
//                 <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: '#ff6b35' }}>{g.plays}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

export default function Admin() {
  const { user, API } = useAuth();
  const nav = useNavigate();
  const [data, setData]     = useState(null);
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState('dashboard');
  const [saved, setSaved]   = useState(false);

  // Site config editor state — mirrors siteConfig.js values
  const [cfg, setCfg] = useState({
    name:        SITE_CONFIG.name,
    logoEmoji:   SITE_CONFIG.logoEmoji,
    logoImageUrl:SITE_CONFIG.logoImageUrl,
    primaryColor:SITE_CONFIG.primaryColor,
    secondaryColor:SITE_CONFIG.secondaryColor,
    heroTitle:   SITE_CONFIG.heroTitle,
    heroTitleHighlight: SITE_CONFIG.heroTitleHighlight,
    heroSubtitle:SITE_CONFIG.heroSubtitle,
    gamesCount:  SITE_CONFIG.gamesCount,
    contactEmail:SITE_CONFIG.contactEmail,
  });

  useEffect(() => {
    if (!user) { nav('/login'); return; }
    if (user.role !== 'admin') { nav('/'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [dash, usrs] = await Promise.all([
        axios.get(`${API}/api/admin/dashboard`),
        axios.get(`${API}/api/admin/users`),
      ]);
      setData(dash.data);
      setUsers(usrs.data.users);
    } catch { nav('/'); }
    finally { setLoading(false); }
  };

  const searchUsers = async (q) => {
    setSearch(q);
    const r = await axios.get(`${API}/api/admin/users?search=${q}`);
    setUsers(r.data.users);
  };

  const handleSaveConfig = () => {
    // Show instructions — actual saving requires editing siteConfig.js file
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const fmtTime = (s) => !s ? '0s' : s < 60 ? `${s}s` : `${Math.floor(s/60)}m`;

  if (loading) return (
    <div style={{ padding: 60, textAlign: 'center', fontFamily: 'Orbitron,monospace', color: 'var(--dark)' }}>
      Loading admin panel...
    </div>
  );

  const card    = { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px #0000000a', marginBottom: 20 };
  const statGrid= { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 };
  const sBox    = (c) => ({ background: `${c}15`, border: `1px solid ${c}30`, borderRadius: 14, padding: '18px', textAlign: 'center' });
  const sNum    = (c) => ({ fontFamily: 'Orbitron,monospace', fontSize: 26, fontWeight: 700, color: c });
  const tabBtn  = (a) => ({ padding: '8px 20px', borderRadius: 99, border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', background: a ? SITE_CONFIG.primaryColor : '#f3f4f6', color: a ? '#fff' : 'var(--muted)', marginRight: 8, fontFamily: 'Nunito,sans-serif' });
  const inp     = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 14, fontFamily: 'Nunito,sans-serif', outline: 'none', marginBottom: 12 };
  const lbl     = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 };

  return (
    <>
      <Helmet><title>Admin Panel — {SITE_CONFIG.name}</title></Helmet>
      <div style={{ padding: 28 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 700 }}>⚙️ Admin Panel</div>
          <span style={{ background: SITE_CONFIG.primaryColor, color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99 }}>LIVE DATA</span>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 24 }}>
          <button style={tabBtn(tab === 'dashboard')} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
          <button style={tabBtn(tab === 'users')}     onClick={() => setTab('users')}>👥 Users</button>
          <button style={tabBtn(tab === 'games')}     onClick={() => setTab('games')}>🎮 Top Games</button>
          <button style={tabBtn(tab === 'settings')}  onClick={() => setTab('settings')}>🎨 Site Settings</button>
        </div>

        {/* ── DASHBOARD ─────────────────────────────────────────────── */}
        {tab === 'dashboard' && data && (
          <>
            <div style={statGrid}>
              <div style={sBox('#ff6b35')}><div style={{ fontSize: 20, marginBottom: 8 }}>👥</div><div style={sNum('#ff6b35')}>{data.totalUsers}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Users</div></div>
              <div style={sBox('#7c3aed')}><div style={{ fontSize: 20, marginBottom: 8 }}>🎮</div><div style={sNum('#7c3aed')}>{data.totalSessions}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Sessions</div></div>
              <div style={sBox('#06d6a0')}><div style={{ fontSize: 20, marginBottom: 8 }}>🆕</div><div style={sNum('#06d6a0')}>{data.todayUsers}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>New Today</div></div>
              <div style={sBox('#ffd166')}><div style={{ fontSize: 20, marginBottom: 8 }}>⏱️</div><div style={sNum('#ffd166')}>{fmtTime(data.totalPlayTime)}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Playtime</div></div>
            </div>
            <div style={card}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🕐 Recent Signups</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      {['Username','Email','Games','Time','Streak','XP','Joined'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentUsers.map(u => (
                      <tr key={u._id} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{u.username}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{u.email}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'Orbitron,monospace', color: '#ff6b35' }}>{u.gamesPlayed}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{fmtTime(u.totalPlayTime)}</td>
                        <td style={{ padding: '10px 12px', color: '#ffd166', fontWeight: 700 }}>🔥 {u.streak}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'Orbitron,monospace', color: '#7c3aed' }}>{u.xp}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── USERS ─────────────────────────────────────────────────── */}
        {tab === 'users' && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700 }}>👥 All Users ({users.length})</div>
              <input style={{ flex: 1, maxWidth: 280, padding: '8px 14px', borderRadius: 8, border: '2px solid #e5e7eb', fontSize: 13, fontFamily: 'Nunito,sans-serif', outline: 'none' }}
                placeholder="Search name or email..." value={search} onChange={e => searchUsers(e.target.value)} />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Username','Email','Level','Games','Streak','XP','Role','Joined'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{u.username}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{u.email}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: '#ff6b3520', color: '#ff6b35', fontWeight: 800, padding: '2px 8px', borderRadius: 99, fontSize: 12 }}>Lv.{u.level}</span></td>
                      <td style={{ padding: '10px 12px', fontFamily: 'Orbitron,monospace', color: '#ff6b35' }}>{u.gamesPlayed}</td>
                      <td style={{ padding: '10px 12px', color: '#ffd166', fontWeight: 700 }}>🔥 {u.streak}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'Orbitron,monospace', color: '#7c3aed' }}>{u.xp}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: u.role === 'admin' ? '#7c3aed20' : '#f3f4f6', color: u.role === 'admin' ? '#7c3aed' : 'var(--muted)', fontWeight: 700, padding: '2px 8px', borderRadius: 99, fontSize: 12 }}>{u.role}</span></td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TOP GAMES ─────────────────────────────────────────────── */}
        {tab === 'games' && data && (
          <div style={card}>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎮 Most Played Games</div>
            {data.topGames.length === 0
              ? <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No game sessions recorded yet.</div>
              : data.topGames.map((g, i) => (
                <div key={g._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 16, fontWeight: 700, color: i < 3 ? '#ffd166' : 'var(--muted)', width: 30 }}>#{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{g.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{g.plays} plays · {fmtTime(g.totalTime)} total</div>
                  </div>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: '#ff6b35' }}>{g.plays}</div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── SITE SETTINGS ─────────────────────────────────────────── */}
        {tab === 'settings' && (
          <div>
            {saved && (
              <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14, fontWeight: 700, color: '#166534' }}>
                ✅ Changes noted! To apply permanently: open <code>frontend/src/siteConfig.js</code> and update the values there, then rebuild and redeploy to Netlify.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>

              {/* Branding */}
              <div style={card}>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 18 }}>🏷️ Branding</div>
                <label style={lbl}>Site Name</label>
                <input style={inp} value={cfg.name} onChange={e => setCfg(p => ({ ...p, name: e.target.value }))} placeholder="GameSpark" />
                <label style={lbl}>Logo Emoji (shown in sidebar)</label>
                <input style={inp} value={cfg.logoEmoji} onChange={e => setCfg(p => ({ ...p, logoEmoji: e.target.value }))} placeholder="⚡" />
                <label style={lbl}>Logo Image URL (optional — overrides emoji)</label>
                <input style={inp} value={cfg.logoImageUrl} onChange={e => setCfg(p => ({ ...p, logoImageUrl: e.target.value }))} placeholder="https://your-logo-url.com/logo.png" />
                <label style={lbl}>Contact Email</label>
                <input style={inp} value={cfg.contactEmail} onChange={e => setCfg(p => ({ ...p, contactEmail: e.target.value }))} placeholder="admin@yoursite.com" />
              </div>

              {/* Colors */}
              <div style={card}>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 18 }}>🎨 Colors</div>
                <label style={lbl}>Primary Color (buttons, accents)</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <input type="color" value={cfg.primaryColor} onChange={e => setCfg(p => ({ ...p, primaryColor: e.target.value }))} style={{ width: 50, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer' }} />
                  <input style={{ ...inp, marginBottom: 0, flex: 1 }} value={cfg.primaryColor} onChange={e => setCfg(p => ({ ...p, primaryColor: e.target.value }))} placeholder="#ff6b35" />
                </div>
                <label style={lbl}>Secondary Color (purple accents)</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <input type="color" value={cfg.secondaryColor} onChange={e => setCfg(p => ({ ...p, secondaryColor: e.target.value }))} style={{ width: 50, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer' }} />
                  <input style={{ ...inp, marginBottom: 0, flex: 1 }} value={cfg.secondaryColor} onChange={e => setCfg(p => ({ ...p, secondaryColor: e.target.value }))} placeholder="#7c3aed" />
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: 14, marginTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>Preview</div>
                  <button style={{ background: `linear-gradient(135deg,${cfg.primaryColor},${cfg.secondaryColor})`, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 99, fontWeight: 800, fontSize: 14, cursor: 'default' }}>Sample Button</button>
                </div>
              </div>

              {/* Hero text */}
              <div style={card}>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 18 }}>🦸 Hero Section</div>
                <label style={lbl}>Hero Title (line 1)</label>
                <input style={inp} value={cfg.heroTitle} onChange={e => setCfg(p => ({ ...p, heroTitle: e.target.value }))} placeholder="Play. Compete." />
                <label style={lbl}>Hero Title Highlight (line 2 — shown in color)</label>
                <input style={inp} value={cfg.heroTitleHighlight} onChange={e => setCfg(p => ({ ...p, heroTitleHighlight: e.target.value }))} placeholder="Win Big." />
                <label style={lbl}>Hero Subtitle</label>
                <input style={inp} value={cfg.heroSubtitle} onChange={e => setCfg(p => ({ ...p, heroSubtitle: e.target.value }))} placeholder="No downloads. No sign-up required." />
                <label style={lbl}>Games Count Label</label>
                <input style={inp} value={cfg.gamesCount} onChange={e => setCfg(p => ({ ...p, gamesCount: e.target.value }))} placeholder="1500+" />
              </div>

              {/* How to apply */}
              <div style={{ ...card, background: '#fffbeb', border: '1px solid #fde68a' }}>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#92400e' }}>📋 How To Apply Changes</div>
                <ol style={{ fontSize: 13, color: '#78350f', lineHeight: 2, paddingLeft: 18 }}>
                  <li>Open your project on your computer</li>
                  <li>Go to <code style={{ background: '#fef3c7', padding: '1px 6px', borderRadius: 4 }}>frontend/src/siteConfig.js</code></li>
                  <li>Change the values to match what you set here</li>
                  <li>Save the file</li>
                  <li>Run <code style={{ background: '#fef3c7', padding: '1px 6px', borderRadius: 4 }}>npm run build</code> in terminal</li>
                  <li>Drag the <strong>build</strong> folder to Netlify</li>
                  <li>Done — your changes are live! ✅</li>
                </ol>
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              style={{ marginTop: 8, padding: '13px 40px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 99, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}
            >
              Save & See Instructions ✅
            </button>
          </div>
        )}

      </div>
    </>
  );
}
