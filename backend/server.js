require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// ── Rate limiting ──────────────────────────────────────────────────────────────
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// ── CORS — CRITICAL FIX ────────────────────────────────────────────────────────
// Must list every origin that calls this API
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gamespark-28sk.netlify.app',
  // Add your custom domain here when you buy one e.g. 'https://nexplay.in'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle OPTIONS preflight requests
app.options('*', cors());

// ── Body parser ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/admin', require('./routes/admin'));

// ── Health check — Render keeps server alive via this ──────────────────────────
app.get('/',          (_req, res) => res.json({ status: 'GameSpark API online', time: new Date() }));
app.get('/api/health',(_req, res) => res.json({ status: 'GameSpark API online', time: new Date() }));
app.get('/ping',      (_req, res) => res.send('pong'));

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: err.message });
});

// ── Connect MongoDB and start ──────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('[DB] MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`[Server] GameSpark API running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('[DB] MongoDB connection failed:', err.message);
    process.exit(1);
  });
