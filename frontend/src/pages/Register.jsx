import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  const wrap = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
  const card = { background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 8px 40px #0000001a' };
  const logo = { fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 22, color: 'var(--dark)', textAlign: 'center', marginBottom: 6 };
  const sub = { textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginBottom: 28 };
  const label = { display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--dark)' };
  const input = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 14, fontFamily: 'Nunito,sans-serif', transition: 'border 0.2s', marginBottom: 16 };
  const btn = { width: '100%', padding: '13px', borderRadius: 10, background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 };
  const errBox = { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 };
  const perks = [['🔥','Daily streak tracking'],['🏆','Leaderboard ranking'],['❤️','Save favourite games'],['🎖️','Earn badges & XP']];

  return (
    <>
      <Helmet><title>Sign Up Free — GameSpark</title></Helmet>
      <div style={wrap}>
        <div style={card}>
          <div style={logo}>⚡ Join GameSpark</div>
          <div style={sub}>Create your free account and start earning XP!</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {perks.map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--muted)', background: '#f9fafb', borderRadius: 8, padding: '8px 10px' }}>
                <span style={{ fontSize: 16 }}>{icon}</span> {text}
              </div>
            ))}
          </div>
          {error && <div style={errBox}>{error}</div>}
          <form onSubmit={handle}>
            <label style={label}>Username</label>
            <input style={input} type="text" placeholder="e.g. ProGamer99" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required minLength={3} maxLength={20}
              onFocus={e => e.target.style.borderColor = '#ff6b35'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            <label style={label}>Email</label>
            <input style={input} type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
              onFocus={e => e.target.style.borderColor = '#ff6b35'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            <label style={label}>Password</label>
            <input style={input} type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6}
              onFocus={e => e.target.style.borderColor = '#ff6b35'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            <button style={btn} type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create Free Account'}</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            Already have an account? <Link to="/login" style={{ color: '#ff6b35', fontWeight: 800 }}>Login here</Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#9ca3af' }}>
            By signing up, you agree to our <Link to="/privacy" style={{ color: '#9ca3af' }}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </>
  );
}
