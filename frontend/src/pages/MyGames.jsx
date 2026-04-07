import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

// Sample submitted games
const SAMPLE_MY_GAMES = [
  { id: 'mg1', title: 'Space Shooter', category: 'shooter', url: 'https://xwillie.itch.io/space-shooter', icon: '🚀', author: 'Community', plays: 234, approved: true },
  { id: 'mg2', title: 'Maze Runner',   category: 'puzzle',  url: 'https://itch.io/', icon: '🌀', author: 'Community', plays: 189, approved: true },
];

export default function MyGames() {
  const { user } = useAuth();
  const [games, setGames]         = useState(SAMPLE_MY_GAMES);
  const [form, setForm]           = useState({ title: '', url: '', category: 'arcade', description: '', icon: '🎮' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');
  const [activeGame, setActiveGame] = useState(null);

  const EMOJIS = ['🎮','🚀','⚔️','🧩','🏎️','⚽','🎯','🐍','👾','🔫','🏆','💥','🌟','🎪','🎲'];
  const CATS   = ['arcade','action','puzzle','racing','sports','strategy','shooter','casual','adventure','multiplayer'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.url) { setError('Game title and URL are required.'); return; }
    if (!form.url.startsWith('http')) { setError('URL must start with http:// or https://'); return; }

    const newGame = {
      id:          `mg_${Date.now()}`,
      title:       form.title,
      category:    form.category,
      url:         form.url,
      description: form.description,
      icon:        form.icon,
      author:      user?.username || 'Anonymous',
      plays:       0,
      approved:    false, // pending review
    };
    setGames(prev => [newGame, ...prev]);
    setSubmitted(true);
    setForm({ title: '', url: '', category: 'arcade', description: '', icon: '🎮' });
    setError('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const card   = { background: '#fff', borderRadius: 14, padding: '22px', boxShadow: '0 2px 12px #0000000a', marginBottom: 20 };
  const inp    = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 14, fontFamily: 'Nunito,sans-serif', outline: 'none', marginBottom: 12 };
  const label  = { display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 5 };

  return (
    <>
      <Helmet>
        <title>Add Your Game — {SITE_CONFIG.name}</title>
        <meta name="description" content={`Submit your HTML5 game to ${SITE_CONFIG.name} and reach thousands of players for free!`} />
      </Helmet>

      <div style={{ padding: '20px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>🕹️ Add Your Game</div>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Have an HTML5 game? Submit it here and reach thousands of players on {SITE_CONFIG.name} — completely free!</p>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
          {[['🌐','HTML5 games only','Must run in browser'],['🔗','Share your URL','We embed your game'],['⏱️','24-48hr review','We check quality'],['🎉','Go live free','Reach 1000s of users']].map(([icon, title, sub]) => (
            <div key={title} style={{ background: '#f9fafb', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Submission form */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📤 Submit Your Game</div>

          {submitted && (
            <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 10, padding: '14px 16px', marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#166534' }}>
              ✅ Game submitted! We will review it within 24-48 hours and notify you if approved.
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={label}>Game Title *</label>
                <input style={inp} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="My Awesome Game" required
                  onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={label}>Category</label>
                <select style={{ ...inp, background: '#fff', cursor: 'pointer' }} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <label style={label}>Game URL * (must be playable in browser)</label>
            <input style={inp} type="url" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://yourname.itch.io/your-game" required
              onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'} />

            <label style={label}>Description</label>
            <textarea style={{ ...inp, minHeight: 80, resize: 'vertical', display: 'block' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your game in 1-2 sentences..."
              onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'} />

            <label style={label}>Choose an Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {EMOJIS.map(em => (
                <button key={em} type="button" onClick={() => setForm(p => ({ ...p, icon: em }))}
                  style={{ width: 38, height: 38, fontSize: 20, borderRadius: 8, border: `2px solid ${form.icon === em ? SITE_CONFIG.primaryColor : '#e5e7eb'}`, background: form.icon === em ? `${SITE_CONFIG.primaryColor}15` : '#fff', cursor: 'pointer' }}>
                  {em}
                </button>
              ))}
            </div>

            <button type="submit" style={{ padding: '11px 32px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
              Submit Game 🚀
            </button>
          </form>
        </div>

        {/* Requirements */}
        <div style={{ ...card, background: '#fffbeb', border: '1px solid #fde68a' }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#92400e' }}>📋 Requirements</div>
          <ul style={{ fontSize: 13, color: '#78350f', lineHeight: 2, paddingLeft: 18 }}>
            <li>Game must be an HTML5 game playable in a browser</li>
            <li>Game must allow iframe embedding</li>
            <li>No adult content, violence, or inappropriate material</li>
            <li>Game must be family-friendly (all ages)</li>
            <li>You must own the game or have rights to distribute it</li>
          </ul>
        </div>

        {/* Community games */}
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🎮 Community Games</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
          {games.map(g => (
            <div key={g.id} style={{ background: '#fff', borderRadius: 12, padding: '16px', boxShadow: '0 2px 10px #0000000a', border: `1px solid ${g.approved ? '#86efac' : '#fde68a'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 28 }}>{g.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{g.title}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{g.category} · by {g.author}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, background: g.approved ? '#ecfdf5' : '#fffbeb', color: g.approved ? '#166534' : '#92400e', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                  {g.approved ? '✅ Live' : '⏳ Pending'}
                </span>
                {g.approved && (
                  <button onClick={() => setActiveGame(g)} style={{ fontSize: 11, fontWeight: 800, background: SITE_CONFIG.primaryColor, color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 99, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
                    ▶ Play
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeGame && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <iframe key={activeGame.id} src={activeGame.url} title={activeGame.title} style={{ width: '90vw', height: '80vh', border: 'none', borderRadius: 12 }} allow="fullscreen" allowFullScreen />
          <button onClick={() => setActiveGame(null)} style={{ position: 'absolute', top: 16, right: 16, background: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 800, cursor: 'pointer' }}>✕ Close</button>
        </div>
      )}
    </>
  );
}
