require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// ─── Rate limiting ─────────────────────────────────────────────────────────────
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// ─── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'https://gamespark-28sk.netlify.app',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ─── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ────────────────────────────────────────────────────────────────────
// FIX: games route mounted at /api/games so frontend fetch('/api/games') works
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/admin', require('./routes/admin'));

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'GameSpark API running', time: new Date() })
);

// ─── MongoDB + start ───────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`GameSpark server running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
