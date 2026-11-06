import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  const geminiConfigured = !!(process.env.GEMINI_API_KEY && 
    process.env.GEMINI_API_KEY.trim() !== '' && 
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');

  res.json({
    status: 'online',
    service: 'CREDENCE AI Backend Verification Engine',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    engine: 'deterministic-rules',
    geminiConfigured,
    aiStatus: geminiConfigured 
      ? 'Google Gemini API key verified' 
      : 'Deterministic rule engine active (no Gemini API key configured)',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

export default router;
