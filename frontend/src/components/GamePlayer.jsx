import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import SITE_CONFIG from "../siteConfig";

const MOBILE_FRIENDLY = ['snake','slither','agar','wordle','2048','sudoku','solitaire','mahjong','memory','flappy','dino','paper','krunker','shell','smashkarts','1v1','tetris','pacman','chess','diep'];
const isMobileFriendly = (id) => MOBILE_FRIENDLY.some(k => (id||'').toLowerCase().includes(k));
const isMobileDevice   = () => window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function GamePlayer({ game, onClose }) {
  const { user, toggleFavourite, API } = useAuth();
  const [loading, setLoading]           = useState(true);
  const [sessionId, setSessionId]       = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [rewardCooldown, setRewardCooldown] = useState(false);
  const [xpPopup, setXpPopup]           = useState(null);
  const [perfWarning, setPerfWarning]   = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [shareCopied, setShareCopied]   = useState(false);
  const iframeRef = useRef(null);
  const isFav = user?.favourites?.includes(String(game.id));

  // Build challenge link — encode the game URL so DirectPlay can open it directly
  const challengeUrl = `${SITE_CONFIG.url}/play/${encodeURIComponent(game.id)}?title=${encodeURIComponent(game.title)}&url=${encodeURIComponent(game.url || '')}`;
  const challengeText = `🎮 I challenge you to beat me in ${game.title}!\nPlay here → ${challengeUrl}\n#GameSpark #Challenge`;

  useEffect(() => {
    const mobile = isMobileDevice();
    if (mobile && !isMobileFriendly(game.id)) setPerfWarning(true);
    if (user) {
      axios.post(`${API}/api/games/start`, { gameId: game.id, gameTitle: game.title, gameCategory: game.category })
        .then(r => setSessionId(r.data.sessionId)).catch(() => {});
    }
    document.body.style.overflow = "hidden";
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => { document.body.style.overflow = ""; document.removeEventListener("fullscreenchange", onFsChange); };
  }, [game.id]);

  const handleClose = async () => {
    if (sessionId && user) { try { await axios.post(`${API}/api/games/end`, { sessionId }); } catch {} }
    if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} }
    onClose();
  };

  const handleFullscreen = async () => {
    const el = document.getElementById("gp-modal");
    try { if (!document.fullscreenElement) await el?.requestFullscreen(); else await document.exitFullscreen(); }
    catch { try { const f=iframeRef.current; if(f?.requestFullscreen) await f.requestFullscreen(); else if(f?.webkitRequestFullscreen) f.webkitRequestFullscreen(); } catch {} }
  };

  const handleShareWhatsApp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(challengeText)}`, '_blank'); setShowSharePanel(false); };
  const handleShareCopy = async () => {
    try { await navigator.clipboard.writeText(challengeUrl); setShareCopied(true); setTimeout(()=>setShareCopied(false),3000); } catch {}
    setShowSharePanel(false);
  };
  const handleShare = async () => {
    setShowSharePanel(false);
    if (navigator.share) { try { await navigator.share({ title:`Challenge: ${game.title}`, text:challengeText, url:challengeUrl }); return; } catch {} }
    await handleShareCopy();
  };

  const handleWatchAd = () => { if (!rewardCooldown && user) setShowRewardAd(true); };
  const handleAdWatched = async () => {
    setShowRewardAd(false);
    try {
      const res = await axios.post(`${API}/api/games/reward-ad`, { xpAmount: 50 });
      if (res.data.success) { setXpPopup(`+${res.data.xpEarned} XP!`); setTimeout(()=>setXpPopup(null),3000); setRewardCooldown(true); setTimeout(()=>setRewardCooldown(false),5*60*1000); }
    } catch {}
  };

  const aBtn = (active, color) => ({ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:99, border:`2px solid ${color||(active?"#ff6b35":"#ffffff30")}`, background:active?"#ff6b3520":"transparent", color:color||(active?"#ff6b35":"#fff"), fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif", whiteSpace:"nowrap", flexShrink:0 });

  // ISSUE 5 FIX:
  // The modal uses fixed viewport height. On mobile, if dvh isn't supported,
  // the iframe area collapses. We compute explicit height using window.innerHeight
  // so the game always fills the available space regardless of browser support.
  const HEADER_H  = perfWarning ? 84 : 44; // header + optional warning
  const FOOTER_H  = 44;
  const frameH    = `calc(100dvh - 12px - ${HEADER_H}px - ${FOOTER_H}px)`;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.94)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:6 }} onClick={e=>e.target===e.currentTarget&&handleClose()}>
      <div id="gp-modal" style={{ background:"#0d0d1a", borderRadius:12, width:"100%", maxWidth:1000, height:"calc(100dvh - 12px)", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>

        {/* Header */}
        <div style={{ height:44, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 12px", borderBottom:"1px solid #ffffff10", flexShrink:0 }}>
          <div style={{ fontFamily:"Orbitron,monospace", fontSize:12, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, marginRight:8 }}>{game.title}</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            <span style={{ fontSize:10, color:"#ffffff44" }}>⭐ {game.rating}</span>
            <button onClick={handleClose} style={{ background:"#ffffff18", border:"none", color:"#fff", width:28, height:28, borderRadius:6, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
          </div>
        </div>

        {/* Performance warning */}
        {perfWarning && (
          <div style={{ height:40, display:"flex", alignItems:"center", gap:8, padding:"0 12px", background:"#1c1917", borderBottom:"1px solid #ff6b3530", flexShrink:0 }}>
            <span style={{ fontSize:13, flexShrink:0 }}>⚡</span>
            <div style={{ flex:1, fontSize:11, color:"#ffffff88", overflow:"hidden" }}>Heavy game — may lag on phones. Best on desktop.</div>
            <button onClick={()=>setPerfWarning(false)} style={{ background:"none", border:"none", color:"#ffffff44", fontSize:14, cursor:"pointer", flexShrink:0 }}>✕</button>
          </div>
        )}

        {/* XP popup */}
        {xpPopup && <div style={{ position:"absolute", top:50, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#ff6b35,#ff8c42)", color:"#fff", padding:"8px 18px", borderRadius:99, fontSize:14, fontWeight:800, zIndex:20, fontFamily:"Orbitron,monospace", pointerEvents:"none" }}>{xpPopup}</div>}

        {/* Share panel */}
        {showSharePanel && (
          <div style={{ position:"absolute", bottom:50, right:10, background:"#1a1a2e", border:"1px solid #ffffff20", borderRadius:12, padding:"14px", zIndex:20, minWidth:210, boxShadow:"0 8px 30px rgba(0,0,0,0.6)" }}>
            <div style={{ fontFamily:"Orbitron,monospace", fontSize:11, fontWeight:700, color:"#fff", marginBottom:8 }}>🏆 Challenge a Friend!</div>
            <div style={{ fontSize:11, color:"#ffffff77", marginBottom:12, lineHeight:1.5 }}>Share this game link. Friends click it and go directly into this game!</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={handleShareWhatsApp} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background:"#25D366", border:"none", borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>📱 WhatsApp Challenge</button>
              <button onClick={handleShare} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background:"#ff6b35", border:"none", borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>🔗 Share Challenge Link</button>
              <button onClick={handleShareCopy} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background:"transparent", border:"1px solid #ffffff30", borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>📋 {shareCopied ? "✅ Copied!" : "Copy Game Link"}</button>
            </div>
            <button onClick={()=>setShowSharePanel(false)} style={{ position:"absolute", top:8, right:10, background:"none", border:"none", color:"#ffffff55", fontSize:14, cursor:"pointer" }}>✕</button>
          </div>
        )}

        {/* Rewarded Ad */}
        {showRewardAd && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.95)", zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
            <div style={{ fontFamily:"Orbitron,monospace", fontSize:16, fontWeight:700, color:"#fff" }}>Watch Ad → Earn 50 XP</div>
            <div style={{ width:280, height:180, background:"#1a1a2e", border:"2px solid #ff6b35", borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}><div style={{ fontSize:36 }}>📺</div><div style={{ fontFamily:"Orbitron,monospace", fontSize:12, color:"#ff6b35" }}>Advertisement</div></div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowRewardAd(false)} style={{ padding:"9px 18px", background:"transparent", border:"2px solid #ffffff30", color:"#ffffff77", borderRadius:99, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>Skip</button>
              <button onClick={handleAdWatched} style={{ padding:"9px 22px", background:"linear-gradient(135deg,#ff6b35,#ff8c42)", border:"none", color:"#fff", borderRadius:99, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>✅ Claim 50 XP</button>
            </div>
          </div>
        )}

        {/* GAME AREA — ISSUE 5 FIX
            Using explicit height instead of flex:1 + minHeight:0
            Because on some mobile browsers flex:1 inside a dvh container collapses
            We subtract header + footer heights explicitly
        */}
        <div style={{ height: frameH, position:"relative", background:"#000", overflow:"hidden", flexShrink:0 }}>
          {loading && (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, color:"#fff", zIndex:2, background:"#0d0d1a" }}>
              <div style={{ width:48, height:48, border:"4px solid #ffffff12", borderTopColor:"#ff6b35", borderRadius:"50%", animation:"gspin 0.8s linear infinite" }}/>
              <div style={{ fontFamily:"Orbitron,monospace", fontSize:13, color:"#ffffff88" }}>Loading {game.title}...</div>
              <div style={{ fontSize:11, color:"#ffffff44" }}>Tap Fullscreen for best experience on mobile</div>
              <style>{`@keyframes gspin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          <iframe
            key={game.id}
            id="game-iframe"
            ref={iframeRef}
            src={game.url}
            title={game.title}
            style={{ width:"100%", height:"100%", border:"none", display: loading ? "none" : "block" }}
            onLoad={() => setLoading(false)}
            allow="fullscreen; autoplay; pointer-lock"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals"
          />
        </div>

        {/* Footer */}
        <div style={{ height:44, display:"flex", alignItems:"center", gap:5, padding:"0 10px", borderTop:"1px solid #ffffff10", flexShrink:0, overflow:"hidden" }}>
          <span style={{ fontSize:10, color:"#ffffff33", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>🎮 {game.title}</span>
          <button style={{ ...aBtn(showSharePanel, shareCopied?"#06d6a0":"#ffd166"), color:shareCopied?"#06d6a0":"#ffd166" }} onClick={()=>setShowSharePanel(s=>!s)} title="Challenge a friend!">
            {shareCopied ? "✅ Copied!" : "🏆 Challenge"}
          </button>
          {user && <button style={aBtn(false, rewardCooldown?"#ffffff30":"#a78bfa")} onClick={handleWatchAd} disabled={rewardCooldown}>{rewardCooldown?"⏳":"📺+XP"}</button>}
          {user && <button style={aBtn(isFav)} onClick={()=>toggleFavourite(String(game.id))}>{isFav?"❤️":"🤍"}</button>}
          <button style={aBtn(isFullscreen)} onClick={handleFullscreen} title="Fullscreen">⛶</button>
        </div>
      </div>
    </div>
  );
}
