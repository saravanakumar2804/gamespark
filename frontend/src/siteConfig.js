// ═══════════════════════════════════════════════════════════════
//  GAMESPARK SITE CONFIG — Change everything from here
//  This file controls the entire app's branding
// ═══════════════════════════════════════════════════════════════

const SITE_CONFIG = {

  // ── BASIC INFO ────────────────────────────────────────────────
  name:        "GameSpark",          // ← Change your site name here
  tagline:     "Play. Compete. Win Big.",
  description: "Play 1500+ free online games instantly. No download needed!",
  url:         "https://gamespark-28sk.netlify.app",

  // ── LOGO ─────────────────────────────────────────────────────
  // Option 1: Use an emoji as logo icon (easiest)
  logoEmoji:   "⚡",                 // ← Change your logo emoji here

  // Option 2: Use an image URL instead (paste your logo image URL)
  // Upload your logo to imgur.com or cloudinary.com and paste URL here
  logoImageUrl: "",                  // ← Paste image URL here, or leave "" to use emoji

  // ── COLORS ───────────────────────────────────────────────────
  primaryColor:   "#ff6b35",         // ← Main orange color
  secondaryColor: "#7c3aed",         // ← Purple accent
  accentColor:    "#06d6a0",         // ← Green accent

  // ── SIDEBAR STATS ────────────────────────────────────────────
  gamesCount:   "1500+",
  sidebarStats: [
    { num: "1500+", label: "Games"     },
    { num: "FREE",  label: "Always"    },
    { num: "24/7",  label: "Online"    },
    { num: "0",     label: "Downloads" },
  ],

  // ── HERO SECTION ─────────────────────────────────────────────
  heroTag:    "⚡ 1500+ Games — 100% Free",
  heroTitle:  "Play. Compete.",
  heroTitleHighlight: "Win Big.",
  heroSubtitle: "No downloads. No sign-up required. Jump into free games instantly!",
  heroStats: [
    { num: "1500+", label: "Games"     },
    { num: "Free",  label: "Always"    },
    { num: "0",     label: "Downloads" },
  ],

  // ── SEO ──────────────────────────────────────────────────────
  seoTitle:       "GameSpark — Play 1500+ Free Online Games | No Download Needed",
  seoDescription: "Play 1500+ free online games on GameSpark. Action, puzzle, racing, sports and more. No download, no sign-up needed. New games added weekly!",
  seoKeywords:    "free online games, browser games, no download games, html5 games, puzzle games, action games, racing games, sports games, arcade games",

  // ── CONTACT ──────────────────────────────────────────────────
  contactEmail: "admin@gamespark.com",

  // ── SOCIAL ───────────────────────────────────────────────────
  socialLinks: {
    twitter:   "",   // ← Paste your Twitter/X URL
    instagram: "",   // ← Paste your Instagram URL
    youtube:   "",   // ← Paste your YouTube URL
  },
};

export default SITE_CONFIG;
