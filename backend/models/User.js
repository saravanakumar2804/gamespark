const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  lastStreakDate: { type: Date },
  badges: [{ name: String, earnedAt: Date }],
  favourites: [{ type: String }],
  totalPlayTime: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastDate = this.lastStreakDate;
  if (!lastDate) {
    this.streak = 1;
  } else {
    const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) this.streak += 1;
    else if (diffDays > 1) this.streak = 1;
  }
  this.lastStreakDate = now;
  this.lastLogin = now;
};

module.exports = mongoose.model('User', userSchema);
