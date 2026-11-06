/**
 * Optional Google Gemini AI Integration for CREDENCE AI
 * 
 * Provider-independent design:
 * - If GEMINI_API_KEY is configured in backend environment, uses Gemini 2.5 Flash / 1.5 Flash for deep semantic nuance.
 * - If key is missing or call fails, gracefully falls back to deterministic rule engine.
 * - Always tags the findings with engine: 'gemini-ai' vs 'deterministic-rules'.
 * - NEVER sends credentials or keys to the frontend.
 */

export async function analyzeWithGeminiIfConfigured(content, brand, truthLedger, ruleBasedResult) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return {
      ...ruleBasedResult,
      aiAvailable: false,
      aiStatusMessage: 'Deterministic rule engine active. (Set GEMINI_API_KEY in server/.env for optional AI analysis)'
    };
  }

  try {
    const prompt = `You are CREDENCE AI, an evidence-first brand governance and compliance engine.
Analyze the following marketing content against the Brand Truth Ledger and guidelines.

BRAND PROFILE:
Name: ${brand?.name || 'NovaFit Nutrition'}
Tone: ${brand?.tone || 'Professional, Friendly, Trustworthy'}
Approved Terms: ${(brand?.approvedTerms || []).join(', ')}
Prohibited Terms: ${(brand?.prohibitedTerms || []).join(', ')}

BRAND TRUTH LEDGER:
${JSON.stringify(truthLedger || [], null, 2)}

CONTENT TO AUDIT:
"""
${content}
"""

Instructions:
1. Verify against the exact facts above.
2. Flag any:
   - Price discrepancies (check approved vs previous/outdated price)
   - Prohibited terms
   - Outdated claims
   - Inconsistent tone or informal slang
   - Misleading guarantees or unsupported health/performance claims
3. Classify each finding with:
   - issueCategory (string)
   - severity ('Critical' | 'High' | 'Medium' | 'Low')
   - status ('VERIFIED' | 'CONTRADICTED' | 'OUTDATED' | 'UNVERIFIED' | 'UNCERTAIN')
   - originalText (exact substring)
   - explanation (concise)
   - relevantFact (approved guideline/fact)
   - sourceReference (citation)
   - suggestedCorrection (actionable drop-in replacement)
4. Provide a suggestedCleanContent string with corrections applied.

Respond ONLY with valid JSON in this structure:
{
  "findings": [ ... ],
  "score": number (0-100),
  "suggestedCleanContent": string,
  "summary": string
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      console.warn(`[Gemini API] Request failed with HTTP ${response.status}. Falling back to rule-based engine.`);
      return {
        ...ruleBasedResult,
        aiAvailable: true,
        aiError: `AI Service returned status ${response.status}. Fallback rules applied.`,
        aiStatusMessage: 'Rule-based verification applied (AI service temporarily unavailable)'
      };
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return {
        ...ruleBasedResult,
        aiAvailable: true,
        aiStatusMessage: 'Rule-based verification applied (AI empty response)'
      };
    }

    const parsed = JSON.parse(candidateText);

    return {
      findings: parsed.findings || ruleBasedResult.findings,
      score: typeof parsed.score === 'number' ? parsed.score : ruleBasedResult.score,
      suggestedCleanContent: parsed.suggestedCleanContent || ruleBasedResult.suggestedCleanContent,
      summary: parsed.summary || ruleBasedResult.summary,
      engine: 'gemini-ai',
      aiAvailable: true,
      aiStatusMessage: 'Verified with Gemini AI + Truth Ledger grounding',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('[Gemini API Exception]', err.message);
    return {
      ...ruleBasedResult,
      aiAvailable: true,
      aiError: err.message,
      aiStatusMessage: 'Rule-based fallback active (AI connection error)'
    };
  }
}
