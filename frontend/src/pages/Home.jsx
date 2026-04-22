import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import GamePlayer from "../components/GamePlayer";
import AdZone from "../components/AdZone";
import { useAuth } from "../hooks/useAuth";
import SITE_CONFIG from "../siteConfig";

const API_URL = process.env.REACT_APP_API_URL || "https://gamespark-api.onrender.com";

const FAMOUS_GAMES = [
  { id:"krunker",    title:"Krunker.io",      category:"shooter",     rating:"4.9", badge:"HOT", icon:"🔫", bg:"linear-gradient(135deg,#1e1b4b,#312e81)", url:"https://krunker.io/" },
  { id:"slither",    title:"Slither.io",       category:"multiplayer", rating:"4.8", badge:"HOT", icon:"🐍", bg:"linear-gradient(135deg,#15803d,#166534)", url:"https://slither.io/" },
  { id:"agar",       title:"Agar.io",          category:"multiplayer", rating:"4.7", badge:"HOT", icon:"🔵", bg:"linear-gradient(135deg,#0891b2,#0e7490)", url:"https://agar.io/" },
  { id:"shell",      title:"Shell Shockers",   category:"shooter",     rating:"4.8", badge:"HOT", icon:"🥚", bg:"linear-gradient(135deg,#d97706,#b45309)", url:"https://shellshock.io/" },
  { id:"smashkarts", title:"Smash Karts",      category:"racing",      rating:"4.9", badge:"HOT", icon:"🏎️", bg:"linear-gradient(135deg,#7c3aed,#5b21b6)", url:"https://smashkarts.io/" },
  { id:"1v1lol",     title:"1v1.LOL",          category:"shooter",     rating:"4.7", badge:"HOT", icon:"🏗️", bg:"linear-gradient(135deg,#374151,#1f2937)", url:"https://1v1.lol/" },
  { id:"diep",       title:"Diep.io",          category:"shooter",     rating:"4.6", badge:"HOT", icon:"💥", bg:"linear-gradient(135deg,#dc2626,#b91c1c)", url:"https://diep.io/" },
  { id:"paper",      title:"Paper.io 2",       category:"multiplayer", rating:"4.5", badge:"HOT", icon:"📄", bg:"linear-gradient(135deg,#0f766e,#0d9488)", url:"https://paper-io.com/" },
  { id:"2048g",      title:"2048",             category:"puzzle",      rating:"4.8", badge:"TOP", icon:"🔢", bg:"linear-gradient(135deg,#d97706,#b45309)", url:"https://play2048.co/" },
  { id:"snakeg",     title:"Snake Classic",    category:"arcade",      rating:"4.7", badge:"TOP", icon:"🐍", bg:"linear-gradient(135deg,#15803d,#166534)", url:"https://playsnake.org/" },
  { id:"chess",      title:"Chess",            category:"strategy",    rating:"4.9", badge:"TOP", icon:"♟️", bg:"linear-gradient(135deg,#374151,#1f2937)", url:"https://www.chess.com/play/computer" },
  { id:"wordle",     title:"Wordle",           category:"casual",      rating:"4.9", badge:"HOT", icon:"🔤", bg:"linear-gradient(135deg,#15803d,#166534)", url:"https://wordleunlimited.org/" },
  { id:"dino",       title:"Dino Run",         category:"arcade",      rating:"4.5", badge:"NEW", icon:"🦕", bg:"linear-gradient(135deg,#78350f,#92400e)", url:"https://chromedino.com/" },
  { id:"tetris",     title:"Tetris",           category:"puzzle",      rating:"4.9", badge:"TOP", icon:"🟦", bg:"linear-gradient(135deg,#1d4ed8,#1e40af)", url:"https://tetr.io/" },
  { id:"flappy",     title:"Flappy Bird",      category:"arcade",      rating:"4.5", badge:"HOT", icon:"🐦", bg:"linear-gradient(135deg,#15803d,#166534)", url:"https://flappybird.io/" },
  { id:"pacman",     title:"Pac-Man",          category:"arcade",      rating:"4.8", badge:"TOP", icon:"👾", bg:"linear-gradient(135deg,#1e1b4b,#312e81)", url:"https://freepacman.org/" },
  { id:"solitaire",  title:"Solitaire",        category:"casual",      rating:"4.7", badge:"TOP", icon:"🃏", bg:"linear-gradient(135deg,#065f46,#064e3b)", url:"https://www.solitr.com/klondike-solitaire" },
  { id:"sudoku",     title:"Sudoku",           category:"puzzle",      rating:"4.8", badge:"",    icon:"🔢", bg:"linear-gradient(135deg,#1d4ed8,#1e40af)", url:"https://sudoku.com/" },
  { id:"mahjong",    title:"Mahjong",          category:"puzzle",      rating:"4.6", badge:"",    icon:"🀄", bg:"linear-gradient(135deg,#b45309,#92400e)", url:"https://www.mahjong.co/" },
  { id:"memory",     title:"Memory Match",     category:"puzzle",      rating:"4.4", badge:"NEW", icon:"🧠", bg:"linear-gradient(135deg,#7c3aed,#5b21b6)", url:"https://www.helpfulgames.com/subjects/brain-training/memory.html" },
];

