import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

// ── Top 2 multiplayer games with room support ─────────────────────────────────
const MP_GAMES = [
  {
    id:          'krunker',
    title:       'Krunker.io',
    icon:        '🔫',
    bg:          'linear-gradient(135deg,#1e1b4b,#312e81)',
    url:         'https://krunker.io/',
    players:     '50K+ online now',
    description: 'Fast-paced FPS browser shooter. Join a room, share the link, and battle your friends!',
    tips:        ['WASD to move', 'Mouse to aim', 'Left click to shoot', 'R to reload', 'Space to jump'],
  },
  {
    id:          'slither',
    title:       'Slither.io',
    icon:        '🐍',
    bg:          'linear-gradient(135deg,#15803d,#166534)',
    url:         'https://slither.io/',
    players:     '30K+ online now',
    description: 'Grow your snake by eating dots and defeating other players. Share a room to play together!',
    tips:        ['Mouse to steer', 'Click to boost', 'Circle enemies to trap them', 'Eat glowing dots to grow'],
  },
];

// ── Simple room-based chat using localStorage + polling ───────────────────────
// No backend needed — uses browser storage for demo chat
// In production this would use WebSocket (Socket.io)
const STORAGE_KEY = (room) => `gs_chat_${room}`;
const MAX_MSGS    = 50;

function getMessages(room) {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY(room)) || '[]'); }
  catch { return []; }
}
function saveMessages(room, msgs) {
  try { localStorage.setItem(STORAGE_KEY(room), JSON.stringify(msgs.slice(-MAX_MSGS))); }
  catch {}
}
function addMessage(room, msg) {
  const msgs = getMessages(room);
  msgs.push({ ...msg, ts: Date.now() });
  saveMessages(room, msgs);
}

