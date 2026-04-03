const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'Username or email already taken' });
    const user = await User.create({ username, email, password });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, xp: user.xp, level: user.level, streak: user.streak, badges: user.badges, favourites: user.favourites }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    user.updateStreak();
    await user.save();
    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, xp: user.xp, level: user.level, streak: user.streak, badges: user.badges, favourites: user.favourites, totalPlayTime: user.totalPlayTime, gamesPlayed: user.gamesPlayed }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// Toggle favourite game
router.post('/favourite', protect, async (req, res) => {
  try {
    const { gameId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.favourites.indexOf(gameId);
    if (idx > -1) user.favourites.splice(idx, 1);
    else user.favourites.push(gameId);
    await user.save();
    res.json({ favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
