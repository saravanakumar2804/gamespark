import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import GameCard from "../components/GameCard";
import GamePlayer from "../components/GamePlayer";
import AdZone from "../components/AdZone";
import { useAuth } from "../hooks/useAuth";
import SITE_CONFIG from "../siteConfig";

const API_URL = process.env.REACT_APP_API_URL || "https://gamespark-api.onrender.com";

// ── Famous games — always shown even if backend is offline ────────────────────
const FAMOUS_GAMES = [
  { id: "krunker",    title: "Krunker.io",      category: "shooter",     rating: "4.9", badge: "HOT", icon: "🔫", bg: "linear-gradient(135deg,#1e1b4b,#312e81)", url: "https://krunker.io/" },
  { id: "slither",    title: "Slither.io",       category: "multiplayer", rating: "4.8", badge: "HOT", icon: "🐍", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://slither.io/" },
  { id: "agar",       title: "Agar.io",          category: "multiplayer", rating: "4.7", badge: "HOT", icon: "🔵", bg: "linear-gradient(135deg,#0891b2,#0e7490)", url: "https://agar.io/" },
  { id: "shell",      title: "Shell Shockers",   category: "shooter",     rating: "4.8", badge: "HOT", icon: "🥚", bg: "linear-gradient(135deg,#d97706,#b45309)", url: "https://shellshock.io/" },
  { id: "smashkarts", title: "Smash Karts",      category: "racing",      rating: "4.9", badge: "HOT", icon: "🏎️", bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", url: "https://smashkarts.io/" },
  { id: "1v1lol",     title: "1v1.LOL",          category: "shooter",     rating: "4.7", badge: "HOT", icon: "🏗️", bg: "linear-gradient(135deg,#374151,#1f2937)", url: "https://1v1.lol/" },
  { id: "diep",       title: "Diep.io",          category: "shooter",     rating: "4.6", badge: "HOT", icon: "💥", bg: "linear-gradient(135deg,#dc2626,#b91c1c)", url: "https://diep.io/" },
  { id: "paper",      title: "Paper.io 2",       category: "multiplayer", rating: "4.5", badge: "HOT", icon: "📄", bg: "linear-gradient(135deg,#0f766e,#0d9488)", url: "https://paper-io.com/" },
  { id: "2048g",      title: "2048",             category: "puzzle",      rating: "4.8", badge: "TOP", icon: "🔢", bg: "linear-gradient(135deg,#d97706,#b45309)", url: "https://play2048.co/" },
  { id: "snakeg",     title: "Snake Classic",    category: "arcade",      rating: "4.7", badge: "TOP", icon: "🐍", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://playsnake.org/" },
  { id: "chess",      title: "Chess",            category: "strategy",    rating: "4.9", badge: "TOP", icon: "♟️", bg: "linear-gradient(135deg,#374151,#1f2937)", url: "https://www.chess.com/play/computer" },
  { id: "wordle",     title: "Wordle",           category: "casual",      rating: "4.9", badge: "HOT", icon: "🔤", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://wordleunlimited.org/" },
  { id: "dino",       title: "Dino Run",         category: "arcade",      rating: "4.5", badge: "NEW", icon: "🦕", bg: "linear-gradient(135deg,#78350f,#92400e)", url: "https://chromedino.com/" },
  { id: "tetris",     title: "Tetris",           category: "puzzle",      rating: "4.9", badge: "TOP", icon: "🟦", bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", url: "https://tetr.io/" },
  { id: "flappy",     title: "Flappy Bird",      category: "arcade",      rating: "4.5", badge: "HOT", icon: "🐦", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://flappybird.io/" },
  { id: "pacman",     title: "Pac-Man",          category: "arcade",      rating: "4.8", badge: "TOP", icon: "👾", bg: "linear-gradient(135deg,#1e1b4b,#312e81)", url: "https://freepacman.org/" },
  { id: "solitaire",  title: "Solitaire",        category: "casual",      rating: "4.7", badge: "TOP", icon: "🃏", bg: "linear-gradient(135deg,#065f46,#064e3b)", url: "https://www.solitr.com/klondike-solitaire" },
  { id: "sudoku",     title: "Sudoku",           category: "puzzle",      rating: "4.8", badge: "",    icon: "🔢", bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", url: "https://sudoku.com/" },
  { id: "mahjong",    title: "Mahjong",          category: "puzzle",      rating: "4.6", badge: "",    icon: "🀄", bg: "linear-gradient(135deg,#b45309,#92400e)", url: "https://www.mahjong.co/" },
  { id: "memory",     title: "Memory Match",     category: "puzzle",      rating: "4.4", badge: "NEW", icon: "🧠", bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", url: "https://www.helpfulgames.com/subjects/brain-training/memory.html" },
];

const CATEGORIES = ["All","Action","Puzzle","Racing","Sports","Adventure","Arcade","Strategy","Shooter","Casual","Multiplayer"];

const CAT_MAP = {
  action:      ["action","fight","battle","war","combat"],
  puzzle:      ["puzzle","brain","logic","match","word","quiz"],
  racing:      ["racing","race","car","drive","speed","kart"],
  sports:      ["sport","football","soccer","basketball","tennis","golf"],
  adventure:   ["adventure","rpg","quest","explore","platform"],
  arcade:      ["arcade","classic","retro","platform","runner"],
  strategy:    ["strategy","chess","board","tower","defense"],
  shooter:     ["shooter","shoot","gun","sniper","battle","krunker","shell","1v1","diep"],
  casual:      ["casual","idle","clicker","relax","solitaire","wordle","sudoku","mahjong"],
  multiplayer: ["multiplayer","io","online","pvp","slither","agar","paper","smash"],
};

function badge() {
  const r = Math.random();
  return r > 0.85 ? "HOT" : r > 0.75 ? "NEW" : r > 0.68 ? "TOP" : "";
}

export default function Home() {
  const [apiGames, setApiGames]       = useState([]);
  const [allGames, setAllGames]       = useState(FAMOUS_GAMES);
  const [filtered, setFiltered]       = useState(FAMOUS_GAMES);
  const [activeGame, setActiveGame]   = useState(null);
  const [activeCat, setActiveCat]     = useState("All");
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [apiStatus, setApiStatus]     = useState('loading'); // 'loading' | 'ok' | 'offline'
  const seenIds = useRef(new Set(FAMOUS_GAMES.map(g => g.id)));

  const { user } = useAuth();
  const location = useLocation();
  const searchQ  = new URLSearchParams(location.search).get("search") || "";

  const mapGame = (g) => ({
    id: String(g.id), title: g.title || "Game",
    category: (g.category || "arcade").toLowerCase(),
    thumbnail: g.thumbnail || "", url: g.url || "",
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), badge: badge(),
  });

  // ── Fetch with timeout — so we don't wait forever if server is offline ───────
  const fetchWithTimeout = async (url, timeoutMs = 8000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  // ── Initial load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const data = await fetchWithTimeout(`${API_URL}/api/games?page=1&limit=96`);
        const items = (data.items || []).filter(g => g.url && !seenIds.current.has(String(g.id)));
        items.forEach(g => seenIds.current.add(String(g.id)));
        const mapped = items.map(mapGame);

        if (mapped.length > 0) {
          setApiGames(mapped);
          setAllGames([...FAMOUS_GAMES, ...mapped]);
          setTotalPages(data.totalPages > 1 ? data.totalPages : (mapped.length >= 90 ? 10 : 1));
          setCurrentPage(1);
          setApiStatus('ok');
        } else {
          // API responded but returned no games — still show famous games
          setApiStatus('ok');
        }
      } catch (err) {
        // API offline or CORS error — show famous games without crashing
        console.warn('[Home] API unavailable:', err.message);
        setApiStatus('offline');
        // Famous games still show — users can play
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // ── Load more ─────────────────────────────────────────────────────────────────
  const handleLoadMore = async () => {
    if (loadingMore || apiStatus === 'offline') return;
    const next = currentPage + 1;
    try {
      setLoadingMore(true);
      const data = await fetchWithTimeout(`${API_URL}/api/games?page=${next}&limit=96`);
      const items = (data.items || []).filter(g => g.url && !seenIds.current.has(String(g.id)));
      items.forEach(g => seenIds.current.add(String(g.id)));
      const mapped = items.map(mapGame);
      if (mapped.length > 0) {
        const newApi = [...apiGames, ...mapped];
        setApiGames(newApi);
        setAllGames([...FAMOUS_GAMES, ...newApi]);
        setCurrentPage(next);
        const tp = data.totalPages || totalPages;
        setTotalPages(tp > next ? tp : (mapped.length >= 90 ? next + 3 : next));
      } else {
        setTotalPages(currentPage);
      }
    } catch (err) {
      console.warn('[Home] Load more failed:', err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let base = allGames;
    if (activeCat !== "All") {
      const catKey  = activeCat.toLowerCase();
      const keywords = CAT_MAP[catKey] || [catKey];
      base = base.filter(g => {
        const gc    = (g.category || "").toLowerCase();
        const title = (g.title || "").toLowerCase();
        const id    = (g.id || "").toLowerCase();
        return keywords.some(kw => gc.includes(kw) || title.includes(kw) || id.includes(kw));
      });
    }
    if (searchQ) {
      base = base.filter(g =>
        g.title.toLowerCase().includes(searchQ.toLowerCase()) ||
        (g.category || "").toLowerCase().includes(searchQ.toLowerCase())
      );
    }
    setFiltered(base);
  }, [activeCat, searchQ, allGames]);

  const showLoadMore = !loading && apiStatus === 'ok' && currentPage < totalPages && activeCat === "All" && !searchQ;

  // ── Styles ────────────────────────────────────────────────────────────────────
  const p      = { padding: "14px 16px 60px" };
  const hero   = { background: "linear-gradient(135deg,#0d0d1a,#1a1a2e)", borderRadius: 14, padding: "24px 22px", marginBottom: 16, position: "relative", overflow: "hidden" };
  const grid   = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12, marginBottom: 20 };
  const catRow = { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 16, scrollbarWidth: "none" };
  const chip   = a => ({ display: "inline-flex", alignItems: "center", padding: "6px 13px", borderRadius: 99, fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", border: `2px solid ${a ? SITE_CONFIG.primaryColor : "transparent"}`, background: a ? "#fff8f5" : "#fff", color: a ? SITE_CONFIG.primaryColor : "#1a1a2e", boxShadow: "0 2px 6px #00000008", transition: "all 0.15s" });
  const dot    = { width: 7, height: 7, borderRadius: "50%", background: SITE_CONFIG.primaryColor, boxShadow: `0 0 6px ${SITE_CONFIG.primaryColor}`, flexShrink: 0 };
  const secHdr = { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontFamily: "Orbitron,monospace", fontSize: 13, fontWeight: 700, color: "#1a1a2e" };

  return (
    <>
      <Helmet>
        <title>{SITE_CONFIG.seoTitle}</title>
        <meta name="description" content={SITE_CONFIG.seoDescription} />
        <meta name="keywords" content={SITE_CONFIG.seoKeywords} />
        <meta property="og:title" content={SITE_CONFIG.seoTitle} />
        <meta property="og:description" content={SITE_CONFIG.seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_CONFIG.url} />
        <link rel="canonical" href={SITE_CONFIG.url} />
      </Helmet>

      <div style={p}>
        {/* AdSense — only render if real publisher ID is set */}
        {process.env.REACT_APP_ADSENSE_ID && !process.env.REACT_APP_ADSENSE_ID.includes('XXXX') && (
          <AdZone slot={process.env.REACT_APP_ADSENSE_SLOT_1 || ''} format="horizontal" style={{ height: 90, marginBottom: 14 }} />
        )}

        {/* Hero */}
        <div style={hero}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 220, height: 220, background: `radial-gradient(circle,${SITE_CONFIG.primaryColor}25,transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${SITE_CONFIG.primaryColor}18`, border: `1px solid ${SITE_CONFIG.primaryColor}`, color: SITE_CONFIG.primaryColor, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "3px 10px", borderRadius: 99, marginBottom: 8 }}>
            ⚡ {SITE_CONFIG.gamesCount} Games — 100% Free
          </div>
          <h1 style={{ fontFamily: "Orbitron,monospace", fontSize: "clamp(16px,4vw,28px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 8 }}>
            {SITE_CONFIG.heroTitle}<br />
            <span style={{ color: SITE_CONFIG.primaryColor }}>{SITE_CONFIG.heroTitleHighlight}</span>
          </h1>
          <p style={{ color: "#ffffff77", fontSize: 12, marginBottom: 14 }}>{SITE_CONFIG.heroSubtitle}</p>
          <div style={{ display: "flex", gap: 18 }}>
            {SITE_CONFIG.heroStats.map(({ num, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Orbitron,monospace", fontSize: 15, fontWeight: 700, color: SITE_CONFIG.accentColor }}>{num}</div>
                <div style={{ fontSize: 10, color: "#ffffff55", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily challenge */}
        {user && (
          <div style={{ background: `linear-gradient(135deg,${SITE_CONFIG.secondaryColor},#a855f7)`, borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, color: "#fff" }}>
            <div style={{ fontSize: 26, background: "#ffffff20", width: 46, height: 46, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🏆</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, opacity: 0.7, marginBottom: 2 }}>DAILY CHALLENGE</div>
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 13, fontWeight: 700 }}>Play 5 games today!</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 18, fontWeight: 700, color: "#ffd166" }}>{user.gamesPlayed || 0}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>played</div>
            </div>
          </div>
        )}

        {/* Category chips */}
        <div style={catRow}>
          {CATEGORIES.map(cat => (
            <button key={cat} style={chip(activeCat === cat)} onClick={() => setActiveCat(cat)}>
              {cat === "All" ? "🎮 All" : cat}
            </button>
          ))}
        </div>

        {searchQ && (
          <div style={{ marginBottom: 12, padding: "8px 12px", background: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
            🔍 "{searchQ}" — {filtered.length} results
          </div>
        )}

        {/* Famous games — always visible */}
        {activeCat === "All" && !searchQ && (
          <>
            <div style={secHdr}><div style={dot} />⭐ Famous Browser Games</div>
            <div style={grid}>
              {FAMOUS_GAMES.map(game => (
                <GameCard key={game.id} game={game} onClick={setActiveGame} />
              ))}
            </div>

            {/* AdSense mid */}
            {process.env.REACT_APP_ADSENSE_ID && !process.env.REACT_APP_ADSENSE_ID.includes('XXXX') && (
              <AdZone slot={process.env.REACT_APP_ADSENSE_SLOT_2 || ''} format="rectangle" style={{ height: 200, marginBottom: 20 }} />
            )}
          </>
        )}

        {/* GamePix games section */}
        <div style={secHdr}>
          <div style={dot} />
          {searchQ ? "Search Results" : activeCat === "All" ? "🔥 All Games" : `${activeCat} Games`}
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>({filtered.length})</span>
          {apiStatus === 'offline' && (
            <span style={{ fontSize: 10, color: "#ff6b35", fontWeight: 700, marginLeft: 4 }}>
              (API starting up...)
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🎮</div>
            Loading games...
          </div>
        ) : (
          <div style={grid}>
            {(activeCat === "All" && !searchQ
              ? filtered.filter(g => !FAMOUS_GAMES.find(f => f.id === g.id))
              : filtered
            ).map(game => (
              <GameCard key={game.id} game={game} onClick={setActiveGame} />
            ))}
          </div>
        )}

        {/* Load more */}
        {showLoadMore && (
          <div style={{ textAlign: "center", margin: "4px 0 24px" }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              style={{ padding: "11px 36px", background: loadingMore ? "#d1d5db" : `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: "#fff", border: "none", borderRadius: 99, cursor: loadingMore ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 800, fontFamily: "Nunito,sans-serif" }}
            >
              {loadingMore ? "Loading..." : "🎮 Load More Games"}
            </button>
          </div>
        )}

        {/* AdSense bottom */}
        {process.env.REACT_APP_ADSENSE_ID && !process.env.REACT_APP_ADSENSE_ID.includes('XXXX') && (
          <AdZone slot={process.env.REACT_APP_ADSENSE_SLOT_3 || ''} format="horizontal" style={{ height: 90, marginBottom: 20 }} />
        )}

        {/* SEO */}
        <div style={{ padding: "20px", background: "#fff", borderRadius: 12, fontSize: 13, color: "#6b7280", lineHeight: 1.8, marginTop: 16 }}>
          <h2 style={{ fontFamily: "Orbitron,monospace", fontSize: 14, color: "#1a1a2e", marginBottom: 8 }}>Free Online Games — No Download</h2>
          <p>Play {SITE_CONFIG.gamesCount} free online games on {SITE_CONFIG.name}. Action, puzzle, racing, sports, adventure, arcade, strategy, shooter and multiplayer browser games — all free, no download, no sign-up needed.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
            {["free online games","browser games","no download games","html5 games","io games","multiplayer games","puzzle games","action games","krunker.io","slither.io","smash karts","shell shockers"].map(kw => (
              <span key={kw} style={{ background: "#f3f4f6", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{kw}</span>
            ))}
          </div>
        </div>
      </div>

      {activeGame && <GamePlayer game={activeGame} onClose={() => setActiveGame(null)} />}
    </>
  );
}
