import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import GamePlayer from '../components/GamePlayer';
import SITE_CONFIG from '../siteConfig';

// 60+ SEO pages — each targets a specific search keyword
export const SEO_PAGES = {
  // Snake games
  'play-snake-game-online-free': {
    title: 'Play Snake Game Online Free — No Download',
    description: 'Play the classic Snake game online free! No download needed. Guide your snake to eat dots and grow. Play now on any device.',
    h1: 'Snake Game Online — Play Free',
    keywords: 'play snake game online free, snake game browser, snake game no download',
    games: ['snakeg', 'slither'],
    content: 'The classic Snake game is one of the most beloved browser games of all time. Control your snake, eat the dots, and grow as long as possible without hitting the walls or yourself. Play instantly — no download, no sign-up required.',
  },
  // Car racing
  'car-racing-game-online-no-download': {
    title: 'Car Racing Games Online — No Download Free',
    description: 'Play free car racing games online instantly. No download required. Race against others in browser racing games.',
    h1: 'Car Racing Games Online Free',
    keywords: 'car racing game online no download, browser racing games free, car games online free',
    games: ['smashkarts'],
    content: 'Rev your engines and race to the finish! Our browser-based car racing games let you race instantly without any download. From kart racing to street racing — find your favourite and start competing.',
  },
  // Puzzle games
  'free-puzzle-games-browser': {
    title: 'Free Puzzle Games — Play in Browser No Download',
    description: 'Play free puzzle games in your browser. No download needed. Solve puzzles, train your brain with 2048, Sudoku, Mahjong and more.',
    h1: 'Free Puzzle Games Online',
    keywords: 'free puzzle games browser, puzzle games online free, brain puzzle games online',
    games: ['2048g', 'sudoku', 'mahjong', 'memory', 'tetris'],
    content: 'Challenge your brain with our collection of free puzzle games. From number puzzles like Sudoku and 2048 to tile matching games like Mahjong — all playable in your browser with no download.',
  },
  // Arcade games
  'arcade-games-online-free-play': {
    title: 'Arcade Games Online — Play Free No Download',
    description: 'Play classic arcade games online free! Pac-Man, Tetris, Flappy Bird, Snake and more. No download, instant play.',
    h1: 'Classic Arcade Games Online Free',
    keywords: 'arcade games online free play, classic arcade browser games, retro arcade games free',
    games: ['pacman', 'tetris', 'flappy', 'snakeg', 'dino'],
    content: 'Relive the golden age of arcade games! Play Pac-Man, Tetris, Flappy Bird and dozens more classic arcade games — all free and playable in your browser instantly.',
  },
  // Shooting games
  'shooting-games-online-no-download': {
    title: 'Shooting Games Online Free — No Download',
    description: 'Play free shooting games online instantly. No download needed. Krunker.io, Shell Shockers, 1v1.LOL and more FPS browser games.',
    h1: 'Shooting Games Online Free',
    keywords: 'shooting games online no download, free fps browser games, shooting games browser',
    games: ['krunker', 'shell', '1v1lol', 'diep'],
    content: 'Lock and load! Our browser shooting games let you jump into action immediately. From fast-paced FPS games to tank shooters — no download required, just open and play.',
  },
  // 2 player games
  '2-player-games-online-with-friends': {
    title: '2 Player Games Online — Play With Friends Free',
    description: 'Play 2 player games online with friends for free! Multiplayer browser games you can share and play together instantly.',
    h1: '2 Player Games Online With Friends',
    keywords: '2 player games online with friends, multiplayer browser games free, play with friends online',
    games: ['krunker', 'slither', 'agar', 'shell'],
    content: 'Challenge your friends in 2 player online games! Share a link and battle head-to-head in browser games. No download needed — just send the link and play together instantly.',
  },
  // Multiplayer browser games
  'multiplayer-browser-games-free': {
    title: 'Multiplayer Browser Games Free — Play Online',
    description: 'Play free multiplayer browser games. No download, no registration needed. Compete against real players worldwide.',
    h1: 'Multiplayer Browser Games — Play Free',
    keywords: 'multiplayer browser games free, online multiplayer games no download, free multiplayer games browser',
    games: ['slither', 'agar', 'paper', 'krunker', 'shell', 'smashkarts'],
    content: 'Compete against real players from around the world in our free multiplayer browser games. From snake battles to kart racing — jump in and play against live opponents instantly.',
  },
  // IO games
  'io-games-multiplayer-online-free': {
    title: '.io Games — Free Multiplayer Games Online',
    description: 'Play the best .io games online free. Slither.io, Agar.io, Diep.io, Paper.io and more multiplayer io games in browser.',
    h1: 'IO Games Online Free Multiplayer',
    keywords: 'io games multiplayer online free, slither io, agar io, best io games browser',
    games: ['slither', 'agar', 'diep', 'paper'],
    content: 'IO games are the ultimate free multiplayer browser experience. Start small, grow big, and dominate the leaderboard. Play Slither.io, Agar.io, Diep.io and dozens more .io games instantly.',
  },
  // Quick browser games
  'quick-games-to-play-in-browser': {
    title: 'Quick Games to Play in Browser — Instant Free',
    description: 'Quick browser games you can play in seconds. No download, no sign-up. Instant fun with hundreds of free games.',
    h1: 'Quick Games to Play in Browser',
    keywords: 'quick games to play in browser, instant browser games, fast online games free',
    games: ['flappy', 'dino', 'wordle', 'memory'],
    content: 'Need a quick game break? Our browser games load instantly — no download, no waiting. Jump in for 5 minutes or 5 hours. Perfect for quick fun between tasks.',
  },
  // Fun games
  'fun-games-to-play-online-free': {
    title: 'Fun Games to Play Online Free — 1500+ Games',
    description: 'Find the most fun games to play online free. 1500+ browser games including action, puzzle, racing, sports and more.',
    h1: 'Fun Games to Play Online Free',
    keywords: 'fun games to play online free, most fun online games, entertaining browser games',
    games: ['krunker', 'smashkarts', 'slither', 'wordle', '2048g', 'flappy'],
    content: 'Looking for something fun to play? We have over 1500 free online games covering every genre. From exciting multiplayer battles to relaxing puzzles — there is something fun for everyone.',
  },
  // Simple games
  'simple-games-to-play-online': {
    title: 'Simple Games to Play Online Free — Easy Browser Games',
    description: 'Simple easy games to play online free. No complicated rules. Click and play instantly in your browser.',
    h1: 'Simple Games to Play Online',
    keywords: 'simple games to play online, easy browser games, simple online games free',
    games: ['dino', 'flappy', 'memory', 'wordle', 'snakeg'],
    content: 'Sometimes simple is best! Our easy-to-learn browser games are perfect for all ages. One click to start, easy rules, instant fun. No tutorials needed.',
  },
  // Strategy games
  'strategy-games-online-free-play': {
    title: 'Strategy Games Online Free — Play in Browser',
    description: 'Play free strategy games online in your browser. Chess, tower defense and more strategy games with no download.',
    h1: 'Strategy Games Online Free',
    keywords: 'strategy games online free play, browser strategy games, free chess online',
    games: ['chess'],
    content: 'Put your tactical mind to the test with our free online strategy games. From classic Chess to tower defense — all playable in your browser with no download required.',
  },
  // Adventure games
  'adventure-games-browser-free': {
    title: 'Adventure Games Browser — Play Free Online',
    description: 'Play free adventure games in your browser. No download needed. Explore worlds and complete quests instantly.',
    h1: 'Adventure Games Online Free',
    keywords: 'adventure games browser free, online adventure games no download, free adventure browser games',
    games: ['slither', 'agar'],
    content: 'Embark on exciting adventures in our free browser adventure games. Explore virtual worlds, defeat enemies, and complete quests — all without any download.',
  },
  // Brain games
  'brain-puzzle-games-free-online': {
    title: 'Brain Puzzle Games Free Online — Train Your Mind',
    description: 'Play free brain training puzzle games online. Improve memory, logic and problem-solving with Sudoku, 2048, Mahjong and more.',
    h1: 'Brain Puzzle Games Free Online',
    keywords: 'brain puzzle games free online, mind training games browser, brain games online free',
    games: ['sudoku', '2048g', 'memory', 'chess', 'mahjong'],
    content: 'Keep your brain sharp with our free online brain puzzle games. Solve Sudoku, crack the 2048 puzzle, test your memory — all proven to improve cognitive function and keep your mind active.',
  },
  // Reaction games
  'reaction-games-online-free': {
    title: 'Reaction Games Online Free — Test Your Speed',
    description: 'Play free reaction time games online. Test and improve your reaction speed with fun browser games.',
    h1: 'Reaction Games Online Free',
    keywords: 'reaction games online free, reaction speed games browser, reflex games online',
    games: ['flappy', 'dino', 'krunker'],
    content: 'How fast are your reflexes? Test your reaction time with our free online reaction games. From dodging obstacles to quick-draw shooters — every millisecond counts.',
  },
  // Tap games
  'tap-games-online-browser': {
    title: 'Tap Games Online — Play Free in Browser',
    description: 'Play free tap and click games online in your browser. Easy tap-to-play games for mobile and desktop.',
    h1: 'Tap Games Online Free',
    keywords: 'tap games online browser, click games free, tap to play browser games',
    games: ['flappy', 'dino', 'memory'],
    content: 'Tap to play! Our simple tap and click browser games are perfect for mobile devices. One finger is all you need to enjoy these addictive free online games.',
  },
  // Kids games
  'kids-games-online-free-no-download': {
    title: 'Kids Games Online Free — Safe Browser Games',
    description: 'Safe and fun free kids games online. No download required. Family-friendly browser games for children of all ages.',
    h1: 'Kids Games Online Free',
    keywords: 'kids games online free no download, children browser games, safe online games for kids',
    games: ['memory', 'dino', 'flappy', 'snakeg', 'pacman', 'tetris'],
    content: 'Safe, fun and free games for kids! All our children\'s browser games are family-friendly and age-appropriate. Parents can relax knowing their kids are enjoying safe online entertainment.',
  },
  // Racing games
  'racing-games-no-download-browser': {
    title: 'Racing Games Free No Download — Play in Browser',
    description: 'Play free racing games in your browser without any download. Car racing, kart racing and more racing games online.',
    h1: 'Racing Games No Download',
    keywords: 'racing games no download browser, free car racing online, kart racing browser games',
    games: ['smashkarts'],
    content: 'Race to the finish without any downloads! Our browser racing games load instantly and let you compete in thrilling races against real players. From kart racing to street racing.',
  },
  // Offline browser games
  'offline-games-in-browser-free': {
    title: 'Offline Browser Games Free — Play Without Internet',
    description: 'Play browser games offline for free. Some games work without internet connection. Free offline-capable browser games.',
    h1: 'Offline Browser Games Free',
    keywords: 'offline games in browser free, play games without internet browser, offline browser games',
    games: ['dino', 'snakeg', 'sudoku', 'memory'],
    content: 'Games that work even without a stable connection! Our lightweight browser games load fast and some can be played with minimal internet. Perfect for commutes and areas with slow connections.',
  },
  // HTML5 games
  'best-free-html5-games-online': {
    title: 'Best Free HTML5 Games Online — No Flash Needed',
    description: 'Play the best free HTML5 games online. No Flash plugin required. Modern browser games that work on all devices.',
    h1: 'Best Free HTML5 Games Online',
    keywords: 'best free html5 games online, html5 browser games, no flash games online',
    games: ['krunker', 'slither', 'agar', '2048g', 'tetris', 'pacman'],
    content: 'HTML5 games work on every modern browser without any plugins or Flash. Our collection of the best free HTML5 games gives you instant entertainment on desktop, tablet, or mobile.',
  },
  // Word games
  'word-games-online-free': {
    title: 'Word Games Online Free — Play Wordle & More',
    description: 'Play free word games online. Wordle, word puzzles and more brain-training word games in your browser.',
    h1: 'Word Games Online Free',
    keywords: 'word games online free, wordle free online, word puzzle games browser',
    games: ['wordle'],
    content: 'Test your vocabulary and word skills with our free online word games. Guess the daily word in Wordle, solve word puzzles, and more — all in your browser with no download.',
  },
  // Unblocked games
  'unblocked-games-free-online': {
    title: 'Unblocked Games Free Online — Play Anywhere',
    description: 'Play free unblocked games online anywhere. Games that work at school or work without restrictions. 1500+ games.',
    h1: 'Unblocked Games Free Online',
    keywords: 'unblocked games free online, games to play at school, unblocked browser games',
    games: ['flappy', 'dino', 'snakeg', 'tetris', 'wordle', 'sudoku', 'memory'],
    content: 'Play games anywhere, anytime! Our browser games work without any special software and can be enjoyed anywhere. Perfect for quick gaming sessions at school, work, or home.',
  },
  // Mobile games
  'free-mobile-browser-games': {
    title: 'Free Mobile Browser Games — Play on Phone',
    description: 'Play free mobile browser games on your phone. No app download needed. Touch-friendly games for Android and iPhone.',
    h1: 'Free Mobile Browser Games',
    keywords: 'free mobile browser games, phone browser games, play games on mobile free',
    games: ['slither', 'agar', 'wordle', '2048g', 'dino', 'memory'],
    content: 'Play on your phone without downloading any app! Our mobile-optimized browser games work perfectly on Android and iPhone. Just open your browser and start playing.',
  },
  // Chess games
  'chess-online-free': {
    title: 'Play Chess Online Free — No Download',
    description: 'Play chess online free against computer or friends. No download needed. Free chess in your browser.',
    h1: 'Chess Online Free',
    keywords: 'chess online free, play chess browser, chess game no download',
    games: ['chess'],
    content: 'Challenge the computer or friends in free online chess. Our browser chess game requires no download and works on any device. Perfect for beginners and experienced players alike.',
  },
  // Solitaire
  'solitaire-free-online': {
    title: 'Solitaire Free Online — Play Klondike in Browser',
    description: 'Play free Solitaire online. Classic Klondike Solitaire in your browser. No download, no sign-up required.',
    h1: 'Solitaire Free Online',
    keywords: 'solitaire free online, klondike solitaire browser, play solitaire online',
    games: ['solitaire'],
    content: 'The classic Klondike Solitaire game free in your browser. Sort the cards to win — a timeless game perfect for relaxing. No download needed, play instantly.',
  },
  // Wordle
  'wordle-free-online': {
    title: 'Wordle Free Online — Play Daily Word Game',
    description: 'Play Wordle free online. Guess the hidden word in 6 tries. Daily word challenge in your browser.',
    h1: 'Wordle Free Online',
    keywords: 'wordle free online, play wordle browser, daily wordle game',
    games: ['wordle'],
    content: 'Guess the 5-letter word in 6 tries in this addictive daily word game. Wordle tests your vocabulary and deductive reasoning. Play free online — new puzzle every day!',
  },
  // Tetris
  'tetris-online-free': {
    title: 'Tetris Online Free — Play Classic Tetris Browser',
    description: 'Play Tetris online free in your browser. No download needed. Classic block-stacking game instant play.',
    h1: 'Tetris Online Free',
    keywords: 'tetris online free, play tetris browser, classic tetris game online',
    games: ['tetris'],
    content: 'The legendary block-stacking puzzle game, free in your browser! Stack the falling blocks, clear lines, and beat your high score. Tetris is the ultimate test of speed and spatial thinking.',
  },
  // Pac-Man
  'pacman-online-free': {
    title: 'Pac-Man Online Free — Play Classic Pac-Man',
    description: 'Play Pac-Man online free in your browser. No download required. Classic arcade game instant play.',
    h1: 'Pac-Man Online Free',
    keywords: 'pacman online free, play pac-man browser, classic pacman game',
    games: ['pacman'],
    content: 'Waka waka! The classic Pac-Man arcade game is free in your browser. Eat all the dots, avoid the ghosts, and chomp on power pellets for revenge. A timeless arcade classic.',
  },
  // Sports games
  'sports-games-online-free': {
    title: 'Sports Games Online Free — Play in Browser',
    description: 'Play free sports games online in your browser. Football, basketball, tennis and more sports games without download.',
    h1: 'Sports Games Online Free',
    keywords: 'sports games online free, browser sports games, free football games online',
    games: ['smashkarts'],
    content: 'Get your sports fix with our free online sports games! From football to racing — compete against friends or AI opponents in these fun browser sports games.',
  },
  // Online games for free
  'online-games-for-free': {
    title: 'Online Games for Free — 1500+ Browser Games',
    description: 'Play 1500+ online games for free. No download, no payment, no sign-up required. Best free online gaming site.',
    h1: 'Online Games for Free',
    keywords: 'online games for free, free online games no download, play games free online',
    games: ['krunker', 'slither', 'smashkarts', 'wordle', 'tetris', 'pacman'],
    content: 'Welcome to the best collection of free online games! With over 1500 games across every genre, you will never run out of things to play. All games are 100% free — no download, no payment, no catch.',
  },
  // Games to play when bored
  'games-to-play-when-bored-online': {
    title: 'Games to Play When Bored Online — Free Browser Games',
    description: 'Bored? Play free browser games online instantly! 1500+ games to cure boredom. No download needed.',
    h1: 'Games to Play When Bored Online',
    keywords: 'games to play when bored online, cure boredom games browser, random fun games online',
    games: ['dino', 'flappy', 'wordle', 'slither', 'krunker', '2048g'],
    content: 'Cure your boredom instantly with our free online browser games! From addictive .io games to relaxing puzzles — find your perfect time-killer. No download, no waiting, just instant fun.',
  },
  // Mahjong
  'mahjong-online-free': {
    title: 'Mahjong Online Free — Play Classic Mahjong',
    description: 'Play Mahjong online free in your browser. Classic tile matching game with no download required.',
    h1: 'Mahjong Online Free',
    keywords: 'mahjong online free, play mahjong browser, free mahjong game',
    games: ['mahjong'],
    content: 'Master the ancient tile-matching game of Mahjong! Match identical tiles to clear the board in this classic strategy puzzle game. Free to play in your browser — no download needed.',
  },
  // Sudoku
  'sudoku-online-free': {
    title: 'Sudoku Online Free — Play Daily Sudoku',
    description: 'Play Sudoku online free. Daily Sudoku puzzles in your browser. No download needed, multiple difficulty levels.',
    h1: 'Sudoku Online Free',
    keywords: 'sudoku online free, play sudoku browser, daily sudoku puzzle',
    games: ['sudoku'],
    content: 'Train your logical thinking with free online Sudoku! Fill the 9x9 grid so every row, column, and box contains 1-9. Multiple difficulty levels from beginner to expert — play daily Sudoku free.',
  },
};

