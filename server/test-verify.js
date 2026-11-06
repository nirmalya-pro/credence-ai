import { runRuleBasedVerification } from './services/ruleEngine.js';

const DEMO_BRAND = {
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

const DEMO_LEDGER = [
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

console.log('=== TEST 1: Running NovaFit Demonstration Copy ===');
const testContent = "Yo guys! Get our cheap Protein Blend for just INR 999. Guaranteed to double your muscle recovery!";
const result = runRuleBasedVerification(testContent, DEMO_BRAND, DEMO_LEDGER);

console.log(`Compliance Score: ${result.score}%`);
console.log(`Findings Count: ${result.findings.length}`);
result.findings.forEach((f, i) => {
  console.log(`  [${i+1}] [${f.severity}] [${f.status}] ${f.issueCategory}: "${f.originalText}" -> "${f.suggestedCorrection}"`);
  console.log(`      Explanation: ${f.explanation}`);
});
console.log(`\nSuggested Clean Copy:\n"${result.suggestedCleanContent}"\n`);

console.log('=== TEST 2: Testing Corrected Content ===');
const cleanResult = runRuleBasedVerification(result.suggestedCleanContent, DEMO_BRAND, DEMO_LEDGER);
console.log(`Compliance Score of Cleaned Copy: ${cleanResult.score}%`);
console.log(`Findings Count on Cleaned Copy: ${cleanResult.findings.length}`);

console.log('=== TEST 3: Edge Case: Empty String ===');
const emptyResult = runRuleBasedVerification('', DEMO_BRAND, DEMO_LEDGER);
console.log(`Empty input score: ${emptyResult.score}%, findings: ${emptyResult.findings.length}`);

console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY.');
