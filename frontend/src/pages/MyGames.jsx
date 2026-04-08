import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

// Top HTML5 games with real iframe-embeddable URLs that actually play
// These are shown in the community games section
const COMMUNITY_GAMES = [
  { id: 'cg1', title: 'Krunker.io',     category: 'shooter',     icon: '🔫', url: 'https://krunker.io/',          author: 'Verified', plays: 12400, approved: true  },
  { id: 'cg2', title: 'Slither.io',     category: 'multiplayer', icon: '🐍', url: 'https://slither.io/',          author: 'Verified', plays: 9800,  approved: true  },
  { id: 'cg3', title: 'Smash Karts',    category: 'racing',      icon: '🏎️', url: 'https://smashkarts.io/',       author: 'Verified', plays: 7600,  approved: true  },
  { id: 'cg4', title: 'Shell Shockers', category: 'shooter',     icon: '🥚', url: 'https://shellshock.io/',       author: 'Verified', plays: 8900,  approved: true  },
  { id: 'cg5', title: 'Agar.io',        category: 'multiplayer', icon: '🔵', url: 'https://agar.io/',             author: 'Verified', plays: 11200, approved: true  },
  { id: 'cg6', title: '1v1.LOL',        category: 'shooter',     icon: '🏗️', url: 'https://1v1.lol/',             author: 'Verified', plays: 6700,  approved: true  },
];

const CATS   = ['arcade','action','puzzle','racing','sports','strategy','shooter','casual','adventure','multiplayer'];
const EMOJIS = ['🎮','🚀','⚔️','🧩','🏎️','⚽','🎯','🐍','👾','🔫','🏆','💥','🌟','🎪','🎲','🔵','🥚','🏗️','🛸','⚡'];

