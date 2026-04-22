import React, { useState, useEffect } from 'react';

export default function OfflinePage({ onRetry }) {
  const [retrying, setRetrying] = useState(false);
  const [dots, setDots]         = useState('');

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(r => setTimeout(r, 1500)); // small wait so user sees feedback
    onRetry();
    setRetrying(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0d0d1a,#1a1a2e)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, textAlign: 'center', fontFamily: 'Nunito,sans-serif',
    }}>
      {/* Logo area */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg,#ff6b35,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 40px #ff6b3540' }}>
          <img src="/logo.svg" alt="GameSpark" style={{ width: 60, height: 60 }} onError={e => { e.target.style.display = 'none'; }} />
        </div>
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 900, color: '#fff' }}>
          Game<span style={{ color: '#ff6b35' }}>Spark</span>
        </div>
      </div>

      {/* Offline icon */}
      <div style={{ fontSize: 72, marginBottom: 24, lineHeight: 1, filter: 'grayscale(0.3)' }}>
        📡
      </div>

      <h1 style={{ fontFamily: 'Orbitron,monospace', fontSize: 'clamp(20px,5vw,28px)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
        No Connection
      </h1>

      <p style={{ color: '#ffffff77', fontSize: 14, maxWidth: 320, lineHeight: 1.7, marginBottom: 8 }}>
        It looks like you're offline. Check your WiFi or mobile data and try again.
      </p>

      <p style={{ color: '#ffffff44', fontSize: 12, marginBottom: 32 }}>
        {retrying ? `Checking connection${dots}` : 'Games are waiting for you!'}
      </p>

      {/* Retry button */}
      <button
        onClick={handleRetry}
        disabled={retrying}
        style={{
          padding: '13px 40px',
          background: retrying ? '#374151' : 'linear-gradient(135deg,#ff6b35,#ff8c42)',
          color: '#fff', border: 'none', borderRadius: 99,
          fontSize: 15, fontWeight: 800, cursor: retrying ? 'not-allowed' : 'pointer',
          fontFamily: 'Nunito,sans-serif',
          boxShadow: retrying ? 'none' : '0 6px 20px #ff6b3550',
          transition: 'all 0.2s', marginBottom: 16,
        }}
      >
        {retrying ? `Retrying${dots}` : '🔄 Try Again'}
      </button>

      <p style={{ color: '#ffffff33', fontSize: 11 }}>
        GameSpark • Free Online Games
      </p>

      {/* Animated signal rings */}
      <div style={{ position: 'absolute', top: '15%', right: '10%', opacity: 0.06 }}>
        <div style={{ width: 120, height: 120, border: '2px solid #ff6b35', borderRadius: '50%', animation: 'ring 2s ease-out infinite' }} />
        <div style={{ width: 80, height: 80, border: '2px solid #ff6b35', borderRadius: '50%', position: 'absolute', top: 20, left: 20, animation: 'ring 2s ease-out infinite 0.5s' }} />
      </div>

      <style>{`
        @keyframes ring {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
