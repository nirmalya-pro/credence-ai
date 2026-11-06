import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verifyRoutes from './routes/verify.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
// CORS configuration – restrict to CLIENT_URL in production, allow any origin in development
app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.CLIENT_URL || '*';
    // If wildcard, allow all origins
    if (allowed === '*') return callback(null, true);
    // Otherwise, only allow exact match (or null for non-browser requests)
    if (!origin || origin === allowed) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api', healthRoutes);
app.use('/api', verifyRoutes);

// Root informative endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'CREDENCE AI Backend API',
    tagline: 'Confidence in Every Brand Claim',
    status: 'active',
    version: '1.0.0',
    documentation: '/api/health',
    verifyEndpoint: 'POST /api/verify'
  });
});

// Auto-start server when executed directly as entrypoint
const isDirectEntry = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'));
if (isDirectEntry && process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, HOST, () => {
    console.log(`[CREDENCE AI Server] Running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`[CREDENCE AI Server] Health check available at http://localhost:${PORT}/api/health`);
    console.log(`[CREDENCE AI Server] Optional Gemini AI: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'Configured' : 'Inactive (Default Rule Engine Active)'}`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });
  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });
}

// Global error handler – returns JSON error responses
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});
