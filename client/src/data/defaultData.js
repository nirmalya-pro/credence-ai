export const DEMO_BRAND = {
  id: 'brand-novafit',
  name: 'NovaFit Nutrition',
  tagline: 'Fueling Peak Human Performance',
  tone: 'Professional, Friendly, Trustworthy',
  audience: 'Fitness enthusiasts, athletes, health-conscious consumers',
  approvedTerms: ['Affordable', 'Clinically researched', 'Pure whey blend', 'Muscle synthesis'],
  prohibitedTerms: ['Cheap', 'Rock-bottom', 'Miracle cure', 'Bulk fast', 'Steroid-like'],
  products: [
    {
      id: 'prod-01',
      name: 'Protein Blend',
      category: 'Sports Nutrition',
      approvedPrice: '₹1,199',
      approvedPriceNum: 1199,
      previousPrice: '₹999',
      previousPriceNum: 999,
      description: 'High-quality micro-filtered whey protein blend designed for post-workout recovery.'
    }
  ],
  guidelines: 'All content must adhere to professional and trustworthy communication. Never use informal greetings like "Yo guys". Avoid exaggerated or misleading guarantees. The price of Protein Blend is updated to ₹1,199 effective January 2025.'
};

export const DEMO_TRUTH_LEDGER = [
  {
    id: 'BTL-001',
    category: 'Commercial Pricing',
    claim: 'Protein Blend Current Retail Price',
    approvedValue: '₹1,199',
    outdatedValue: '₹999',
    status: 'VERIFIED',
    sourceReference: 'NovaFit Pricing Directive 2025-Q1 (Approved by Finance)',
    version: 'v2.1',
    lastUpdated: '2025-01-15',
    changeHistory: [
      { version: 'v2.1', date: '2025-01-15', note: 'Price revised from ₹999 to ₹1,199 to account for raw whey inflation.' },
      { version: 'v1.0', date: '2024-03-01', note: 'Initial product release at ₹999 introductory price.' }
    ]
  },
  {
    id: 'BTL-002',
    category: 'Product Terminology',
    claim: 'Pricing Accessibility Classification',
    approvedValue: 'Affordable',
    outdatedValue: 'Cheap',
    status: 'VERIFIED',
    sourceReference: 'Brand Style Guide v3.4 (Section: Brand Identity & Positioning)',
    version: 'v2.0',
    lastUpdated: '2024-11-20',
    changeHistory: [
      { version: 'v2.0', date: '2024-11-20', note: 'Strictly prohibited word "cheap" across all global and agency marketing.' }
    ]
  },
  {
    id: 'BTL-003',
    category: 'Clinical & Efficacy Claims',
    claim: 'Muscle Recovery Benefit',
    approvedValue: 'Supports normal muscle recovery',
    outdatedValue: 'Guaranteed to double muscle recovery',
    status: 'VERIFIED',
    sourceReference: 'Clinical Study NF-2024-A & FSSAI Permitted Health Statements',
    version: 'v1.4',
    lastUpdated: '2024-10-05',
    changeHistory: [
      { version: 'v1.4', date: '2024-10-05', note: 'Corrected marketing draft; absolute recovery doubling is clinically unverified.' }
    ]
  },
  {
    id: 'BTL-004',
    category: 'Brand Attribution',
    claim: 'Tone & Voice Compliance',
    approvedValue: 'Professional, Friendly, Trustworthy',
    outdatedValue: 'Informal slang / street hype',
    status: 'VERIFIED',
    sourceReference: 'NovaFit Communications Handbook (Section 1.2)',
    version: 'v1.2',
    lastUpdated: '2024-09-12',
    changeHistory: [
      { version: 'v1.2', date: '2024-09-12', note: 'Guidelines updated to forbid clickbait and excessive exclamation marks.' }
    ]
  },
  {
    id: 'BTL-005',
    category: 'Sourcing & Quality',
    claim: 'Protein Purity & Filtration',
    approvedValue: 'Cold-microfiltered 100% grass-fed whey',
    outdatedValue: 'Standard commodity whey',
    status: 'VERIFIED',
    sourceReference: 'Supplier Certificate of Analysis #COA-9812-NZ',
    version: 'v1.0',
    lastUpdated: '2024-08-01',
    changeHistory: []
  }
];

export const DEMO_CONTENT_PRESET = {
  title: 'Instagram Launch Teaser - Protein Blend',
  contentType: 'Social Media Caption',
  content: 'Yo guys! Get our cheap Protein Blend for just INR 999. Guaranteed to double your muscle recovery!'
};

export const INITIAL_REVIEWS = [
  {
    id: 'REV-1001',
    title: 'Q4 Fitness Newsletter - Protein Promo',
    brandId: 'brand-novafit',
    brandName: 'NovaFit Nutrition',
    contentType: 'Email Newsletter',
    originalContent: 'Fuel your workout with NovaFit Protein Blend. Formulated to support normal muscle recovery at an affordable price of ₹1,199.',
    suggestedCleanContent: 'Fuel your workout with NovaFit Protein Blend. Formulated to support normal muscle recovery at an affordable price of ₹1,199.',
    score: 100,
    findings: [],
    reviewStatus: 'APPROVED',
    submittedAt: '2025-01-20T10:30:00.000Z',
    reviewedAt: '2025-01-20T11:15:00.000Z',
    reviewerName: 'Sarah Jenkins',
    reviewerRole: 'Brand Compliance Lead',
    comments: 'Perfect adherence to brand guidelines and 2025 pricing.',
    history: [
      {
        action: 'SUBMITTED',
        timestamp: '2025-01-20T10:30:00.000Z',
        by: 'Copywriter Alex'
      },
      {
        action: 'APPROVED',
        timestamp: '2025-01-20T11:15:00.000Z',
        by: 'Sarah Jenkins (Brand Compliance Lead)',
        notes: 'Approved without amendments.'
      }
    ]
  }
];
