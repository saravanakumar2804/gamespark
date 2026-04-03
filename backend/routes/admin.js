const express = require('express');
const User = require('../models/User');
const Session = require('../models/Session');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// All admin routes require login + admin role
router.use(protect, adminOnly);

// Dashboard overview
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSessions = await Session.countDocuments();
    const today = new Date(); today.setHours(0,0,0,0);
    const todayUsers = await User.countDocuments({ createdAt: { $gte: today } });
    const todaySessions = await Session.countDocuments({ startTime: { $gte: today } });
    const totalPlayTime = await Session.aggregate([{ $group: { _id: null, total: { $sum: '$duration' } } }]);
    const topGames = await Session.aggregate([
      { $group: { _id: '$gameId', title: { $first: '$gameTitle' }, plays: { $sum: 1 }, totalTime: { $sum: '$duration' } } },
      { $sort: { plays: -1 } }, { $limit: 10 }
    ]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10)
      .select('username email createdAt gamesPlayed totalPlayTime streak xp level');
    const dailySignups = await User.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } }, { $limit: 30 }
    ]);
    res.json({ totalUsers, totalSessions, todayUsers, todaySessions, totalPlayTime: totalPlayTime[0]?.total || 0, topGames, recentUsers, dailySignups });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// All users with full details
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search ? { $or: [{ username: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit).select('-password');
    const total = await User.countDocuments(query);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Single user full detail
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const sessions = await Session.find({ userId: req.params.id }).sort({ startTime: -1 }).limit(50);
    res.json({ user, sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
