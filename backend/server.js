require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gamespark-28sk.netlify.app',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chat',  require('./routes/chat'));   // NEW: multiplayer room chat

// Health / keep-alive
app.get('/',           (_req, res) => res.json({ status: 'GameSpark API online', time: new Date() }));
app.get('/api/health', (_req, res) => res.json({ status: 'GameSpark API online', time: new Date() }));
app.get('/ping',       (_req, res) => res.send('pong'));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: err.message });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('[DB] MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`[Server] Running on port ${PORT}`));
  })
  .catch(err => { console.error('[DB] Failed:', err.message); process.exit(1); });
