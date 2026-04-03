import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function Admin() {
  const { user, API } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    if (!user) { nav('/login'); return; }
    if (user.role !== 'admin') { nav('/'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [dash, usrs] = await Promise.all([
        axios.get(`${API}/api/admin/dashboard`),
        axios.get(`${API}/api/admin/users`)
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

  const fmtTime = (s) => !s ? '0s' : s < 60 ? `${s}s` : `${Math.floor(s/60)}m`;

  if (loading) return <div style={{ padding: 60, textAlign: 'center', fontFamily: 'Orbitron,monospace' }}>Loading admin panel...</div>;

  const p = { padding: 28 };
  const card = { background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px #0000000a', marginBottom: 20 };
  const statGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 24 };
  const statBox = (color) => ({ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 14, padding: '18px', textAlign: 'center' });
  const statNum = (color) => ({ fontFamily: 'Orbitron,monospace', fontSize: 26, fontWeight: 700, color });
  const tabBtn = (active) => ({ padding: '8px 20px', borderRadius: 99, border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', background: active ? '#ff6b35' : '#f3f4f6', color: active ? '#fff' : 'var(--muted)', marginRight: 8 });

  return (
    <>
      <Helmet><title>Admin Panel — GameSpark</title></Helmet>
      <div style={p}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 700 }}>⚙️ Admin Panel</div>
          <span style={{ background: '#ff6b35', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99 }}>LIVE DATA</span>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 24 }}>
          <button style={tabBtn(tab === 'dashboard')} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
          <button style={tabBtn(tab === 'users')} onClick={() => setTab('users')}>👥 Users</button>
          <button style={tabBtn(tab === 'games')} onClick={() => setTab('games')}>🎮 Top Games</button>
        </div>

        {tab === 'dashboard' && data && (
          <>
            <div style={statGrid}>
              <div style={statBox('#ff6b35')}><div style={{ fontSize: 20, marginBottom: 8 }}>👥</div><div style={statNum('#ff6b35')}>{data.totalUsers}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Users</div></div>
              <div style={statBox('#7c3aed')}><div style={{ fontSize: 20, marginBottom: 8 }}>🎮</div><div style={statNum('#7c3aed')}>{data.totalSessions}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Sessions</div></div>
              <div style={statBox('#06d6a0')}><div style={{ fontSize: 20, marginBottom: 8 }}>🆕</div><div style={statNum('#06d6a0')}>{data.todayUsers}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>New Today</div></div>
              <div style={statBox('#ffd166')}><div style={{ fontSize: 20, marginBottom: 8 }}>⏱️</div><div style={statNum('#ffd166')}>{fmtTime(data.totalPlayTime)}</div><div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Total Playtime</div></div>
            </div>

            <div style={card}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🕐 Recent Signups</div>
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
          </>
        )}

        {tab === 'users' && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700 }}>👥 All Users ({users.length})</div>
              <input style={{ flex: 1, maxWidth: 280, padding: '8px 14px', borderRadius: 8, border: '2px solid #e5e7eb', fontSize: 13, fontFamily: 'Nunito,sans-serif', outline: 'none' }}
                placeholder="Search by name or email..." value={search} onChange={e => searchUsers(e.target.value)} />
            </div>
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
                  <tr key={u._id} style={{ borderTop: '1px solid #f0f0f0', cursor: 'pointer' }}>
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
        )}

        {tab === 'games' && data && (
          <div style={card}>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎮 Most Played Games</div>
            {data.topGames.map((g, i) => (
              <div key={g._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 16, fontWeight: 700, color: i < 3 ? '#ffd166' : 'var(--muted)', width: 30 }}>#{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{g.plays} plays · {fmtTime(g.totalTime)} total</div>
                </div>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: '#ff6b35' }}>{g.plays}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
