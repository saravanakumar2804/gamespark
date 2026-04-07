import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

const API_URL = process.env.REACT_APP_API_URL || 'https://gamespark-api.onrender.com';

const SAMPLE_REVIEWS = [
  { id: 1, name: "Ravi K.", rating: 5, text: "Amazing website! So many games to play. Love the daily challenges.", date: "2025-12-01" },
  { id: 2, name: "Priya S.", rating: 4, text: "Great collection of games. Works perfectly on mobile too!", date: "2025-12-03" },
  { id: 3, name: "Arjun M.", rating: 5, text: "I play every day now. The streak system is addictive!", date: "2025-12-05" },
];

export default function Feedback() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [form, setForm]       = useState({ name: user?.username || '', email: user?.email || '', rating: 5, text: '', type: 'review' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) { setError('Please fill in your name and message.'); return; }
    if (form.text.length < 10)   { setError('Message must be at least 10 characters.'); return; }

    // Add to local list (in production save to backend)
    const newReview = {
      id: Date.now(),
      name:   form.name,
      rating: form.rating,
      text:   form.text,
      date:   new Date().toISOString().split('T')[0],
      type:   form.type,
    };
    setReviews(prev => [newReview, ...prev]);
    setSubmitted(true);
    setForm(p => ({ ...p, text: '', rating: 5 }));
    setError('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const stars = (n, interactive, onClick) => (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          style={{ fontSize: interactive ? 24 : 14, cursor: interactive ? 'pointer' : 'default', color: i <= n ? '#ffd166' : '#e5e7eb', transition: 'color 0.1s' }}
          onClick={() => interactive && onClick(i)}
        >★</span>
      ))}
    </div>
  );

  const card   = { background: '#fff', borderRadius: 14, padding: '22px', boxShadow: '0 2px 12px #0000000a', marginBottom: 20 };
  const inp    = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 14, fontFamily: 'Nunito,sans-serif', outline: 'none', marginBottom: 12, transition: 'border 0.2s' };
  const label  = { display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 6 };
  const typeBtn = (t) => ({ padding: '7px 18px', borderRadius: 99, border: `2px solid ${form.type === t ? SITE_CONFIG.primaryColor : '#e5e7eb'}`, background: form.type === t ? `${SITE_CONFIG.primaryColor}15` : '#fff', color: form.type === t ? SITE_CONFIG.primaryColor : '#6b7280', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' });

  return (
    <>
      <Helmet>
        <title>Feedback & Reviews — {SITE_CONFIG.name}</title>
        <meta name="description" content={`Share your feedback and reviews about ${SITE_CONFIG.name}. Tell us what you think!`} />
      </Helmet>

      <div style={{ padding: '20px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>💬 Feedback & Reviews</div>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>Tell us what you think! Your feedback helps us improve.</p>

        {/* Overall rating summary */}
        <div style={{ ...card, background: 'linear-gradient(135deg,#0d0d1a,#1a1a2e)', color: '#fff', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 48, fontWeight: 900, color: '#ffd166' }}>4.8</div>
            <div style={{ fontSize: 20, color: '#ffd166', marginBottom: 4 }}>★★★★★</div>
            <div style={{ fontSize: 12, color: '#ffffff77' }}>{reviews.length} reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {[5,4,3,2,1].map(n => {
              const count = reviews.filter(r => r.rating === n).length;
              const pct   = reviews.length ? Math.round(count / reviews.length * 100) : 0;
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#ffd166', minWidth: 12 }}>{n}★</span>
                  <div style={{ flex: 1, height: 8, background: '#ffffff18', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#ffd166', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#ffffff77', minWidth: 30 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit feedback form */}
        <div style={card}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>✍️ Write a Review</div>

          {submitted && (
            <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#166534' }}>
              ✅ Thank you for your feedback! It means a lot to us.
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Feedback type */}
            <label style={label}>Type of feedback</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {[['review','⭐ Review'],['bug','🐛 Bug Report'],['suggestion','💡 Suggestion'],['other','💬 Other']].map(([t, lbl]) => (
                <button key={t} type="button" style={typeBtn(t)} onClick={() => setForm(p => ({ ...p, type: t }))}>{lbl}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={label}>Your Name *</label>
                <input style={inp} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required
                  onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={label}>Email (optional)</label>
                <input style={inp} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com"
                  onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            </div>

            {form.type === 'review' && (
              <div style={{ marginBottom: 14 }}>
                <label style={label}>Your Rating *</label>
                {stars(form.rating, true, (n) => setForm(p => ({ ...p, rating: n })))}
              </div>
            )}

            <label style={label}>Your Message *</label>
            <textarea
              style={{ ...inp, minHeight: 100, resize: 'vertical', display: 'block' }}
              value={form.text}
              onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
              placeholder={form.type === 'review' ? "Tell us about your experience..." : form.type === 'bug' ? "Describe the bug you found..." : "Share your idea or message..."}
              required
              onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />

            <button type="submit" style={{ padding: '11px 32px', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: '#fff', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
              Submit Feedback 🚀
            </button>
          </form>
        </div>

        {/* Reviews list */}
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🌟 Recent Reviews</div>
        {reviews.map(r => (
          <div key={r.id} style={{ ...card, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                  {r.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{r.date}</div>
                </div>
              </div>
              {r.rating && stars(r.rating, false)}
            </div>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
