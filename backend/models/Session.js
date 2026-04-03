const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: String, required: true },
  gameTitle: { type: String, required: true },
  gameCategory: { type: String, default: 'general' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

sessionSchema.methods.finish = function() {
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  this.completed = true;
};

module.exports = mongoose.model('Session', sessionSchema);