const CATEGORIES = ["All","Action","Puzzle","Racing","Sports","Adventure","Arcade","Strategy","Shooter","Casual","Multiplayer"];
const CAT_MAP = {
  action:["action","fight","battle","war","combat"],
  puzzle:["puzzle","brain","logic","match","word","quiz"],
  racing:["racing","race","car","drive","speed","kart"],
  sports:["sport","football","soccer","basketball","tennis","golf"],
  adventure:["adventure","rpg","quest","explore"],
  arcade:["arcade","classic","retro","platform","runner","dino","snake","pacman","flappy"],
  strategy:["strategy","chess","board","tower","defense"],
  shooter:["shooter","shoot","gun","sniper","krunker","1v1","diep","shell"],
  casual:["casual","idle","clicker","relax","solitaire","wordle","sudoku","mahjong","memory"],
  multiplayer:["multiplayer","io","online","pvp","slither","agar","paper","smash"],
};
const rndBadge=()=>{const r=Math.random();return r>.85?"HOT":r>.75?"NEW":r>.68?"TOP":"";};

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 12px #0000000a' }}>
      <div style={{ width:'100%', height:120, background:'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }}/>
      <div style={{ padding:'9px 11px' }}>
        <div style={{ height:12, background:'#f0f0f0', borderRadius:6, marginBottom:8, animation:'shimmer 1.5s infinite' }}/>
        <div style={{ height:10, background:'#f0f0f0', borderRadius:6, width:'60%', animation:'shimmer 1.5s infinite' }}/>
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

export default function Home() {
  const [apiGames, setApiGames]       = useState([]);
  const [allGames, setAllGames]       = useState(FAMOUS_GAMES);
  const [filtered, setFiltered]       = useState(FAMOUS_GAMES);
  const [activeGame, setActiveGame]   = useState(null);
  const [activeCat, setActiveCat]     = useState("All");
  const [apiLoading, setApiLoading]   = useState(true); // loading state for GamePix games
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const seenIds = useRef(new Set(FAMOUS_GAMES.map(g => g.id)));

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchQ  = new URLSearchParams(location.search).get("search") || "";

  const mapGame = g => ({ id:String(g.id), title:g.title||"Game", category:(g.category||"arcade").toLowerCase(), thumbnail:g.thumbnail||"", url:g.url||"", rating:(Math.random()*1.5+3.5).toFixed(1), badge:rndBadge() });

  const fetchPage = async (n) => {
    const ctrl=new AbortController(), timer=setTimeout(()=>ctrl.abort(),25000);
    try {
      const res=await fetch(`${API_URL}/api/games?page=${n}&limit=96`,{signal:ctrl.signal});
      clearTimeout(timer);
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch(e){clearTimeout(timer);throw e;}
  };

  useEffect(()=>{
    const init=async()=>{
      try {
        const data=await fetchPage(1);
        const items=(data.items||[]).filter(g=>g.url&&!seenIds.current.has(String(g.id)));
        items.forEach(g=>seenIds.current.add(String(g.id)));
        const mapped=items.map(mapGame);
        if(mapped.length>0){
          setApiGames(mapped);
          setAllGames([...FAMOUS_GAMES,...mapped]);
          setTotalPages(data.totalPages>1?data.totalPages:(mapped.length>=90?10:1));
        }
      } catch(e){ /* silent — famous games still show */ }
      finally { setApiLoading(false); }
    };
    init();
  },[]);

  const handleLoadMore=async()=>{
    if(loadingMore) return;
    const next=currentPage+1;
    try{
      setLoadingMore(true);
      const data=await fetchPage(next);
      const items=(data.items||[]).filter(g=>g.url&&!seenIds.current.has(String(g.id)));
      items.forEach(g=>seenIds.current.add(String(g.id)));
      const mapped=items.map(mapGame);
      if(mapped.length>0){const newApi=[...apiGames,...mapped];setApiGames(newApi);setAllGames([...FAMOUS_GAMES,...newApi]);setCurrentPage(next);const tp=data.totalPages||totalPages;setTotalPages(tp>next?tp:(mapped.length>=90?next+3:next));}
      else{setTotalPages(currentPage);}
    }catch(e){}finally{setLoadingMore(false);}
  };

  useEffect(()=>{
    let base=allGames;
    if(activeCat!=="All"){const kws=CAT_MAP[activeCat.toLowerCase()]||[activeCat.toLowerCase()];base=base.filter(g=>{const gc=(g.category||"").toLowerCase(),t=(g.title||"").toLowerCase(),id=(g.id||"").toLowerCase();return kws.some(k=>gc.includes(k)||t.includes(k)||id.includes(k));});}
    if(searchQ?.trim()){const q=searchQ.toLowerCase().trim();base=base.filter(g=>g.title.toLowerCase().includes(q)||(g.category||"").toLowerCase().includes(q));}
    setFiltered(base);
  },[activeCat,searchQ,allGames]);

  useEffect(()=>{if(searchQ)setActiveCat("All");},[searchQ]);

  const showLoadMore=!apiLoading&&currentPage<totalPages&&activeCat==="All"&&!searchQ;

  const p={padding:"14px 14px 60px"};
  const hero={background:"linear-gradient(135deg,#0d0d1a,#1a1a2e)",borderRadius:14,padding:"22px 20px",marginBottom:14,position:"relative",overflow:"hidden"};
  const grid={display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:10,marginBottom:18};
  const catRow={display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:14,scrollbarWidth:"none"};
  const chip=a=>({display:"inline-flex",alignItems:"center",padding:"5px 12px",borderRadius:99,fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap",border:`2px solid ${a?SITE_CONFIG.primaryColor:"transparent"}`,background:a?"#fff8f5":"#fff",color:a?SITE_CONFIG.primaryColor:"#1a1a2e",boxShadow:"0 2px 6px #00000008",transition:"all 0.15s"});
  const dot={width:7,height:7,borderRadius:"50%",background:SITE_CONFIG.primaryColor,boxShadow:`0 0 6px ${SITE_CONFIG.primaryColor}`,flexShrink:0};
  const secHdr={display:"flex",alignItems:"center",gap:8,marginBottom:10,fontFamily:"Orbitron,monospace",fontSize:13,fontWeight:700,color:"#1a1a2e",flexWrap:"wrap"};

  return (
    <>
      <Helmet>
        <title>{SITE_CONFIG.seoTitle}</title>
        <meta name="description" content={SITE_CONFIG.seoDescription}/>
        <meta name="keywords" content={SITE_CONFIG.seoKeywords}/>
        <link rel="canonical" href={SITE_CONFIG.url}/>
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"WebSite","name":SITE_CONFIG.name,"url":SITE_CONFIG.url,"description":SITE_CONFIG.seoDescription,"potentialAction":{"@type":"SearchAction","target":`${SITE_CONFIG.url}/?search={search_term_string}`,"query-input":"required name=search_term_string"}})}</script>
      </Helmet>

      <div style={p}>

        {/* ISSUE 3 FIX: Top AdSense banner restored */}
        <AdZone slot={process.env.REACT_APP_ADSENSE_SLOT_1} format="horizontal" style={{ marginBottom:14, minHeight:90 }}/>

        {/* Hero */}
        <div style={hero}>
          <div style={{position:"absolute",top:-30,right:-30,width:200,height:200,background:`radial-gradient(circle,${SITE_CONFIG.primaryColor}22,transparent 70%)`,pointerEvents:"none"}}/>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,background:`${SITE_CONFIG.primaryColor}18`,border:`1px solid ${SITE_CONFIG.primaryColor}`,color:SITE_CONFIG.primaryColor,fontSize:10,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",padding:"3px 10px",borderRadius:99,marginBottom:8}}>
            ⚡ {SITE_CONFIG.gamesCount} Games — 100% Free
          </div>
          <h1 style={{fontFamily:"Orbitron,monospace",fontSize:"clamp(16px,4vw,26px)",fontWeight:900,color:"#fff",lineHeight:1.2,marginBottom:7}}>
            {SITE_CONFIG.heroTitle}<br/><span style={{color:SITE_CONFIG.primaryColor}}>{SITE_CONFIG.heroTitleHighlight}</span>
          </h1>
          <p style={{color:"#ffffff77",fontSize:12,marginBottom:12}}>{SITE_CONFIG.heroSubtitle}</p>
          <div style={{display:"flex",gap:16}}>
            {SITE_CONFIG.heroStats.map(({num,label})=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontFamily:"Orbitron,monospace",fontSize:14,fontWeight:700,color:SITE_CONFIG.accentColor}}>{num}</div>
                <div style={{fontSize:10,color:"#ffffff55",fontWeight:600}}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily challenge */}
        {user&&(
          <div style={{background:`linear-gradient(135deg,${SITE_CONFIG.secondaryColor},#a855f7)`,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12,color:"#fff"}}>
            <div style={{fontSize:24,background:"#ffffff20",width:42,height:42,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🏆</div>
            <div style={{flex:1}}>
              <div style={{fontSize:9,fontWeight:800,letterSpacing:2,opacity:0.7,marginBottom:2}}>DAILY CHALLENGE</div>
              <div style={{fontFamily:"Orbitron,monospace",fontSize:12,fontWeight:700}}>Play 5 games today!</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"Orbitron,monospace",fontSize:16,fontWeight:700,color:"#ffd166"}}>{user.gamesPlayed||0}</div>
              <div style={{fontSize:9,opacity:0.7}}>played</div>
            </div>
          </div>
        )}

        {/* Category chips */}
        {!searchQ&&(
          <div style={catRow}>
            {CATEGORIES.map(cat=>(
              <button key={cat} style={chip(activeCat===cat)} onClick={()=>setActiveCat(cat)}>{cat==="All"?"🎮 All":cat}</button>
            ))}
          </div>
        )}

        {/* Search banner */}
        {searchQ&&(
          <div style={{marginBottom:12,padding:"8px 12px",background:"#fff",borderRadius:10,fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
            <span>🔍 "{searchQ}" — {filtered.length} result{filtered.length!==1?"s":""}</span>
            <button onClick={()=>navigate("/")} style={{background:"#f3f4f6",border:"none",borderRadius:8,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:700,color:"#6b7280",fontFamily:"Nunito,sans-serif"}}>✕ Clear</button>
          </div>
        )}

        {/* Famous games */}
        {activeCat==="All"&&!searchQ&&(
          <>
            <div style={secHdr}><div style={dot}/>⭐ Famous Browser Games</div>
            <div style={grid}>
              {FAMOUS_GAMES.map(game=><GameCard key={game.id} game={game} onClick={setActiveGame}/>)}
            </div>
            {/* ISSUE 3 FIX: Mid AdSense restored */}
            <AdZone slot={process.env.REACT_APP_ADSENSE_SLOT_2} format="rectangle" style={{ marginBottom:16, minHeight:250 }}/>
          </>
        )}

        {/* GamePix / all games section header */}
        <div style={secHdr}>
          <div style={dot}/>
          {searchQ?"Search Results":activeCat==="All"?"🔥 All Games":`${activeCat} Games`}
          <span style={{fontSize:11,fontWeight:600,color:"#6b7280"}}>({filtered.length})</span>
        </div>

        {/* ISSUE 2 FIX: Show skeleton cards while GamePix games are loading */}
        {apiLoading && activeCat==="All" && !searchQ ? (
          <>
            <div style={grid}>
              {/* Show skeleton for where GamePix games will appear */}
              {Array.from({length:12}).map((_,i)=><SkeletonCard key={i}/>)}
            </div>
          </>
        ) : filtered.length===0 ? (
          <div style={{textAlign:"center",padding:40,color:"#9ca3af"}}>
            <div style={{fontSize:32,marginBottom:10}}>🎮</div>
            <div style={{fontWeight:700}}>No games found.</div>
            {searchQ&&<button onClick={()=>navigate("/")} style={{marginTop:12,padding:"9px 22px",background:`linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`,color:"#fff",border:"none",borderRadius:99,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"Nunito,sans-serif"}}>← All Games</button>}
          </div>
        ) : (
          <div style={grid}>
            {(searchQ||activeCat!=="All"
              ? filtered
              : filtered.filter(g=>!FAMOUS_GAMES.find(f=>f.id===g.id))
            ).map(game=><GameCard key={game.id} game={game} onClick={setActiveGame}/>)}
          </div>
        )}

        {showLoadMore&&(
          <div style={{textAlign:"center",margin:"4px 0 20px"}}>
            <button onClick={handleLoadMore} disabled={loadingMore}
              style={{padding:"10px 32px",background:loadingMore?"#d1d5db":`linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`,color:"#fff",border:"none",borderRadius:99,cursor:loadingMore?"not-allowed":"pointer",fontSize:13,fontWeight:800,fontFamily:"Nunito,sans-serif"}}>
              {loadingMore?"Loading...":"🎮 Load More Games"}
            </button>
          </div>
        )}

        {/* ISSUE 3 FIX: Bottom AdSense restored */}
        <AdZone slot={process.env.REACT_APP_ADSENSE_SLOT_3} format="horizontal" style={{ marginBottom:16, minHeight:90 }}/>

        {/* SEO content */}
        <div style={{padding:"18px",background:"#fff",borderRadius:12,fontSize:13,color:"#6b7280",lineHeight:1.8}}>
          <h2 style={{fontFamily:"Orbitron,monospace",fontSize:13,color:"#1a1a2e",marginBottom:8}}>Free Online Games — No Download Needed</h2>
          <p>Play {SITE_CONFIG.gamesCount} free online games on {SITE_CONFIG.name}. Action, puzzle, racing, sports, arcade, strategy, shooter and multiplayer browser games — all completely free, no download required.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:10}}>
            {["free online games","browser games","no download games","html5 games","io games","multiplayer games","puzzle games free","action games online","krunker.io","slither.io","smash karts","snake game online","car racing browser"].map(kw=>(
              <span key={kw} style={{background:"#f3f4f6",padding:"2px 7px",borderRadius:99,fontSize:11,fontWeight:700}}>{kw}</span>
            ))}
          </div>
        </div>
      </div>

      {activeGame&&<GamePlayer game={activeGame} onClose={()=>setActiveGame(null)}/>}
    </>
  );
}
