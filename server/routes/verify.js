import express from 'express';
import { runRuleBasedVerification } from '../services/ruleEngine.js';
import { analyzeWithGeminiIfConfigured } from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/verify
 * Body: { content, brand, truthLedger, useAi }
 */
router.post('/verify', async (req, res) => {
  try {
    const { content, brand, truthLedger, useAi = false } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        error: 'Content string is required for verification'
      });
    }

    // 1. Run deterministic rule-based verification first (always runs)
    const ruleResult = runRuleBasedVerification(content, brand, truthLedger);

    // 2. If user specifically requested AI analysis, run optional Gemini module
    if (useAi) {
      const aiResult = await analyzeWithGeminiIfConfigured(content, brand, truthLedger, ruleResult);
      return res.json(aiResult);
    }

    // Default: Return deterministic rules result
    return res.json(ruleResult);
  } catch (err) {
    console.error('[Verify API Error]', err);
    res.status(500).json({
      error: 'An unexpected verification error occurred',
      details: err.message
    });
  }
});

export default router;
