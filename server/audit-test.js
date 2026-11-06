import { runRuleBasedVerification } from './services/ruleEngine.js';

console.log('================================================================');
console.log('       CREDENCE AI — COMPLETE FUNCTIONALITY & VERIFICATION AUDIT');
console.log('================================================================\n');

const demoBrand = {
  id: 'brand-novafit',
  name: 'NovaFit Nutrition',
  tone: 'Professional, Friendly, Trustworthy',
  approvedTerms: ['Affordable', 'Clinically researched'],
  prohibitedTerms: ['Cheap', 'Rock-bottom'],
  products: [
    {
      name: 'Protein Blend',
      approvedPrice: '₹1,199',
      previousPrice: '₹999',
      approvedPriceNum: 1199,
      previousPriceNum: 999
    }
  ]
};

const demoLedger = [
  {
    id: 'BTL-001',
    category: 'Commercial Pricing',
    claim: 'Protein Blend Current Retail Price',
    approvedValue: '₹1,199',
    outdatedValue: '₹999',
    status: 'VERIFIED'
  },
  {
    id: 'BTL-002',
    category: 'Product Terminology',
    claim: 'Pricing Accessibility Classification',
    approvedValue: 'Affordable',
    outdatedValue: 'Cheap',
    status: 'VERIFIED'
  },
  {
    id: 'BTL-003',
    category: 'Clinical & Efficacy Claims',
    claim: 'Muscle Recovery Benefit',
    approvedValue: 'Supports normal muscle recovery',
    outdatedValue: 'Guaranteed to double muscle recovery',
    status: 'VERIFIED'
  }
];

let allPassed = true;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    allPassed = false;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// -------------------------------------------------------------
// TEST SUITE 1: SCENARIO A — Demonstration Content
// -------------------------------------------------------------
console.log('--- TEST SUITE 1: SCENARIO A (Incorrect Marketing Copy) ---');
const contentA = "Yo guys! Get our cheap Protein Blend for just INR 999. Guaranteed to double your muscle recovery!";
const resultA = runRuleBasedVerification(contentA, demoBrand, demoLedger);

assert(resultA.findings.length >= 4, `Scenario A detected ${resultA.findings.length} findings (expected >= 4)`);
assert(resultA.score < 50, `Scenario A compliance score is ${resultA.score}% (expected < 50%)`);

const hasProhibited = resultA.findings.some(f => f.issueCategory === 'Prohibited Terminology' && f.originalText.toLowerCase() === 'cheap');
assert(hasProhibited, 'Detected prohibited word "cheap" with status CONTRADICTED');

const hasTone = resultA.findings.some(f => f.issueCategory === 'Tone & Style');
assert(hasTone, 'Detected informal slang "Yo guys" violating Professional tone');

const hasOutdatedPrice = resultA.findings.some(f => f.issueCategory === 'Outdated Information' && f.status === 'OUTDATED');
assert(hasOutdatedPrice, 'Detected outdated price INR 999 vs revised ₹1,199');

const hasUnsupportedClaim = resultA.findings.some(f => f.issueCategory === 'Unsupported Promotional Claim');
assert(hasUnsupportedClaim, 'Detected unsupported guarantee "Guaranteed to double muscle recovery"');

console.log(`Suggested Clean Copy: "${resultA.suggestedCleanContent}"`);
assert(
  resultA.suggestedCleanContent.includes('₹1,199') && 
  resultA.suggestedCleanContent.includes('NovaFit') && 
  !resultA.suggestedCleanContent.includes('cheap'),
  'Suggested clean copy replaces all violations with compliant brand text'
);

// -------------------------------------------------------------
// TEST SUITE 2: SCENARIO B — Corrected Compliant Content
// -------------------------------------------------------------
console.log('\n--- TEST SUITE 2: SCENARIO B (Corrected Compliant Content) ---');
const contentB = resultA.suggestedCleanContent;
const resultB = runRuleBasedVerification(contentB, demoBrand, demoLedger);

assert(resultB.score === 100, `Scenario B clean copy score is ${resultB.score}% (expected 100%)`);
assert(resultB.findings.length === 0, `Scenario B has 0 findings (detected: ${resultB.findings.length})`);

// -------------------------------------------------------------
// TEST SUITE 3: SCENARIO C — Arbitrary New User Content (Dynamic Detection)
// -------------------------------------------------------------
console.log('\n--- TEST SUITE 3: SCENARIO C (Dynamic Non-Demo User Copy) ---');
const contentC = "Check out our cheap rock-bottom Protein Blend for just INR 500 now!";
const resultC = runRuleBasedVerification(contentC, demoBrand, demoLedger);

assert(resultC.findings.length >= 2, `Scenario C dynamic scan found ${resultC.findings.length} issues`);
const priceMismatchC = resultC.findings.some(f => f.issueCategory === 'Incorrect Product Price');
assert(priceMismatchC, 'Dynamically flagged price mismatch (INR 500 vs approved ₹1,199)');

const prohibitedC = resultC.findings.some(f => f.issueCategory === 'Prohibited Terminology' && f.originalText.toLowerCase() === 'cheap');
assert(prohibitedC, 'Dynamically flagged prohibited term "cheap" in new copy');

// -------------------------------------------------------------
// TEST SUITE 4: DYNAMIC TRUTH LEDGER MODIFICATIONS
// -------------------------------------------------------------
console.log('\n--- TEST SUITE 4: DYNAMIC BRAND TRUTH LEDGER MODIFICATIONS ---');
// Suppose user edits the brand in the Workspace to revise Protein Blend to ₹1,499:
const modifiedBrand = {
  ...demoBrand,
  products: [
    {
      name: 'Protein Blend',
      approvedPrice: '₹1,499',
      previousPrice: '₹1,199',
      approvedPriceNum: 1499,
      previousPriceNum: 1199
    }
  ]
};

// Now test content with the old price ₹1,199:
const contentD = "Discover NovaFit Protein Blend for ₹1,199.";
const resultD = runRuleBasedVerification(contentD, modifiedBrand, demoLedger);

const wasOldPriceOutdated = resultD.findings.some(f => f.status === 'OUTDATED');
assert(wasOldPriceOutdated, 'When price is updated to ₹1,499, previous price ₹1,199 is immediately flagged as OUTDATED');

// Now test content with the new approved price ₹1,499:
const contentE = "Discover NovaFit Protein Blend for ₹1,499. Designed to support normal muscle recovery.";
const resultE = runRuleBasedVerification(contentE, modifiedBrand, demoLedger);
assert(resultE.score === 100, `New approved price ₹1,499 scores ${resultE.score}% (expected 100%)`);

console.log('\n================================================================');
if (allPassed) {
  console.log('>>> ALL VERIFICATION ENGINE TESTS PASSED WITH 100% SUCCESS <<<');
} else {
  console.log('>>> ONE OR MORE TESTS FAILED <<<');
  process.exit(1);
}
console.log('================================================================\n');
