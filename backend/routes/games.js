const express = require('express');
const Session = require('../models/Session');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const router  = express.Router();
const axios   = require('axios');

// ── GamePix games — tries multiple endpoint formats ────────────────────────────
router.get('/', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 96;
    const SID   = process.env.GAMEPIX_SID  || '';

    if (!SID || SID === 'YOUR_GAMEPIX_SID_HERE') {
      console.error('[GamePix] GAMEPIX_SID is not set in Render environment variables!');
      return res.json({ items: [], page: 1, totalPages: 1, total: 0, error: 'GAMEPIX_SID not configured' });
    }

    // Try the correct GamePix API endpoint
    // The /games endpoint returns all games as an array
    const offset = (page - 1) * limit;

    let allGames = [];
    let usedUrl  = '';

    // Try endpoint 1: games.gamepix.com
    try {
      usedUrl = `https://games.gamepix.com/games?sid=${SID}&order=q`;
      console.log(`[GamePix] Trying: ${usedUrl}`);
      const r1 = await axios.get(usedUrl, { timeout: 12000 });
      const d1 = r1.data;
      allGames = Array.isArray(d1) ? d1 : (d1.games || d1.items || d1.data || []);
      console.log(`[GamePix] Endpoint 1 returned: ${allGames.length} games`);
    } catch (e1) {
      console.warn(`[GamePix] Endpoint 1 failed: ${e1.message}`);

      // Try endpoint 2: feeds.gamepix.com v2
      try {
        usedUrl = `https://feeds.gamepix.com/v2/json?sid=${SID}&pagination=${limit}&page=${page}`;
        console.log(`[GamePix] Trying: ${usedUrl}`);
        const r2 = await axios.get(usedUrl, { timeout: 12000 });
        const d2 = r2.data;
        allGames = d2.items || d2.data || d2.games || (Array.isArray(d2) ? d2 : []);
        console.log(`[GamePix] Endpoint 2 returned: ${allGames.length} games`);
      } catch (e2) {
        console.error(`[GamePix] Both endpoints failed. E1: ${e1.message}, E2: ${e2.message}`);
        return res.json({ items: [], page: 1, totalPages: 1, total: 0, error: 'All GamePix endpoints failed' });
      }
    }

    if (allGames.length === 0) {
      console.warn(`[GamePix] API returned 0 games. SID used: ${SID}. URL: ${usedUrl}`);
      console.warn('[GamePix] Please verify your SID at your GamePix publisher dashboard');
      return res.json({ items: [], page: 1, totalPages: 1, total: 0, error: 'GamePix returned 0 games — check SID' });
    }

    // Paginate
    const total      = allGames.length;
    const totalPages = Math.ceil(total / limit);
    const pageGames  = allGames.slice(offset, offset + limit);

    const mapped = pageGames
      .filter(g => g.url || g.game_url)
      .map(g => ({
        id:        String(g.id || g.game_id || Math.random()),
        title:     g.title || g.name || 'Game',
        category:  ((g.category || g.categories?.[0] || 'arcade') + '').toLowerCase(),
        thumbnail: g.thumbnailUrl || g.thumbnailUrl100 || g.thumbnail || g.image || g.icon || '',
        url:       g.url || g.game_url || '',
        width:     g.width  || 800,
        height:    g.height || 600,
      }));

    console.log(`[GamePix] Sending ${mapped.length} games (page ${page}/${totalPages})`);
    res.json({ items: mapped, page, totalPages, total });

  } catch (error) {
    console.error('[GamePix] Unexpected error:', error.message);
    res.json({ items: [], page: 1, totalPages: 1, total: 0, error: error.message });
  }
});

// ── Debug — visit /api/games/debug to see exactly what GamePix returns ─────────
router.get('/debug', async (req, res) => {
  const SID = process.env.GAMEPIX_SID || 'NOT_SET';
  const results = {};

  // Test endpoint 1
  try {
    const url = `https://games.gamepix.com/games?sid=${SID}&order=q`;
    const r   = await axios.get(url, { timeout: 10000 });
    const d   = r.data;
    const arr = Array.isArray(d) ? d : (d.games || d.items || []);
    results.endpoint1 = { url, status: r.status, isArray: Array.isArray(d), count: arr.length, firstGame: arr[0] || null, keys: Array.isArray(d) ? 'array' : Object.keys(d) };
  } catch (e) {
    results.endpoint1 = { error: e.message, status: e.response?.status };
  }

  // Test endpoint 2
  try {
    const url = `https://feeds.gamepix.com/v2/json?sid=${SID}&pagination=5&page=1`;
    const r   = await axios.get(url, { timeout: 10000 });
    const d   = r.data;
    const arr = d.items || d.data || (Array.isArray(d) ? d : []);
    results.endpoint2 = { url, status: r.status, count: arr.length, firstGame: arr[0] || null, keys: Object.keys(d) };
  } catch (e) {
    results.endpoint2 = { error: e.message, status: e.response?.status };
  }

  res.json({ sid_in_env: SID, sid_looks_valid: SID.length > 3 && SID !== 'NOT_SET', ...results });
});

// ── Reward ad XP ───────────────────────────────────────────────────────────────
router.post('/reward-ad', protect, async (req, res) => {
  try {
    const { xpAmount = 50 } = req.body;
    const user = await User.findById(req.user._id);
    user.xp   += xpAmount;
    user.level  = Math.floor(user.xp / 500) + 1;
    if (!user.badges.some(b => b.name === 'Ad Supporter'))
      user.badges.push({ name: 'Ad Supporter', earnedAt: new Date() });
    await user.save();
    res.json({ success: true, xpEarned: xpAmount, newXp: user.xp, newLevel: user.level });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Start session ──────────────────────────────────────────────────────────────
router.post('/start', protect, async (req, res) => {
  try {
    const { gameId, gameTitle, gameCategory } = req.body;
    const session = await Session.create({ userId: req.user._id, gameId, gameTitle, gameCategory });
    res.json({ sessionId: session._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── End session ────────────────────────────────────────────────────────────────
router.post('/end', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session || session.userId.toString() !== req.user._id.toString())
      return res.status(404).json({ message: 'Session not found' });
    session.finish();
    await session.save();
    const user = await User.findById(req.user._id);
    user.totalPlayTime += session.duration;
    user.gamesPlayed   += 1;
    user.xp            += Math.floor(session.duration / 60) * 10;
    user.level          = Math.floor(user.xp / 500) + 1;
    if (user.gamesPlayed === 1)  user.badges.push({ name: 'First Game',    earnedAt: new Date() });
    if (user.gamesPlayed === 10) user.badges.push({ name: 'Game Explorer', earnedAt: new Date() });
    if (user.gamesPlayed === 50) user.badges.push({ name: 'Gaming Pro',    earnedAt: new Date() });
    if (user.streak >= 7)        user.badges.push({ name: '7-Day Streak',  earnedAt: new Date() });
    await user.save();
    res.json({ duration: session.duration, xpEarned: Math.floor(session.duration / 60) * 10 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── History ────────────────────────────────────────────────────────────────────
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id }).sort({ startTime: -1 }).limit(20);
    res.json({ sessions });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Leaderboard ────────────────────────────────────────────────────────────────
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({}, 'username xp level gamesPlayed streak badges').sort({ xp: -1 }).limit(10);
    res.json({ leaderboard: users });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