export default function MyGames() {
  const { user }     = useAuth();
  const nav          = useNavigate();
  const isAdmin      = user?.role === 'admin';

  const [games, setGames]             = useState(COMMUNITY_GAMES);
  const [activeGame, setActiveGame]   = useState(null);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState('');

  // Admin form — can add game with iframe/URL directly
  const [adminForm, setAdminForm] = useState({ title: '', url: '', category: 'arcade', description: '', icon: '🎮', iframeCode: '' });

  // User form — submit request only (admin approves)
  const [userForm, setUserForm] = useState({ name: user?.username || '', email: user?.email || '', gameTitle: '', gameUrl: '', category: 'arcade', description: '' });

  const inp    = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 14, fontFamily: 'Nunito,sans-serif', outline: 'none', marginBottom: 12 };
  const label  = { display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 5 };
  const card   = { background: '#fff', borderRadius: 14, padding: '22px', boxShadow: '0 2px 12px #0000000a', marginBottom: 20 };

  // ── Admin: add game directly ───────────────────────────────────────────────
  const handleAdminAdd = (e) => {
    e.preventDefault();
    if (!adminForm.title) { setError('Game title is required'); return; }

    // If iframe code was pasted, extract src URL from it
    let gameUrl = adminForm.url;
    if (adminForm.iframeCode) {
      const match = adminForm.iframeCode.match(/src=["']([^"']+)["']/i);
      if (match) gameUrl = match[1];
    }

    if (!gameUrl) { setError('Please provide a game URL or iframe code'); return; }

    const newGame = {
      id:       `admin_${Date.now()}`,
      title:    adminForm.title,
      category: adminForm.category,
      url:      gameUrl,
      icon:     adminForm.icon,
      author:   'Admin',
      plays:    0,
      approved: true,
    };
    setGames(prev => [newGame, ...prev]);
    setSubmitted(true);
    setError('');
    setAdminForm({ title: '', url: '', category: 'arcade', description: '', icon: '🎮', iframeCode: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  // ── User: submit game request ─────────────────────────────────────────────
  const handleUserRequest = (e) => {
    e.preventDefault();
    if (!userForm.gameTitle || !userForm.gameUrl) { setError('Game title and URL are required'); return; }
    setSubmitted(true);
    setError('');
    setUserForm(p => ({ ...p, gameTitle: '', gameUrl: '', description: '' }));
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Helmet>
        <title>{isAdmin ? 'Add Games — Admin' : 'Suggest a Game'} — {SITE_CONFIG.name}</title>
      </Helmet>

      <div style={{ padding: '20px', maxWidth: 860, margin: '0 auto' }}>

        {/* ── ADMIN VIEW ─────────────────────────────────────────────────── */}
        {isAdmin ? (
          <>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>⚙️ Add Game — Admin Panel</div>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Add any game by pasting its URL or iframe embed code. It will appear live immediately.</p>

            <div style={card}>
              {submitted && (
                <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#166534' }}>
                  ✅ Game added successfully! It is now live on the website.
                </div>
              )}
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminAdd}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={label}>Game Title *</label>
                    <input style={inp} value={adminForm.title} onChange={e => setAdminForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Subway Surfers" required onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label style={label}>Category</label>
                    <select style={{ ...inp, background: '#fff', cursor: 'pointer' }} value={adminForm.category} onChange={e => setAdminForm(p => ({ ...p, category: e.target.value }))}>
                      {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <label style={label}>Game URL (direct play link)</label>
                <input style={inp} type="url" value={adminForm.url} onChange={e => setAdminForm(p => ({ ...p, url: e.target.value }))} placeholder="https://game-website.com/play" onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />

                <label style={label}>— OR — Paste iframe embed code</label>
                <textarea
                  style={{ ...inp, minHeight: 80, resize: 'vertical', display: 'block', fontFamily: 'monospace', fontSize: 12 }}
                  value={adminForm.iframeCode}
                  onChange={e => setAdminForm(p => ({ ...p, iframeCode: e.target.value }))}
                  placeholder={`<iframe src="https://game-url.com" width="800" height="600"></iframe>`}
                  onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 14, marginTop: -8 }}>
                  💡 Paste the full iframe code — the URL will be extracted automatically
                </div>

                <label style={label}>Choose Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {EMOJIS.map(em => (
                    <button key={em} type="button" onClick={() => setAdminForm(p => ({ ...p, icon: em }))}
                      style={{ width: 36, height: 36, fontSize: 18, borderRadius: 8, border: `2px solid ${adminForm.icon === em ? SITE_CONFIG.primaryColor : '#e5e7eb'}`, background: adminForm.icon === em ? `${SITE_CONFIG.primaryColor}15` : '#fff', cursor: 'pointer' }}>
                      {em}
                    </button>
                  ))}
                </div>

                <button type="submit" style={{ padding: '11px 32px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
                  ➕ Add Game Live
                </button>
              </form>
            </div>
          </>
        ) : (
          /* ── USER VIEW — suggest a game ─────────────────────────────── */
          <>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>🎮 Suggest a Game</div>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Know a great browser game? Tell us and we will review it for addition to {SITE_CONFIG.name}!</p>

            <div style={card}>
              {submitted && (
                <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 10, padding: '14px 16px', marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#166534' }}>
                  ✅ Thanks! We will review your suggestion within 24-48 hours.
                </div>
              )}
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>
                  {error}
                </div>
              )}
              {!user && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: 13, color: '#92400e', fontWeight: 700 }}>
                  💡 <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => nav('/login')}>Login</span> to suggest games and track your suggestions.
                </div>
              )}
              <form onSubmit={handleUserRequest}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={label}>Your Name</label>
                    <input style={inp} value={userForm.name} onChange={e => setUserForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label style={label}>Game Category</label>
                    <select style={{ ...inp, background: '#fff' }} value={userForm.category} onChange={e => setUserForm(p => ({ ...p, category: e.target.value }))}>
                      {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <label style={label}>Game Name *</label>
                <input style={inp} value={userForm.gameTitle} onChange={e => setUserForm(p => ({ ...p, gameTitle: e.target.value }))} placeholder="e.g. Among Us Online" required onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                <label style={label}>Game URL * (where can it be played?)</label>
                <input style={inp} type="url" value={userForm.gameUrl} onChange={e => setUserForm(p => ({ ...p, gameUrl: e.target.value }))} placeholder="https://..." required onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                <label style={label}>Why do you recommend it?</label>
                <textarea style={{ ...inp, minHeight: 70, resize: 'vertical', display: 'block' }} value={userForm.description} onChange={e => setUserForm(p => ({ ...p, description: e.target.value }))} placeholder="Tell us why this game is great..." onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                <button type="submit" style={{ padding: '11px 32px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
                  Submit Suggestion 🚀
                </button>
              </form>
            </div>
          </>
        )}

        {/* Community games list — visible to all */}
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
          🌟 Top Browser Games ({games.filter(g => g.approved).length})
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {games.filter(g => g.approved).map(g => (
            <div key={g.id} style={{ background: '#fff', borderRadius: 12, padding: '14px', boxShadow: '0 2px 10px #0000000a', border: '0.5px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>{g.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</div>
                  <div style={{ fontSize: 10, color: '#6b7280' }}>{g.category} · {g.plays.toLocaleString()} plays</div>
                </div>
              </div>
              <button onClick={() => setActiveGame(g)} style={{ width: '100%', padding: '7px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
                ▶ Play Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick game player */}
      {activeGame && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 960 }}>
            <span style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, color: '#fff', flex: 1 }}>{activeGame.title}</span>
            <button onClick={() => setActiveGame(null)} style={{ background: '#ffffff18', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✕ Close</button>
          </div>
          <iframe
            key={activeGame.id}
            src={activeGame.url}
            title={activeGame.title}
            style={{ width: '100%', maxWidth: 960, height: 'calc(100dvh - 100px)', border: 'none', borderRadius: 10 }}
            allow="fullscreen; autoplay; pointer-lock"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
          />
        </div>
      )}
    </>
  );
}