// Fallback famous games for display
const FAMOUS_GAMES = {
  'krunker':    { id: "krunker",    title: "Krunker.io",    category: "shooter",     rating: "4.9", badge: "HOT", icon: "🔫", bg: "linear-gradient(135deg,#1e1b4b,#312e81)", url: "https://krunker.io/" },
  'slither':    { id: "slither",    title: "Slither.io",    category: "multiplayer", rating: "4.8", badge: "HOT", icon: "🐍", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://slither.io/" },
  'agar':       { id: "agar",       title: "Agar.io",       category: "multiplayer", rating: "4.7", badge: "HOT", icon: "🔵", bg: "linear-gradient(135deg,#0891b2,#0e7490)", url: "https://agar.io/" },
  'shell':      { id: "shell",      title: "Shell Shockers", category: "shooter",    rating: "4.8", badge: "HOT", icon: "🥚", bg: "linear-gradient(135deg,#d97706,#b45309)", url: "https://shellshock.io/" },
  'smashkarts': { id: "smashkarts", title: "Smash Karts",   category: "racing",      rating: "4.9", badge: "HOT", icon: "🏎️", bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", url: "https://smashkarts.io/" },
  '1v1lol':     { id: "1v1lol",     title: "1v1.LOL",       category: "shooter",     rating: "4.7", badge: "HOT", icon: "🏗️", bg: "linear-gradient(135deg,#374151,#1f2937)", url: "https://1v1.lol/" },
  'diep':       { id: "diep",       title: "Diep.io",       category: "shooter",     rating: "4.6", badge: "HOT", icon: "💥", bg: "linear-gradient(135deg,#dc2626,#b91c1c)", url: "https://diep.io/" },
  'paper':      { id: "paper",      title: "Paper.io 2",    category: "multiplayer", rating: "4.5", badge: "HOT", icon: "📄", bg: "linear-gradient(135deg,#0f766e,#0d9488)", url: "https://paper-io.com/" },
  '2048g':      { id: "2048g",      title: "2048",          category: "puzzle",      rating: "4.8", badge: "TOP", icon: "🔢", bg: "linear-gradient(135deg,#d97706,#b45309)", url: "https://play2048.co/" },
  'snakeg':     { id: "snakeg",     title: "Snake Classic", category: "arcade",      rating: "4.7", badge: "TOP", icon: "🐍", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://playsnake.org/" },
  'chess':      { id: "chess",      title: "Chess",         category: "strategy",    rating: "4.9", badge: "TOP", icon: "♟️", bg: "linear-gradient(135deg,#374151,#1f2937)", url: "https://www.chess.com/play/computer" },
  'wordle':     { id: "wordle",     title: "Wordle",        category: "casual",      rating: "4.9", badge: "HOT", icon: "🔤", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://wordleunlimited.org/" },
  'dino':       { id: "dino",       title: "Dino Run",      category: "arcade",      rating: "4.5", badge: "NEW", icon: "🦕", bg: "linear-gradient(135deg,#78350f,#92400e)", url: "https://chromedino.com/" },
  'tetris':     { id: "tetris",     title: "Tetris",        category: "puzzle",      rating: "4.9", badge: "TOP", icon: "🟦", bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", url: "https://tetr.io/" },
  'flappy':     { id: "flappy",     title: "Flappy Bird",   category: "arcade",      rating: "4.5", badge: "HOT", icon: "🐦", bg: "linear-gradient(135deg,#15803d,#166534)", url: "https://flappybird.io/" },
  'pacman':     { id: "pacman",     title: "Pac-Man",       category: "arcade",      rating: "4.8", badge: "TOP", icon: "👾", bg: "linear-gradient(135deg,#1e1b4b,#312e81)", url: "https://freepacman.org/" },
  'solitaire':  { id: "solitaire",  title: "Solitaire",     category: "casual",      rating: "4.7", badge: "TOP", icon: "🃏", bg: "linear-gradient(135deg,#065f46,#064e3b)", url: "https://www.solitr.com/klondike-solitaire" },
  'sudoku':     { id: "sudoku",     title: "Sudoku",        category: "puzzle",      rating: "4.8", badge: "",    icon: "🔢", bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", url: "https://sudoku.com/" },
  'mahjong':    { id: "mahjong",    title: "Mahjong",       category: "puzzle",      rating: "4.6", badge: "",    icon: "🀄", bg: "linear-gradient(135deg,#b45309,#92400e)", url: "https://www.mahjong.co/" },
  'memory':     { id: "memory",     title: "Memory Match",  category: "puzzle",      rating: "4.4", badge: "NEW", icon: "🧠", bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", url: "https://www.helpfulgames.com/subjects/brain-training/memory.html" },
};

export default function SeoPage() {
  const { slug }        = useParams();
  const [activeGame, setActiveGame] = useState(null);
  const page = SEO_PAGES[slug];

  if (!page) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Orbitron,monospace' }}>Page Not Found</h1>
        <Link to="/" style={{ color: SITE_CONFIG.primaryColor }}>← Back to Games</Link>
      </div>
    );
  }

  const pageGames = page.games.map(id => FAMOUS_GAMES[id]).filter(Boolean);
  const siteUrl   = SITE_CONFIG.url;

  return (
    <>
      <Helmet>
        <title>{page.title} | {SITE_CONFIG.name}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
        <link rel="canonical" href={`${siteUrl}/games/${slug}`} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/games/${slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": page.title,
          "description": page.description,
          "url": `${siteUrl}/games/${slug}`,
          "isPartOf": { "@type": "WebSite", "name": SITE_CONFIG.name, "url": siteUrl },
        })}</script>
      </Helmet>

      <div style={{ padding: '20px', maxWidth: 900, margin: '0 auto' }}>

        {/* Breadcrumb for SEO */}
        <nav style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>
          <Link to="/" style={{ color: SITE_CONFIG.primaryColor, textDecoration: 'none' }}>{SITE_CONFIG.name}</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>Games</span>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#374151' }}>{page.h1}</span>
        </nav>

        {/* H1 */}
        <h1 style={{ fontFamily: 'Orbitron,monospace', fontSize: 'clamp(18px,4vw,28px)', fontWeight: 900, color: '#1a1a2e', marginBottom: 10 }}>
          {page.h1}
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{page.content}</p>

        {/* Games grid */}
        <h2 style={{ fontFamily: 'Orbitron,monospace', fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#1a1a2e' }}>
          Play Now — Instant, Free, No Download
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 12, marginBottom: 28 }}>
          {pageGames.map(game => <GameCard key={game.id} game={game} onClick={setActiveGame} />)}
        </div>

        {/* SEO content block */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Orbitron,monospace', fontSize: 14, color: '#1a1a2e', marginBottom: 10 }}>
            Why Play on {SITE_CONFIG.name}?
          </h2>
          <ul style={{ color: '#6b7280', fontSize: 13, lineHeight: 2, paddingLeft: 18 }}>
            <li>✅ 100% free — no credit card, no payment ever</li>
            <li>✅ No download required — works in any browser</li>
            <li>✅ Works on mobile phones, tablets and desktop</li>
            <li>✅ New games added every week</li>
            <li>✅ Earn XP, badges and climb the leaderboard</li>
          </ul>
        </div>

        {/* Related pages for internal linking */}
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: '18px' }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#1a1a2e' }}>
            More Free Game Collections
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(SEO_PAGES)
              .filter(([s]) => s !== slug)
              .slice(0, 12)
              .map(([s, pg]) => (
                <Link key={s} to={`/games/${s}`}
                  style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 99, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#374151', textDecoration: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = SITE_CONFIG.primaryColor; e.currentTarget.style.color = SITE_CONFIG.primaryColor; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}>
                  {pg.h1}
                </Link>
              ))}
          </div>
        </div>
      </div>

      {activeGame && <GamePlayer game={activeGame} onClose={() => setActiveGame(null)} />}
    </>
  );
}
