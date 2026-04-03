const express = require('express');
const Session = require('../models/Session');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Start a game session
router.post('/start', protect, async (req, res) => {
  try {
    const { gameId, gameTitle, gameCategory } = req.body;
    const session = await Session.create({ userId: req.user._id, gameId, gameTitle, gameCategory });
    res.json({ sessionId: session._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// End a game session
router.post('/end', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session || session.userId.toString() !== req.user._id.toString())
      return res.status(404).json({ message: 'Session not found' });
    session.finish();
    await session.save();
    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalPlayTime += session.duration;
    user.gamesPlayed += 1;
    user.xp += Math.floor(session.duration / 60) * 10;
    user.level = Math.floor(user.xp / 500) + 1;
    // Check badges
    if (user.gamesPlayed === 1) user.badges.push({ name: 'First Game', earnedAt: new Date() });
    if (user.gamesPlayed === 10) user.badges.push({ name: 'Game Explorer', earnedAt: new Date() });
    if (user.gamesPlayed === 50) user.badges.push({ name: 'Gaming Pro', earnedAt: new Date() });
    if (user.streak >= 7) user.badges.push({ name: '7-Day Streak', earnedAt: new Date() });
    await user.save();
    res.json({ duration: session.duration, xpEarned: Math.floor(session.duration / 60) * 10 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's recent sessions
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id }).sort({ startTime: -1 }).limit(20);
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Global leaderboard
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
