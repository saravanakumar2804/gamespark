import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import GameCard from "../components/GameCard";
import GamePlayer from "../components/GamePlayer";
import AdZone from "../components/AdZone";
import { useAuth } from "../hooks/useAuth";
import SITE_CONFIG from "../siteConfig";

const API_URL = process.env.REACT_APP_API_URL || "https://gamespark-api.onrender.com";

const FALLBACK_GAMES = [
  { id: "snake",    title: "Snake Classic",  category: "arcade",   rating: "4.7", badge: "HOT", icon: "🐍", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://playsnake.org/" },
  { id: "2048",     title: "2048",           category: "puzzle",   rating: "4.8", badge: "HOT", icon: "🔢", bg: "linear-gradient(135deg,#d97706,#b45309)", url: "https://play2048.co/" },
  { id: "dino",     title: "Dino Jump",      category: "casual",   rating: "4.3", badge: "NEW", icon: "🦕", bg: "linear-gradient(135deg,#78350f,#92400e)", url: "https://chromedino.com/" },
  { id: "solitaire",title: "Solitaire",      category: "casual",   rating: "4.7", badge: "TOP", icon: "🃏", bg: "linear-gradient(135deg,#065f46,#064e3b)", url: "https://www.solitr.com/klondike-solitaire" },
  { id: "sudoku",   title: "Sudoku",         category: "puzzle",   rating: "4.8", badge: "",    icon: "🔢", bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", url: "https://sudoku.com/" },
  { id: "wordle",   title: "Wordle",         category: "casual",   rating: "4.9", badge: "HOT", icon: "🔤", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://wordleunlimited.org/" },
  { id: "chess",    title: "Chess",          category: "strategy", rating: "4.9", badge: "TOP", icon: "♟️", bg: "linear-gradient(135deg,#374151,#1f2937)", url: "https://www.chess.com/play/computer" },
  { id: "mahjong",  title: "Mahjong",        category: "puzzle",   rating: "4.6", badge: "",    icon: "🀄", bg: "linear-gradient(135deg,#b45309,#92400e)", url: "https://www.mahjong.co/" },
  { id: "memory",   title: "Memory Match",   category: "puzzle",   rating: "4.4", badge: "NEW", icon: "🧠", bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", url: "https://www.helpfulgames.com/subjects/brain-training/memory.html" },
  { id: "flappy",   title: "Flappy Bird",    category: "arcade",   rating: "4.5", badge: "HOT", icon: "🐦", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://flappybird.io/" },
  { id: "pacman",   title: "Pac-Man",        category: "arcade",   rating: "4.8", badge: "HOT", icon: "👾", bg: "linear-gradient(135deg,#1e1b4b,#312e81)", url: "https://freepacman.org/" },
  { id: "tetris",   title: "Tetris",         category: "puzzle",   rating: "4.9", badge: "TOP", icon: "🟦", bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", url: "https://tetr.io/" },
];

const CATEGORIES = ["All","Action","Puzzle","Racing","Sports","Adventure","Arcade","Strategy","Shooter","Casual","Multiplayer"];

function badge() {
  const r = Math.random();
  return r > 0.85 ? "HOT" : r > 0.75 ? "NEW" : r > 0.68 ? "TOP" : "";
}

export default function Home() {
  const [allGames, setAllGames]         = useState(FALLBACK_GAMES);
  const [filtered, setFiltered]         = useState(FALLBACK_GAMES);
  const [activeGame, setActiveGame]     = useState(null);
  const [activeCat, setActiveCat]       = useState("All");
  const [loading, setLoading]           = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(99); // start high — gets corrected after first fetch
  const [totalGames, setTotalGames]     = useState("...");
  const [usingFallback, setUsingFallback] = useState(false);
  const seenIds = useRef(new Set(FALLBACK_GAMES.map(g => g.id)));

  const { user } = useAuth();
  const location = useLocation();
  const searchQ  = new URLSearchParams(location.search).get("search") || "";

  // ── Map API item to game object ───────────────────────────────────────
  const mapGame = (g) => ({
    id:        String(g.id),
    title:     g.title || "Game",
    category:  (g.category || "arcade").toLowerCase(),
    thumbnail: g.thumbnail || "",
    url:       g.url || "",
    rating:    (Math.random() * 1.5 + 3.5).toFixed(1),
    badge:     badge(),
  });

  // ── Fetch a page from backend ─────────────────────────────────────────
  const fetchPage = async (pageNum) => {
    const res = await fetch(`${API_URL}/api/games?page=${pageNum}&limit=48`);
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return await res.json();
  };

  // ── Initial load (page 1) ─────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const data = await fetchPage(1);

        console.log("API response:", data); // See in browser console

        const items = (data.items || []).filter(g => g.url && !seenIds.current.has(String(g.id)));
        items.forEach(g => seenIds.current.add(String(g.id)));
        const mapped = items.map(mapGame);

        // How many total pages does GamePix have?
        // If totalPages comes back as 1 but we got 48 items, assume there are more
        const tp = data.totalPages || data.total_pages || data.pages || 1;
        const tot = data.total || data.total_count || data.count || mapped.length;

        console.log(`GamePix: got ${mapped.length} items, total=${tot}, totalPages=${tp}`);

        if (mapped.length > 0) {
          setAllGames(mapped);
          setCurrentPage(1);
          // If GamePix says 1 page but sent 48 items, it probably has more
          // We set totalPages to at least 20 so user can keep loading
          setTotalPages(tp > 1 ? tp : (mapped.length >= 48 ? 20 : 1));
          setTotalGames(tot > mapped.length ? tot : (mapped.length >= 48 ? "1000+" : mapped.length));
          setUsingFallback(false);
        } else {
          // API returned nothing — keep fallback games
          setUsingFallback(true);
          setTotalPages(1);
          setTotalGames(FALLBACK_GAMES.length);
        }
      } catch (err) {
        console.error("Init load error:", err.message);
        setUsingFallback(true);
        setTotalPages(1);
        setTotalGames(FALLBACK_GAMES.length);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // ── Load More ─────────────────────────────────────────────────────────
  const handleLoadMore = async () => {
    if (loadingMore) return;
    const next = currentPage + 1;
    try {
      setLoadingMore(true);
      const data = await fetchPage(next);

      console.log(`Load more page ${next}:`, data);

      const items = (data.items || []).filter(g => g.url && !seenIds.current.has(String(g.id)));
      items.forEach(g => seenIds.current.add(String(g.id)));
      const mapped = items.map(mapGame);

      if (mapped.length > 0) {
        setAllGames(prev => [...prev, ...mapped]);
        setCurrentPage(next);
        // Update totalPages from fresh response
        const tp = data.totalPages || data.total_pages || data.pages || totalPages;
        setTotalPages(tp > next ? tp : (mapped.length >= 48 ? next + 5 : next));
      } else {
        // No more games from API
        setTotalPages(currentPage); // stop showing Load More
      }
    } catch (err) {
      console.error("Load more error:", err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────
  useEffect(() => {
    let list = allGames;
    if (activeCat !== "All")
      list = list.filter(g => g.category?.toLowerCase() === activeCat.toLowerCase());
    if (searchQ)
      list = list.filter(g =>
        g.title.toLowerCase().includes(searchQ.toLowerCase()) ||
        g.category?.toLowerCase().includes(searchQ.toLowerCase())
      );
    setFiltered(list);
  }, [activeCat, searchQ, allGames]);

  // Whether to show the Load More button
  const showLoadMore = !loading && !usingFallback && currentPage < totalPages && activeCat === "All" && !searchQ;
  const doneLoading  = !loading && !usingFallback && currentPage >= totalPages && allGames.length > 12 && activeCat === "All" && !searchQ;

  // ── Styles ────────────────────────────────────────────────────────────
  const p       = { padding: "24px 28px 60px" };
  const hero    = { background: "linear-gradient(135deg,#0d0d1a,#1a1a2e)", borderRadius: 20, padding: "36px 40px", marginBottom: 28, position: "relative", overflow: "hidden" };
  const tag     = { display: "inline-flex", alignItems: "center", gap: 6, background: `${SITE_CONFIG.primaryColor}20`, border: `1px solid ${SITE_CONFIG.primaryColor}`, color: SITE_CONFIG.primaryColor, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 99, marginBottom: 12 };
  const h1S     = { fontFamily: "Orbitron,monospace", fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 10 };
  const sub     = { color: "#ffffff77", fontSize: 14, fontWeight: 600, marginBottom: 20, maxWidth: 420 };
  const secHdr  = { display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontFamily: "Orbitron,monospace", fontSize: 15, fontWeight: 700, color: "var(--dark)" };
  const dot     = { width: 8, height: 8, borderRadius: "50%", background: SITE_CONFIG.primaryColor, boxShadow: `0 0 8px ${SITE_CONFIG.primaryColor}`, flexShrink: 0 };
  const grid    = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(165px,1fr))", gap: 16, marginBottom: 28 };
  const catRow  = { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24, scrollbarWidth: "none" };
  const chip    = a => ({ display: "inline-flex", alignItems: "center", padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", border: `2px solid ${a ? SITE_CONFIG.primaryColor : "transparent"}`, background: a ? "#fff8f5" : "#fff", color: a ? SITE_CONFIG.primaryColor : "var(--dark)", boxShadow: "0 2px 8px #0000000a", transition: "all 0.2s" });
  const loadBtn = (disabled) => ({ padding: "14px 48px", background: disabled ? "#d1d5db" : `linear-gradient(135deg,${SITE_CONFIG.primaryColor},#ff8c42)`, color: "#fff", border: "none", borderRadius: 99, cursor: disabled ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 800, fontFamily: "Nunito,sans-serif", boxShadow: disabled ? "none" : `0 6px 20px ${SITE_CONFIG.primaryColor}50`, transition: "all 0.2s" });

  return (
    <>
      <Helmet>
        <title>{SITE_CONFIG.seoTitle}</title>
        <meta name="description" content={SITE_CONFIG.seoDescription} />
        <meta name="keywords" content={SITE_CONFIG.seoKeywords} />
      </Helmet>

      <div style={p}>
        <AdZone slot="1234567890" format="horizontal" style={{ height: 90 }} />

        {/* Hero */}
        <div style={hero}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 300, height: 300, background: `radial-gradient(circle,${SITE_CONFIG.primaryColor}30,transparent 70%)`, pointerEvents: "none" }} />
          <div style={tag}>{SITE_CONFIG.heroTag}</div>
          <h1 style={h1S}>{SITE_CONFIG.heroTitle}<br /><span style={{ color: SITE_CONFIG.primaryColor }}>{SITE_CONFIG.heroTitleHighlight}</span></h1>
          <p style={sub}>{SITE_CONFIG.heroSubtitle}</p>
          <div style={{ display: "flex", gap: 24 }}>
            {SITE_CONFIG.heroStats.map(({ num, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Orbitron,monospace", fontSize: 18, fontWeight: 700, color: SITE_CONFIG.accentColor }}>{num}</div>
                <div style={{ fontSize: 11, color: "#ffffff55", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        {user && (
          <div style={{ background: `linear-gradient(135deg,${SITE_CONFIG.secondaryColor},#a855f7)`, borderRadius: 20, padding: "22px 28px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16, color: "#fff" }}>
            <div style={{ fontSize: 36, background: "#ffffff20", width: 60, height: 60, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🏆</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, opacity: 0.7, marginBottom: 4 }}>DAILY CHALLENGE</div>
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Play 5 games today!</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Complete to earn 500 XP and a special badge</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "Orbitron,monospace", fontSize: 22, fontWeight: 700, color: "#ffd166" }}>{user.gamesPlayed || 0}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>games played today</div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div style={catRow}>
          {CATEGORIES.map(cat => (
            <button key={cat} style={chip(activeCat === cat)} onClick={() => setActiveCat(cat)}>{cat}</button>
          ))}
        </div>

        {/* Search notice */}
        {searchQ && (
          <div style={{ marginBottom: 16, padding: "10px 16px", background: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
            🔍 Results for "{searchQ}" — {filtered.length} games found
          </div>
        )}

        {/* Section header */}
        <div style={secHdr}>
          <div style={dot} />
          {searchQ ? "Search Results" : activeCat === "All" ? "🔥 All Games" : `${activeCat} Games`}
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
            ({filtered.length} games shown)
          </span>
        </div>

        {/* Game grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--muted)", fontWeight: 700 }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🎮</div>
            Loading games...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--muted)", fontWeight: 700 }}>
            No games found.
          </div>
        ) : (
          <div style={grid}>
            {filtered.map(game => (
              <GameCard key={game.id} game={game} onClick={setActiveGame} />
            ))}
          </div>
        )}

        {/* ── LOAD MORE BUTTON ─────────────────────────────────────────── */}
        {showLoadMore && (
          <div style={{ textAlign: "center", margin: "4px 0 32px" }}>
            <button style={loadBtn(loadingMore)} onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore
                ? "⏳ Loading more games..."
                : `🎮 Load More Games`}
            </button>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10, fontWeight: 600 }}>
              {allGames.length} games loaded · Page {currentPage} of {totalPages === 99 ? "many" : totalPages}
            </div>
          </div>
        )}

        {/* All loaded message */}
        {doneLoading && (
          <div style={{ textAlign: "center", padding: "16px 0 28px", fontSize: 14, color: "var(--muted)", fontWeight: 700 }}>
            🎉 All {allGames.length} games loaded!
          </div>
        )}

        {/* Fallback notice */}
        {usingFallback && (
          <div style={{ textAlign: "center", padding: "12px 20px", background: "#fff8f5", borderRadius: 10, fontSize: 13, color: "#ff6b35", fontWeight: 700, marginBottom: 20 }}>
            Showing demo games. Add your GamePix SID to backend .env to unlock 1500+ games.
          </div>
        )}

        <AdZone slot="0987654321" format="rectangle" style={{ height: 250 }} />
        <AdZone slot="1122334455" format="horizontal" style={{ height: 90 }} />

        {/* SEO */}
        <div style={{ marginTop: 40, padding: "28px", background: "#fff", borderRadius: 16, fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
          <h2 style={{ fontFamily: "Orbitron,monospace", fontSize: 16, color: "var(--dark)", marginBottom: 12 }}>About {SITE_CONFIG.name}</h2>
          <p>{SITE_CONFIG.description} Play browser games including action, puzzle, racing, sports, adventure, arcade, strategy and casual games — free with no download required.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {SITE_CONFIG.seoKeywords.split(", ").map(kw => (
              <span key={kw} style={{ background: "#f3f4f6", padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{kw}</span>
            ))}
          </div>
        </div>
      </div>

      {activeGame && <GamePlayer game={activeGame} onClose={() => setActiveGame(null)} />}
    </>
  );
}