// Generate a random room code
function makeRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Multiplayer() {
  const { user }   = useAuth();
  const nav        = useNavigate();
  const [tab, setTab]             = useState('lobby');     // 'lobby' | 'room'
  const [selectedGame, setSelectedGame] = useState(null);
  const [roomCode, setRoomCode]   = useState('');
  const [joinCode, setJoinCode]   = useState('');
  const [messages, setMessages]   = useState([]);
  const [inputMsg, setInputMsg]   = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const [showGame, setShowGame]   = useState(false);
  const [copied, setCopied]       = useState(false);
  const pollRef   = useRef(null);
  const chatRef   = useRef(null);
  const myName    = user?.username || `Player_${Math.random().toString(36).slice(2,6).toUpperCase()}`;

  // Poll messages every second
  useEffect(() => {
    if (tab !== 'room' || !roomCode) return;
    const poll = () => {
      const msgs = getMessages(roomCode);
      setMessages(msgs);
      // Simulate online count (1-4 players based on recent messages)
      const recent = msgs.filter(m => Date.now() - m.ts < 60000);
      const unique  = new Set(recent.map(m => m.user));
      setOnlineCount(Math.max(1, unique.size));
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    };
    poll();
    pollRef.current = setInterval(poll, 1000);
    return () => clearInterval(pollRef.current);
  }, [tab, roomCode]);

  const createRoom = (game) => {
    const code = makeRoomCode();
    setSelectedGame(game);
    setRoomCode(code);
    setMessages([]);
    // Add system message
    addMessage(code, { user: 'System', text: `Room ${code} created by ${myName}. Share the code to invite friends!`, system: true });
    setTab('room');
  };

  const joinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) { alert('Enter a valid room code'); return; }
    setRoomCode(code);
    setSelectedGame(MP_GAMES[0]); // default game
    addMessage(code, { user: 'System', text: `${myName} joined the room!`, system: true });
    setTab('room');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    addMessage(roomCode, { user: myName, text: inputMsg.trim(), system: false });
    setInputMsg('');
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const leaveRoom = () => {
    addMessage(roomCode, { user: 'System', text: `${myName} left the room.`, system: true });
    setTab('lobby');
    setRoomCode('');
    setSelectedGame(null);
    setShowGame(false);
    setMessages([]);
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const p      = { padding: '16px', maxWidth: 1000, margin: '0 auto' };
  const card   = { background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #0000000a' };
  const btn    = (primary) => ({ padding: '10px 22px', borderRadius: 99, fontSize: 13, fontWeight: 800, cursor: 'pointer', border: primary ? 'none' : `2px solid ${SITE_CONFIG.primaryColor}`, background: primary ? `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)` : 'transparent', color: primary ? '#fff' : SITE_CONFIG.primaryColor, fontFamily: 'Nunito,sans-serif' });

  return (
    <>
      <Helmet>
        <title>Multiplayer Games — Play with Friends | {SITE_CONFIG.name}</title>
        <meta name="description" content={`Play multiplayer games with friends on ${SITE_CONFIG.name}. Create a room, invite friends, and chat while playing!`} />
      </Helmet>

      <div style={p}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 900, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            👥 Multiplayer Lobby
            <span style={{ background: '#ecfdf5', color: '#166534', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99, border: '1px solid #86efac' }}>
              🟢 Live
            </span>
          </div>
          <p style={{ color: '#6b7280', fontSize: 13 }}>Create a room, share the code with friends, chat and play together!</p>
        </div>

        {/* ── LOBBY TAB ─────────────────────────────────────────────────────── */}
        {tab === 'lobby' && (
          <>
            {/* Top 2 games */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 24 }}>
              {MP_GAMES.map(game => (
                <div key={game.id} style={{ ...card, overflow: 'hidden' }}>
                  {/* Game banner */}
                  <div style={{ background: game.bg, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.15 }}>{game.icon}</div>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{game.icon}</div>
                    <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{game.title}</div>
                    <div style={{ fontSize: 12, color: '#ffffff88' }}>🟢 {game.players}</div>
                  </div>

                  <div style={{ padding: '18px 20px' }}>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 14 }}>{game.description}</p>

                    {/* Tips */}
                    <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#374151', marginBottom: 8 }}>🎮 Controls</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {game.tips.map(tip => (
                          <span key={tip} style={{ background: '#e5e7eb', color: '#374151', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{tip}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button style={btn(true)} onClick={() => createRoom(game)}>
                        ➕ Create Room
                      </button>
                      <button style={btn(false)} onClick={() => { setSelectedGame(game); setShowGame(true); setTab('room'); setRoomCode(makeRoomCode()); }}>
                        ▶ Play Solo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Join existing room */}
            <div style={{ ...card, padding: '20px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🔑 Join a Room</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  style={{ flex: 1, minWidth: 160, padding: '10px 14px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 14, fontFamily: 'Nunito,sans-serif', outline: 'none', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}
                  placeholder="Enter room code..."
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={8}
                  onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  onKeyDown={e => e.key === 'Enter' && joinRoom()}
                />
                <button style={btn(true)} onClick={joinRoom}>Join Room →</button>
              </div>
              {!user && (
                <div style={{ marginTop: 12, fontSize: 12, color: '#9ca3af' }}>
                  💡 <span style={{ cursor: 'pointer', color: SITE_CONFIG.primaryColor, fontWeight: 700 }} onClick={() => nav('/login')}>Login</span> to save your username in the chat
                </div>
              )}
            </div>

            {/* How it works */}
            <div style={{ ...card, padding: '20px' }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>📋 How Multiplayer Rooms Work</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
                {[['1️⃣','Create a room','Click "Create Room" for your favourite game'],['2️⃣','Share the code','Send the 6-letter code to friends on WhatsApp'],['3️⃣','Chat together','Talk in the room chat while playing'],['4️⃣','Play the game','Click "Open Game" and battle each other!']].map(([num, title, desc]) => (
                  <div key={title} style={{ background: '#f9fafb', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{num}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── ROOM TAB ──────────────────────────────────────────────────────── */}
        {tab === 'room' && (
          <div style={{ display: 'grid', gridTemplateColumns: showGame ? '1fr 320px' : '1fr', gap: 16 }}>

            {/* Game panel */}
            {showGame && selectedGame && (
              <div style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700 }}>{selectedGame.icon} {selectedGame.title}</span>
                  <button onClick={() => setShowGame(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Hide Game</button>
                </div>
                <div style={{ flex: 1, minHeight: 460, position: 'relative' }}>
                  <iframe
                    key={selectedGame.id}
                    src={selectedGame.url}
                    title={selectedGame.title}
                    style={{ width: '100%', height: '100%', minHeight: 460, border: 'none', position: 'absolute', inset: 0 }}
                    allow="fullscreen; autoplay; pointer-lock"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
                  />
                </div>
              </div>
            )}

            {/* Chat + room panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Room info card */}
              <div style={{ ...card, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700 }}>Room Details</div>
                  <button onClick={leaveRoom} style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Leave</button>
                </div>

                {/* Room code */}
                <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#6b7280', marginBottom: 4 }}>ROOM CODE — Share this with friends</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 22, fontWeight: 900, color: SITE_CONFIG.primaryColor, letterSpacing: 3 }}>{roomCode}</div>
                    <button onClick={copyRoomCode} style={{ background: copied ? '#ecfdf5' : SITE_CONFIG.primaryColor, border: 'none', color: copied ? '#166534' : '#fff', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', flexShrink: 0 }}>
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>

                {/* Online count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{onlineCount} player{onlineCount !== 1 ? 's' : ''} in room</span>
                  <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
                </div>

                {/* Game buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {!showGame && selectedGame && (
                    <button onClick={() => setShowGame(true)} style={btn(true)}>▶ Open {selectedGame?.title}</button>
                  )}
                  {MP_GAMES.filter(g => g.id !== selectedGame?.id).map(g => (
                    <button key={g.id} onClick={() => { setSelectedGame(g); setShowGame(true); }} style={btn(false)}>{g.icon} {g.title}</button>
                  ))}
                </div>
              </div>

              {/* Chat card */}
              <div style={{ ...card, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0f0f0', fontFamily: 'Orbitron,monospace', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  💬 Room Chat
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', fontFamily: 'Nunito,sans-serif' }}>{messages.length} messages</span>
                </div>

                {/* Messages */}
                <div
                  ref={chatRef}
                  style={{ flex: 1, minHeight: 260, maxHeight: 340, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12, marginTop: 20 }}>
                      No messages yet. Say hello! 👋
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      {msg.system ? (
                        <div style={{ width: '100%', textAlign: 'center', fontSize: 11, color: '#9ca3af', padding: '4px 0', fontStyle: 'italic' }}>
                          {msg.text}
                        </div>
                      ) : (
                        <>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                            {msg.user[0].toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: msg.user === myName ? SITE_CONFIG.primaryColor : '#374151' }}>{msg.user}</span>
                              <span style={{ fontSize: 10, color: '#9ca3af' }}>{new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#374151', background: msg.user === myName ? `${SITE_CONFIG.primaryColor}12` : '#f3f4f6', padding: '6px 10px', borderRadius: '8px 8px 8px 2px', display: 'inline-block', maxWidth: '100%', wordBreak: 'break-word' }}>
                              {msg.text}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div style={{ borderTop: '1px solid #f0f0f0', padding: '10px 12px' }}>
                  <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
                    <input
                      style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: '2px solid #e5e7eb', fontSize: 13, fontFamily: 'Nunito,sans-serif', outline: 'none' }}
                      placeholder={`Message as ${myName}...`}
                      value={inputMsg}
                      onChange={e => setInputMsg(e.target.value)}
                      maxLength={200}
                      onFocus={e => e.target.style.borderColor = SITE_CONFIG.primaryColor}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                    <button type="submit" style={{ background: `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, border: 'none', color: '#fff', borderRadius: 10, padding: '0 14px', fontSize: 16, cursor: 'pointer' }}>
                      ➤
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
