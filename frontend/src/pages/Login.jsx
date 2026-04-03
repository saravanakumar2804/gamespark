import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      nav(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const wrap = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
  const card = { background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 8px 40px #0000001a' };
  const logo = { fontFamily: 'Orbitron,monospace', fontWeight: 900, fontSize: 22, color: 'var(--dark)', textAlign: 'center', marginBottom: 6 };
  const sub = { textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginBottom: 28 };
  const label = { display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--dark)' };
  const input = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 14, fontFamily: 'Nunito,sans-serif', transition: 'border 0.2s', marginBottom: 16 };
  const btn = { width: '100%', padding: '13px', borderRadius: 10, background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 };
  const errBox = { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 };

  return (
    <>
      <Helmet><title>Login — GameSpark</title></Helmet>
      <div style={wrap}>
        <div style={card}>
          <div style={logo}>⚡ GameSpark</div>
          <div style={sub}>Welcome back! Login to track your progress</div>
          {error && <div style={errBox}>{error}</div>}
          <form onSubmit={handle}>
            <label style={label}>Email</label>
            <input style={input} type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
              onFocus={e => e.target.style.borderColor = '#ff6b35'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            <label style={label}>Password</label>
            <input style={input} type="password" placeholder="Your password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
              onFocus={e => e.target.style.borderColor = '#ff6b35'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            <button style={btn} type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login to GameSpark'}</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
            No account? <Link to="/register" style={{ color: '#ff6b35', fontWeight: 800 }}>Sign up free</Link>
          </div>
        </div>
      </div>
    </>
  );
}
