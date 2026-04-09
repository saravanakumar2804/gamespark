const express = require('express');
const Session = require('../models/Session');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const router  = express.Router();
const axios   = require('axios');

// ─── CORRECT GamePix endpoint ─────────────────────────────────────────────────
// The old feeds.gamepix.com URL does NOT track plays.
// The correct URL is games.gamepix.com/games?sid=YOUR_SID
// This SID in the URL is how GamePix counts plays on their dashboard.
router.get('/', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 96;
    const SID   = process.env.GAMEPIX_SID  || '';

    if (!SID) {
      console.warn('[GamePix] GAMEPIX_SID not set in environment variables!');
      return res.json({ items: [], page: 1, totalPages: 1, total: 0, error: 'GAMEPIX_SID missing' });
    }

    // ORDER=q means most played first — best for your users
    // ORDER=d means newest first
    const offset = (page - 1) * limit;
    const url = `https://games.gamepix.com/games?sid=${SID}&order=q`;

    console.log(`[GamePix] Fetching: ${url}`);
    const response = await axios.get(url, { timeout: 15000 });
    const raw = response.data;

    console.log('[GamePix] Response type:', typeof raw);
    console.log('[GamePix] Is array:', Array.isArray(raw));
    if (Array.isArray(raw)) {
      console.log('[GamePix] Total games:', raw.length);
      console.log('[GamePix] First game keys:', Object.keys(raw[0] || {}));
      console.log('[GamePix] First game URL:', raw[0]?.url);
    } else {
      console.log('[GamePix] Response keys:', Object.keys(raw || {}));
    }

    // GamePix /games endpoint returns an array directly
    const allGames = Array.isArray(raw) ? raw : (raw.games || raw.items || raw.data || []);

    // Paginate manually since this endpoint returns all games at once
    const total      = allGames.length;
    const totalPages = Math.ceil(total / limit);
    const pageGames  = allGames.slice(offset, offset + limit);

    const mapped = pageGames
      .filter(g => g.url)
      .map(g => ({
        id:          String(g.id),
        title:       g.title       || 'Game',
        description: g.description || '',
        category:    ((g.category  || 'arcade') + '').toLowerCase(),
        // CRITICAL: thumbnail uses the correct GamePix field names
        thumbnail:   g.thumbnailUrl || g.thumbnailUrl100 || g.thumbnail || g.image || '',
        // CRITICAL: game URL already contains SID tracking when fetched via this endpoint
        url:         g.url,
        width:       g.width   || 800,
        height:      g.height  || 600,
        touch:       g.touch   || false,
        orientation: g.orientation || 'landscape',
      }));

    console.log(`[GamePix] Returning ${mapped.length} games for page ${page} of ${totalPages}`);

    res.json({ items: mapped, page, totalPages, total });

  } catch (error) {
    console.error('[GamePix] Error:', error.message);
    if (error.response) {
      console.error('[GamePix] Status:', error.response.status);
      console.error('[GamePix] Data sample:', JSON.stringify(error.response.data).slice(0, 300));
    }
    res.status(200).json({ items: [], page: 1, totalPages: 1, total: 0, error: error.message });
  }
});

// ─── Debug endpoint — visit /api/games/debug to see raw GamePix response ──────
router.get('/debug', async (req, res) => {
  try {
    const SID = process.env.GAMEPIX_SID || 'NOT_SET';
    const url = `https://games.gamepix.com/games?sid=${SID}&order=q`;
    const response = await axios.get(url, { timeout: 15000 });
    const raw = response.data;
    const games = Array.isArray(raw) ? raw : (raw.games || raw.items || []);
    res.json({
      sid_used:      SID,
      url_called:    url,
      status:        response.status,
      is_array:      Array.isArray(raw),
      total_games:   games.length,
      first_game:    games[0]  || null,
      second_game:   games[1]  || null,
      response_keys: Array.isArray(raw) ? 'array' : Object.keys(raw || {}),
    });
  } catch (err) {
    res.json({ error: err.message, status: err.response?.status, sid: process.env.GAMEPIX_SID });
  }
});

// ─── Award XP for watching rewarded ad ────────────────────────────────────────
// Called from frontend when user completes a rewarded ad
router.post('/reward-ad', protect, async (req, res) => {
  try {
    const { xpAmount = 50 } = req.body;
    const user = await User.findById(req.user._id);
    user.xp    += xpAmount;
    user.level  = Math.floor(user.xp / 500) + 1;

    // Give badge for first rewarded ad
    const alreadyHasBadge = user.badges.some(b => b.name === 'Ad Supporter');
    if (!alreadyHasBadge) user.badges.push({ name: 'Ad Supporter', earnedAt: new Date() });

    await user.save();
    res.json({ success: true, xpEarned: xpAmount, newXp: user.xp, newLevel: user.level });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Start session ────────────────────────────────────────────────────────────
router.post('/start', protect, async (req, res) => {
  try {
    const { gameId, gameTitle, gameCategory } = req.body;
    const session = await Session.create({ userId: req.user._id, gameId, gameTitle, gameCategory });
    res.json({ sessionId: session._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── End session ──────────────────────────────────────────────────────────────
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── History ──────────────────────────────────────────────────────────────────
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ startTime: -1 }).limit(20);
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Leaderboard ─────────────────────────────────────────────────────────────
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({}, 'username xp level gamesPlayed streak badges')
      .sort({ xp: -1 }).limit(10);
    res.json({ leaderboard: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
