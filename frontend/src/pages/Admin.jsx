import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

export default function Admin() {
  const { user, loading, API } = useAuth();
  const nav = useNavigate();
  const [data, setData]     = useState(null);
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState('dashboard');
  const [fetching, setFetching] = useState(true);

  // FIX: Wait for auth loading before checking — prevents redirect on refresh
  useEffect(() => {
    if (loading) return;              // Still verifying token — wait
    if (!user) { nav('/login'); return; }
    if (user.role !== 'admin') { nav('/'); return; }
    loadData();
  }, [user, loading]);

  const loadData = async () => {
    try {
      setFetching(true);
      const [dash, usrs] = await Promise.all([
        axios.get(`${API}/api/admin/dashboard`),
        axios.get(`${API}/api/admin/users`),
      ]);
      setData(dash.data);
      setUsers(usrs.data.users);
    } catch { nav('/'); }
    finally { setFetching(false); }
  };

  const searchUsers = async (q) => {
    setSearch(q);
    try {
      const r = await axios.get(`${API}/api/admin/users?search=${q}`);
      setUsers(r.data.users);
    } catch {}
  };

  const fmtTime = (s) => !s ? '0s' : s < 60 ? `${s}s` : `${Math.floor(s / 60)}m`;

  // Show spinner while auth is verifying OR data is loading
  if (loading || fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTopColor: SITE_CONFIG.primaryColor, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 12, color: '#6b7280' }}>Loading Admin Panel...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const card    = { background: '#fff', borderRadius: 14, padding: 18, boxShadow: '0 2px 12px #0000000a', marginBottom: 18 };
  const sGrid   = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 20 };
  const sBox    = (c) => ({ background: `${c}15`, border: `1px solid ${c}30`, borderRadius: 12, padding: '16px', textAlign: 'center' });
  const sNum    = (c) => ({ fontFamily: 'Orbitron,monospace', fontSize: 24, fontWeight: 700, color: c });
  const tabBtn  = (a) => ({ padding: '7px 18px', borderRadius: 99, border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', background: a ? SITE_CONFIG.primaryColor : '#f3f4f6', color: a ? '#fff' : '#6b7280', marginRight: 8, fontFamily: 'Nunito,sans-serif' });
  const thStyle = { padding: '9px 10px', textAlign: 'left', fontWeight: 800, color: '#6b7280', fontSize: 11 };
  const tdStyle = { padding: '9px 10px', fontSize: 13 };

  return (
    <>
      <Helmet><title>Admin Panel — {SITE_CONFIG.name}</title></Helmet>
      <div style={{ padding: 20 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700 }}>⚙️ Admin Panel</div>
          <span style={{ background: SITE_CONFIG.primaryColor, color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 99 }}>LIVE</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <button style={tabBtn(tab === 'dashboard')} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
          <button style={tabBtn(tab === 'users')}     onClick={() => setTab('users')}>👥 Users</button>
          <button style={tabBtn(tab === 'games')}     onClick={() => setTab('games')}>🎮 Top Games</button>
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && data && (
          <>
            <div style={sGrid}>
              <div style={sBox('#ff6b35')}><div style={{ fontSize: 18, marginBottom: 6 }}>👥</div><div style={sNum('#ff6b35')}>{data.totalUsers}</div><div style={{ fontSize: 11, color: '#6b7280', marginTop: 3, fontWeight: 600 }}>Total Users</div></div>
              <div style={sBox('#7c3aed')}><div style={{ fontSize: 18, marginBottom: 6 }}>🎮</div><div style={sNum('#7c3aed')}>{data.totalSessions}</div><div style={{ fontSize: 11, color: '#6b7280', marginTop: 3, fontWeight: 600 }}>Total Sessions</div></div>
              <div style={sBox('#06d6a0')}><div style={{ fontSize: 18, marginBottom: 6 }}>🆕</div><div style={sNum('#06d6a0')}>{data.todayUsers}</div><div style={{ fontSize: 11, color: '#6b7280', marginTop: 3, fontWeight: 600 }}>New Today</div></div>
              <div style={sBox('#ffd166')}><div style={{ fontSize: 18, marginBottom: 6 }}>⏱️</div><div style={sNum('#ffd166')}>{fmtTime(data.totalPlayTime)}</div><div style={{ fontSize: 11, color: '#6b7280', marginTop: 3, fontWeight: 600 }}>Total Playtime</div></div>
            </div>
            <div style={card}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🕐 Recent Signups</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead><tr style={{ background: '#f9fafb' }}>
                    {['Username','Email','Games','Time','Streak','XP','Joined'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {(data.recentUsers || []).map(u => (
                      <tr key={u._id} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ ...tdStyle, fontWeight: 700 }}>{u.username}</td>
                        <td style={{ ...tdStyle, color: '#6b7280' }}>{u.email}</td>
                        <td style={{ ...tdStyle, fontFamily: 'Orbitron,monospace', color: '#ff6b35' }}>{u.gamesPlayed}</td>
                        <td style={{ ...tdStyle, color: '#6b7280' }}>{fmtTime(u.totalPlayTime)}</td>
                        <td style={{ ...tdStyle, color: '#ffd166', fontWeight: 700 }}>🔥 {u.streak}</td>
                        <td style={{ ...tdStyle, fontFamily: 'Orbitron,monospace', color: '#7c3aed' }}>{u.xp}</td>
                        <td style={{ ...tdStyle, color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700 }}>👥 All Users ({users.length})</div>
              <input style={{ flex: 1, minWidth: 200, padding: '7px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontSize: 13, fontFamily: 'Nunito,sans-serif', outline: 'none' }}
                placeholder="Search..." value={search} onChange={e => searchUsers(e.target.value)} />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ background: '#f9fafb' }}>
                  {['Username','Email','Level','Games','Streak','XP','Role','Joined'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>{u.username}</td>
                      <td style={{ ...tdStyle, color: '#6b7280' }}>{u.email}</td>
                      <td style={tdStyle}><span style={{ background: '#ff6b3520', color: '#ff6b35', fontWeight: 800, padding: '2px 7px', borderRadius: 99, fontSize: 11 }}>Lv{u.level}</span></td>
                      <td style={{ ...tdStyle, fontFamily: 'Orbitron,monospace', color: '#ff6b35' }}>{u.gamesPlayed}</td>
                      <td style={{ ...tdStyle, color: '#ffd166', fontWeight: 700 }}>🔥{u.streak}</td>
                      <td style={{ ...tdStyle, fontFamily: 'Orbitron,monospace', color: '#7c3aed' }}>{u.xp}</td>
                      <td style={tdStyle}><span style={{ background: u.role === 'admin' ? '#7c3aed20' : '#f3f4f6', color: u.role === 'admin' ? '#7c3aed' : '#6b7280', fontWeight: 700, padding: '2px 7px', borderRadius: 99, fontSize: 11 }}>{u.role}</span></td>
                      <td style={{ ...tdStyle, color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Games */}
        {tab === 'games' && data && (
          <div style={card}>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🎮 Most Played Games</div>
            {(data.topGames || []).length === 0
              ? <div style={{ color: '#9ca3af', textAlign: 'center', padding: 30 }}>No sessions recorded yet.</div>
              : (data.topGames || []).map((g, i) => (
                <div key={g._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: i < 3 ? '#ffd166' : '#9ca3af', width: 28 }}>#{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{g.title}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{g.plays} plays · {fmtTime(g.totalTime)}</div>
                  </div>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, color: SITE_CONFIG.primaryColor }}>{g.plays}</div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </>
  );
}
