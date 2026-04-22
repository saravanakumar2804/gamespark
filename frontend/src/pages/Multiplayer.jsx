import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SITE_CONFIG from '../siteConfig';

const API_URL = process.env.REACT_APP_API_URL || 'https://gamespark-api.onrender.com';

const MP_GAMES = [
  {
    id:          'krunker',
    title:       'Krunker.io',
    icon:        '🔫',
    bg:          'linear-gradient(135deg,#1e1b4b,#312e81)',
    url:         'https://krunker.io/',
    players:     '50K+ online now',
    description: 'Fast-paced FPS browser shooter. Create a room, share the code with friends, and battle together!',
    tips:        ['WASD to move','Mouse to aim','Click to shoot','R to reload','Space to jump'],
    mobile:      true,
  },
  {
    id:          'slither',
    title:       'Slither.io',
    icon:        '🐍',
    bg:          'linear-gradient(135deg,#15803d,#166534)',
    url:         'https://slither.io/',
    players:     '30K+ online now',
    description: 'Grow your snake by eating dots and defeating other players. Share a room code and play with friends!',
    tips:        ['Mouse to steer','Click/Space to boost','Circle enemies to trap','Eat dots to grow'],
    mobile:      true,
  },
];

function makeRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Multiplayer() {
  const { user }   = useAuth();
  const nav        = useNavigate();
  const myName     = user?.username || `Guest_${Math.random().toString(36).slice(2,6).toUpperCase()}`;

  const [tab, setTab]               = useState('lobby');
  const [selectedGame, setSelectedGame] = useState(null);
  const [roomCode, setRoomCode]     = useState('');
  const [joinCode, setJoinCode]     = useState('');
  const [messages, setMessages]     = useState([]);
  const [inputMsg, setInputMsg]     = useState('');
  const [showGame, setShowGame]     = useState(false);
  const [copied, setCopied]         = useState(false);
  const [sending, setSending]       = useState(false);
  const lastTs = useRef(0);
  const pollRef = useRef(null);
  const chatRef = useRef(null);

  // FIX: Poll backend for messages — works across devices, not localStorage
  const pollMessages = useCallback(async () => {
    if (!roomCode) return;
    try {
      const res  = await fetch(`${API_URL}/api/chat/${roomCode}?since=${lastTs.current}`);
      const data = await res.json();
      if (data.messages?.length > 0) {
        lastTs.current = data.messages[data.messages.length - 1].ts;
        setMessages(prev => {
          // Merge new messages, avoiding duplicates by timestamp
          const existing = new Set(prev.map(m => m.ts));
          const newMsgs  = data.messages.filter(m => !existing.has(m.ts));
          if (newMsgs.length === 0) return prev;
          const merged = [...prev, ...newMsgs].slice(-80);
          return merged;
        });
        // Scroll to bottom
        setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
      }
    } catch {}
  }, [roomCode]);

  // Poll every 2 seconds when in a room
  useEffect(() => {
    if (tab !== 'room' || !roomCode) return;
    pollMessages(); // immediate first poll
    pollRef.current = setInterval(pollMessages, 2000);
    return () => clearInterval(pollRef.current);
  }, [tab, roomCode, pollMessages]);

  const postSystemMsg = async (code, text) => {
    try { await fetch(`${API_URL}/api/chat/${code}/system`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ text }) }); } catch {}
  };

  const createRoom = async (game) => {
    const code = makeRoomCode();
    setSelectedGame(game);
    setRoomCode(code);
    setMessages([]);
    lastTs.current = 0;
    await postSystemMsg(code, `Room ${code} created by ${myName}. Share the code to invite friends!`);
    setTab('room');
  };

  const joinRoom = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) { alert('Enter a valid room code (4+ characters)'); return; }
    setRoomCode(code);
    setSelectedGame(MP_GAMES[0]);
    setMessages([]);
    lastTs.current = 0;
    await postSystemMsg(code, `${myName} joined the room!`);
    setTab('room');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || sending) return;
    setSending(true);
    try {
      await fetch(`${API_URL}/api/chat/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: myName, text: inputMsg.trim() }),
      });
      setInputMsg('');
      await pollMessages(); // fetch immediately after sending
    } catch {}
    setSending(false);
  };

  const leaveRoom = async () => {
    await postSystemMsg(roomCode, `${myName} left the room.`);
    clearInterval(pollRef.current);
    setTab('lobby');
    setRoomCode('');
    setSelectedGame(null);
    setShowGame(false);
    setMessages([]);
    lastTs.current = 0;
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2500); });
  };

  const shareRoom = () => {
    const text = `🎮 Join my ${selectedGame?.title || 'gaming'} room on GameSpark!\nRoom code: ${roomCode}\nPlay here: ${SITE_CONFIG.url}/multiplayer\n#GameSpark`;
    if (navigator.share) navigator.share({ title: 'Join my game room!', text, url: SITE_CONFIG.url + '/multiplayer' });
    else navigator.clipboard.writeText(text).then(() => alert('Room invite copied!'));
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
  const card = { background:'#fff', borderRadius:14, boxShadow:'0 2px 12px #0000000a' };
  const btnP = (pr) => ({ padding:'10px 22px', borderRadius:99, fontSize:13, fontWeight:800, cursor:'pointer', border: pr ? 'none' : `2px solid ${SITE_CONFIG.primaryColor}`, background: pr ? `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)` : 'transparent', color: pr ? '#fff' : SITE_CONFIG.primaryColor, fontFamily:'Nunito,sans-serif', whiteSpace:'nowrap' });

  return (
    <>
      <Helmet>
        <title>Multiplayer Games — Play With Friends | {SITE_CONFIG.name}</title>
        <meta name="description" content={`Play multiplayer games with friends on ${SITE_CONFIG.name}. Create a room, share the code, chat live and play together!`}/>
      </Helmet>

      <div style={{ padding:'16px', maxWidth:1000, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:18, fontWeight:900, marginBottom:4, display:'flex', alignItems:'center', gap:10 }}>
            👥 Multiplayer Lobby
            <span style={{ background:'#ecfdf5', color:'#166534', fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:99, border:'1px solid #86efac' }}>🟢 Live</span>
          </div>
          <p style={{ color:'#6b7280', fontSize:13 }}>Create a room, share the code, chat in real-time, and play together!</p>
        </div>

        {/* LOBBY */}
        {tab === 'lobby' && (
          <>
            {/* Game cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16, marginBottom:20 }}>
              {MP_GAMES.map(game => (
                <div key={game.id} style={{ ...card, overflow:'hidden' }}>
                  <div style={{ background:game.bg, padding:'22px 20px', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:-20, right:-20, fontSize:80, opacity:0.12 }}>{game.icon}</div>
                    <div style={{ fontSize:34, marginBottom:8 }}>{game.icon}</div>
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:17, fontWeight:900, color:'#fff', marginBottom:3 }}>{game.title}</div>
                    <div style={{ fontSize:11, color:'#ffffff88' }}>🟢 {game.players}</div>
                    {game.mobile && <div style={{ marginTop:6, display:'inline-flex', alignItems:'center', gap:4, background:'#ffffff20', padding:'2px 8px', borderRadius:99, fontSize:10, color:'#fff', fontWeight:700 }}>📱 Mobile Friendly</div>}
                  </div>
                  <div style={{ padding:'16px 18px' }}>
                    <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.6, marginBottom:12 }}>{game.description}</p>
                    <div style={{ background:'#f9fafb', borderRadius:10, padding:'10px 12px', marginBottom:14 }}>
                      <div style={{ fontSize:11, fontWeight:800, color:'#374151', marginBottom:7 }}>🎮 Controls</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                        {game.tips.map(tip=><span key={tip} style={{ background:'#e5e7eb', color:'#374151', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:6 }}>{tip}</span>)}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <button style={btnP(true)} onClick={()=>createRoom(game)}>➕ Create Room</button>
                      <button style={btnP(false)} onClick={()=>{ setSelectedGame(game); setShowGame(true); setRoomCode(makeRoomCode()); setTab('room'); }}>▶ Play Solo</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Join room */}
            <div style={{ ...card, padding:'18px', marginBottom:18 }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:13, fontWeight:700, marginBottom:12 }}>🔑 Join a Room</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <input
                  style={{ flex:1, minWidth:140, padding:'10px 12px', borderRadius:10, border:'2px solid #e5e7eb', fontSize:15, fontFamily:'Nunito,sans-serif', outline:'none', letterSpacing:3, textTransform:'uppercase', fontWeight:800 }}
                  placeholder="Room code..."
                  value={joinCode}
                  onChange={e=>setJoinCode(e.target.value.toUpperCase())}
                  maxLength={8}
                  onFocus={e=>e.target.style.borderColor=SITE_CONFIG.primaryColor}
                  onBlur={e=>e.target.style.borderColor='#e5e7eb'}
                  onKeyDown={e=>e.key==='Enter'&&joinRoom()}
                />
                <button style={btnP(true)} onClick={joinRoom}>Join Room →</button>
              </div>
              {!user && <div style={{ marginTop:10, fontSize:12, color:'#9ca3af' }}>💡 <span style={{ cursor:'pointer', color:SITE_CONFIG.primaryColor, fontWeight:700 }} onClick={()=>nav('/login')}>Login</span> to use your username in the chat</div>}
            </div>

            {/* How it works */}
            <div style={{ ...card, padding:'18px' }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:13, fontWeight:700, marginBottom:12 }}>📋 How to Play Together</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:10 }}>
                {[['1️⃣','Create a room','Click "Create Room" for your favourite game'],['2️⃣','Share code','Send the 6-letter code to friends on WhatsApp'],['3️⃣','Chat live','Talk in real-time while everyone plays'],['4️⃣','Battle!','Open the game and compete with your friends']].map(([num,title,desc])=>(
                  <div key={title} style={{ background:'#f9fafb', borderRadius:10, padding:'12px', textAlign:'center' }}>
                    <div style={{ fontSize:22, marginBottom:6 }}>{num}</div>
                    <div style={{ fontSize:12, fontWeight:800, marginBottom:3 }}>{title}</div>
                    <div style={{ fontSize:11, color:'#6b7280' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ROOM TAB */}
        {tab === 'room' && (
          <div style={{ display:'grid', gridTemplateColumns: showGame ? '1fr 320px' : '1fr', gap:14 }}>

            {/* Game panel */}
            {showGame && selectedGame && (
              <div style={{ ...card, overflow:'hidden', display:'flex', flexDirection:'column', minHeight:500 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', borderBottom:'1px solid #f0f0f0' }}>
                  <span style={{ fontFamily:'Orbitron,monospace', fontSize:12, fontWeight:700 }}>{selectedGame.icon} {selectedGame.title}</span>
                  <button onClick={()=>setShowGame(false)} style={{ background:'#f3f4f6', border:'none', borderRadius:6, padding:'3px 9px', fontSize:11, cursor:'pointer', fontWeight:700 }}>Hide</button>
                </div>
                <div style={{ flex:1, minHeight:460, position:'relative' }}>
                  <iframe key={selectedGame.id} src={selectedGame.url} title={selectedGame.title}
                    style={{ width:'100%', height:'100%', minHeight:460, border:'none', position:'absolute', inset:0 }}
                    allow="fullscreen; autoplay; pointer-lock" allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock" />
                </div>
              </div>
            )}

            {/* Chat + Room panel */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

              {/* Room info */}
              <div style={{ ...card, padding:'14px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ fontFamily:'Orbitron,monospace', fontSize:12, fontWeight:700 }}>Room Details</div>
                  <button onClick={leaveRoom} style={{ background:'#fef2f2', border:'1px solid #fca5a5', color:'#dc2626', borderRadius:8, padding:'3px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>Leave</button>
                </div>

                {/* Room code */}
                <div style={{ background:'#f9fafb', borderRadius:10, padding:'10px 12px', marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:'#6b7280', marginBottom:4 }}>ROOM CODE — Share with friends</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:22, fontWeight:900, color:SITE_CONFIG.primaryColor, letterSpacing:3 }}>{roomCode}</div>
                    <button onClick={copyRoomCode} style={{ background:copied?'#ecfdf5':SITE_CONFIG.primaryColor, border:'none', color:copied?'#166534':'#fff', borderRadius:8, padding:'5px 10px', fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', flexShrink:0 }}>
                      {copied?'✅':'📋 Copy'}
                    </button>
                    <button onClick={shareRoom} style={{ background:'#25D366', border:'none', color:'#fff', borderRadius:8, padding:'5px 10px', fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', flexShrink:0 }}>
                      📱 Share
                    </button>
                  </div>
                </div>

                {/* Game buttons */}
                <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                  {!showGame && selectedGame && <button onClick={()=>setShowGame(true)} style={btnP(true)}>▶ Open {selectedGame?.title}</button>}
                  {MP_GAMES.filter(g=>g.id!==selectedGame?.id).map(g=>(
                    <button key={g.id} onClick={()=>{setSelectedGame(g);setShowGame(true);}} style={btnP(false)}>{g.icon} {g.title}</button>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div style={{ ...card, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'10px 12px', borderBottom:'1px solid #f0f0f0', fontFamily:'Orbitron,monospace', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                  💬 Live Chat
                  <span style={{ fontSize:10, fontWeight:600, color:'#9ca3af', fontFamily:'Nunito,sans-serif' }}>{messages.length} messages</span>
                  <span style={{ fontSize:9, color:'#22c55e', fontWeight:700, marginLeft:'auto' }}>● Real-time</span>
                </div>

                {/* Messages */}
                <div ref={chatRef} style={{ minHeight:240, maxHeight:320, overflowY:'auto', padding:'10px 10px', display:'flex', flexDirection:'column', gap:5 }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign:'center', color:'#9ca3af', fontSize:12, marginTop:20 }}>No messages yet. Say hi! 👋</div>
                  )}
                  {messages.map((msg,i) => (
                    <div key={i}>
                      {msg.system ? (
                        <div style={{ textAlign:'center', fontSize:10, color:'#9ca3af', padding:'3px 0', fontStyle:'italic' }}>{msg.text}</div>
                      ) : (
                        <div style={{ display:'flex', alignItems:'flex-start', gap:7 }}>
                          <div style={{ width:26, height:26, borderRadius:'50%', background:`linear-gradient(135deg,${SITE_CONFIG.primaryColor},${SITE_CONFIG.secondaryColor})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:800, flexShrink:0 }}>
                            {msg.user[0].toUpperCase()}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:2 }}>
                              <span style={{ fontSize:11, fontWeight:800, color:msg.user===myName?SITE_CONFIG.primaryColor:'#374151' }}>{msg.user}</span>
                              <span style={{ fontSize:9, color:'#9ca3af' }}>{new Date(msg.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                            </div>
                            <div style={{ fontSize:13, color:'#374151', background:msg.user===myName?`${SITE_CONFIG.primaryColor}12`:'#f3f4f6', padding:'6px 10px', borderRadius:'8px 8px 8px 2px', display:'inline-block', maxWidth:'100%', wordBreak:'break-word' }}>
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div style={{ borderTop:'1px solid #f0f0f0', padding:'8px 10px' }}>
                  <form onSubmit={sendMessage} style={{ display:'flex', gap:7 }}>
                    <input
                      style={{ flex:1, padding:'8px 10px', borderRadius:10, border:'2px solid #e5e7eb', fontSize:13, fontFamily:'Nunito,sans-serif', outline:'none' }}
                      placeholder={`Message as ${myName}...`}
                      value={inputMsg}
                      onChange={e=>setInputMsg(e.target.value)}
                      maxLength={200}
                      onFocus={e=>e.target.style.borderColor=SITE_CONFIG.primaryColor}
                      onBlur={e=>e.target.style.borderColor='#e5e7eb'}
                    />
                    <button type="submit" disabled={sending || !inputMsg.trim()}
                      style={{ background:sending||!inputMsg.trim()?'#d1d5db':`linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, border:'none', color:'#fff', borderRadius:10, padding:'0 14px', fontSize:16, cursor:sending||!inputMsg.trim()?'not-allowed':'pointer', flexShrink:0 }}>
                      ➤
                    </button>
                  </form>
                  <div style={{ fontSize:10, color:'#9ca3af', marginTop:5 }}>Messages sync across all devices every 2 seconds</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
