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

  // Build the direct game challenge link
  // This creates a URL like: https://yoursite.com/play/krunker
  // When someone opens it they go directly to that game's iframe
  const challengeUrl = `${SITE_CONFIG.url}/play/${encodeURIComponent(game.id)}?title=${encodeURIComponent(game.title)}`;
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
    const el = document.getElementById("game-modal-container");
    try { if (!document.fullscreenElement) await el?.requestFullscreen(); else await document.exitFullscreen(); }
    catch { try { const f=iframeRef.current; if(f?.requestFullscreen) await f.requestFullscreen(); else if(f?.webkitRequestFullscreen) f.webkitRequestFullscreen(); } catch {} }
  };

  // Share the specific game challenge link
  const handleShare = async () => {
    setShowSharePanel(false);
    if (navigator.share) {
      try {
        await navigator.share({ title: `Challenge: ${game.title}`, text: challengeText, url: challengeUrl });
        return;
      } catch {}
    }
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(challengeText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {}
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(challengeText)}`, '_blank');
    setShowSharePanel(false);
  };

  const handleShareCopy = async () => {
    try { await navigator.clipboard.writeText(challengeUrl); setShareCopied(true); setTimeout(()=>setShareCopied(false),3000); }
    catch {}
    setShowSharePanel(false);
  };

  const handleWatchAd = () => { if (!rewardCooldown && user) setShowRewardAd(true); };
  const handleAdWatched = async () => {
    setShowRewardAd(false);
    try {
      const res = await axios.post(`${API}/api/games/reward-ad`, { xpAmount: 50 });
      if (res.data.success) { setXpPopup(`+${res.data.xpEarned} XP!`); setTimeout(()=>setXpPopup(null),3000); setRewardCooldown(true); setTimeout(()=>setRewardCooldown(false),5*60*1000); }
    } catch {}
  };

  const aBtn = (active, color) => ({ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:99, border:`2px solid ${color||(active?"#ff6b35":"#ffffff30")}`, background:active?"#ff6b3520":"transparent", color:color||(active?"#ff6b35":"#fff"), fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif", whiteSpace:"nowrap" });

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.94)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:6 }} onClick={e=>e.target===e.currentTarget&&handleClose()}>
      <div style={{ background:"#0d0d1a", borderRadius:12, width:"100%", maxWidth:1000, height:"calc(100dvh - 12px)", maxHeight:"calc(100dvh - 12px)", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }} id="game-modal-container">

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", borderBottom:"1px solid #ffffff10", flexShrink:0 }}>
          <div style={{ fontFamily:"Orbitron,monospace", fontSize:12, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"62%" }}>{game.title}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
            <span style={{ fontSize:10, color:"#ffffff44" }}>⭐ {game.rating}</span>
            <button onClick={handleClose} style={{ background:"#ffffff18", border:"none", color:"#fff", width:26, height:26, borderRadius:6, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
        </div>

        {/* XP popup */}
        {xpPopup && <div style={{ position:"absolute", top:50, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#ff6b35,#ff8c42)", color:"#fff", padding:"8px 18px", borderRadius:99, fontSize:14, fontWeight:800, zIndex:10, fontFamily:"Orbitron,monospace", pointerEvents:"none" }}>{xpPopup}</div>}

        {/* Performance warning */}
        {perfWarning && (
          <div style={{ background:"#1c1917", borderBottom:"1px solid #ff6b3530", padding:"8px 12px", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <span style={{ fontSize:14, flexShrink:0 }}>⚡</span>
            <div style={{ flex:1, fontSize:11, color:"#ffffff88" }}>Heavy game — may lag on phones. Best on desktop/PC.</div>
            <button onClick={()=>setPerfWarning(false)} style={{ background:"none", border:"none", color:"#ffffff44", fontSize:14, cursor:"pointer", flexShrink:0 }}>✕</button>
          </div>
        )}

        {/* Share panel */}
        {showSharePanel && (
          <div style={{ position:"absolute", bottom:50, right:10, background:"#1a1a2e", border:"1px solid #ffffff20", borderRadius:12, padding:"14px", zIndex:20, minWidth:200, boxShadow:"0 8px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily:"Orbitron,monospace", fontSize:11, fontWeight:700, color:"#fff", marginBottom:10 }}>🏆 Challenge a Friend!</div>
            <div style={{ fontSize:11, color:"#ffffff88", marginBottom:12 }}>Share your direct game link and challenge friends to beat you!</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={handleShareWhatsApp} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"#25D366", border:"none", borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>
                📱 Share on WhatsApp
              </button>
              <button onClick={handleShare} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"#ff6b35", border:"none", borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>
                🔗 Share Challenge Link
              </button>
              <button onClick={handleShareCopy} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"transparent", border:"1px solid #ffffff30", borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>
                📋 Copy Game Link
              </button>
            </div>
            <button onClick={()=>setShowSharePanel(false)} style={{ position:"absolute", top:8, right:8, background:"none", border:"none", color:"#ffffff55", fontSize:14, cursor:"pointer" }}>✕</button>
          </div>
        )}

        {/* Rewarded Ad */}
        {showRewardAd && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.95)", zIndex:9, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
            <div style={{ fontFamily:"Orbitron,monospace", fontSize:16, fontWeight:700, color:"#fff" }}>Watch Ad → Earn 50 XP</div>
            <div style={{ width:280, height:180, background:"#1a1a2e", border:"2px solid #ff6b35", borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
              <div style={{ fontSize:36 }}>📺</div>
              <div style={{ fontFamily:"Orbitron,monospace", fontSize:12, color:"#ff6b35" }}>Advertisement</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowRewardAd(false)} style={{ padding:"9px 18px", background:"transparent", border:"2px solid #ffffff30", color:"#ffffff77", borderRadius:99, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>Skip</button>
              <button onClick={handleAdWatched} style={{ padding:"9px 22px", background:"linear-gradient(135deg,#ff6b35,#ff8c42)", border:"none", color:"#fff", borderRadius:99, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"Nunito,sans-serif" }}>✅ Claim 50 XP</button>
            </div>
          </div>
        )}

        {/* Game iframe — nothing blocking it */}
        <div style={{ flex:1, position:"relative", background:"#000", minHeight:0, overflow:"hidden" }}>
          {loading && (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:"#fff", zIndex:2, background:"#0d0d1a" }}>
              <div style={{ width:44, height:44, border:"4px solid #ffffff15", borderTopColor:"#ff6b35", borderRadius:"50%", animation:"gspin 0.8s linear infinite" }}/>
              <div style={{ fontFamily:"Orbitron,monospace", fontSize:12, color:"#ffffff88" }}>Loading {game.title}...</div>
              <style>{`@keyframes gspin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          <iframe key={game.id} id="game-iframe" ref={iframeRef} src={game.url} title={game.title}
            style={{ width:"100%", height:"100%", border:"none", position:"absolute", top:0, left:0, display:loading?"none":"block" }}
            onLoad={()=>setLoading(false)} allow="fullscreen; autoplay; pointer-lock" allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-modals" />
        </div>

        {/* Footer */}
        <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderTop:"1px solid #ffffff10", flexShrink:0, flexWrap:"wrap" }}>
          <span style={{ fontSize:10, color:"#ffffff33", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>🎮 {game.title}</span>

          {/* Challenge / Share button — always visible, most prominent */}
          <button
            style={{ ...aBtn(showSharePanel, shareCopied ? "#06d6a0" : "#ffd166"), color: shareCopied ? "#06d6a0" : "#ffd166", fontWeight:800 }}
            onClick={() => setShowSharePanel(s => !s)}
            title="Challenge a friend!"
          >
            {shareCopied ? "✅ Copied!" : "🏆 Challenge"}
          </button>

          {user && <button style={aBtn(false, rewardCooldown?"#ffffff30":"#a78bfa")} onClick={handleWatchAd} disabled={rewardCooldown}>{rewardCooldown?"⏳":"📺 +50XP"}</button>}
          {user && <button style={aBtn(isFav)} onClick={()=>toggleFavourite(String(game.id))}>{isFav?"❤️":"🤍"}</button>}
          <button style={aBtn(isFullscreen)} onClick={handleFullscreen}>⛶</button>
        </div>
      </div>
    </div>
  );
}
