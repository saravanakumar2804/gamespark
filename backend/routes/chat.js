const express = require('express');
const router  = express.Router();

// In-memory room store — simple, no DB needed
// Rooms expire after 24 hours automatically
const rooms = new Map();
const ROOM_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getRoom(code) {
  if (!rooms.has(code)) {
    rooms.set(code, { messages: [], created: Date.now(), lastActive: Date.now() });
  }
  const room = rooms.get(code);
  room.lastActive = Date.now();
  return room;
}

// Cleanup old rooms every hour
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.lastActive > ROOM_TTL) rooms.delete(code);
  }
}, 60 * 60 * 1000);

// GET /api/chat/:roomCode — get all messages since a timestamp
router.get('/:roomCode', (req, res) => {
  const room  = getRoom(req.params.roomCode.toUpperCase());
  const since = parseInt(req.query.since) || 0;
  const msgs  = since ? room.messages.filter(m => m.ts > since) : room.messages.slice(-50);
  res.json({ messages: msgs, total: room.messages.length });
});

// POST /api/chat/:roomCode — send a message
router.post('/:roomCode', (req, res) => {
  const { user, text } = req.body;
  if (!text?.trim() || !user?.trim()) return res.status(400).json({ error: 'user and text required' });

  const room = getRoom(req.params.roomCode.toUpperCase());
  const msg  = { user: user.trim(), text: text.trim().slice(0, 200), ts: Date.now(), system: false };
  room.messages.push(msg);

  // Keep only last 100 messages per room
  if (room.messages.length > 100) room.messages = room.messages.slice(-100);

  res.json({ ok: true, message: msg });
});

// POST /api/chat/:roomCode/system — system messages (join/leave)
router.post('/:roomCode/system', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  const room = getRoom(req.params.roomCode.toUpperCase());
  const msg  = { user: 'System', text: text.trim(), ts: Date.now(), system: true };
  room.messages.push(msg);
  res.json({ ok: true });
});

module.exports = router;
