# CREDENCE AI — Confidence in Every Brand Claim

> **Intelligent Brand-Governance Platform**  
> Verifying every marketing claim, price, buzzword, and voice attribute against an authoritative corporate Brand Truth Ledger before publication.

---

## 1. Problem Statement

Modern growing organizations publish marketing and communication copy through dozens of distributed employees, external creative agencies, and generative AI tools. 

This decentralized publishing creates severe brand and compliance hazards:
- **Outdated Pricing:** Publishing deprecated promotional discounts (e.g., claiming ₹999 after a product was revised to ₹1,199).
- **Prohibited Terminology:** Using brand-diminishing words (such as *"cheap"* instead of approved terms like *"affordable"*).
- **Unsupported & Dangerous Claims:** Making absolute efficacy promises (e.g., *"Guaranteed to double muscle recovery"*) that trigger regulatory penalties.
- **Inconsistent Voice & Tone:** Casual slang or aggressive hype conflicting with an organization's professional persona.

**Credence AI** solves this not by blindly rejecting content, but by anchoring every finding in an evidentiary **Brand Truth Ledger**, explaining the violation with certified policy citations, and providing drop-in corrections that preserve the creator's original intent.

---

## 2. Core Capabilities & Features

### A. Executive Governance Dashboard
- Real-time compliance metrics: Total Audits, Issues Caught, Pending Approvals, Approved, and Rejected copy.
- Live compliance health score distribution.
- Interactive recent activity feed with one-click inspection.

### B. Brand Workspace & Guidelines
- Define Brand Profile: Name, Tagline, Target Audience, and Tone of Voice.
- Dynamic Terminology Lists: Manage Approved Terminology and Prohibited (banned) buzzwords with tag inputs.
- Product Price Truth Ledger: Track current approved retail prices alongside previous/superseded prices to flag outdated copy.
- Editable sample workspace for **NovaFit Nutrition**.

### C. Brand Truth Ledger (Versioned Fact Repository)
- Structured truth records across 5 core categories: *Commercial Pricing*, *Product Terminology*, *Clinical & Efficacy Claims*, *Brand Attribution*, and *Sourcing & Quality*.
- Every record maintains:
  - Approved Truth Value
  - Outdated / Superseded Value
  - Certified Source / Policy Document Citation
  - Semantic Status (VERIFIED, OUTDATED, UNDER_REVIEW)
  - Full Version History & Revision Audit Log (e.g., v1.0, v2.0, v2.1)

### D. Evidence-First Content Checker & Verification Engine
- Pre-flight checking for Social Media, Ads, Website Copy, Emails, and Packaging.
- **Deterministic Rule Engine:** 100% reliable, zero-dependency factual verification.
- **Optional Gemini AI Assistance:** Secure backend-only integration for nuanced semantic analysis with automatic fallback if unreachable.
- Evaluates 5 distinct evidentiary statuses:
  - `VERIFIED`: Directly corroborated by the Truth Ledger.
  - `CONTRADICTED`: Directly clashes with approved facts or prices.
  - `OUTDATED`: Matches superseded prices or obsolete claims.
  - `UNVERIFIED`: Assertive claims lacking clinical or laboratory substantiation.
  - `UNCERTAIN`: Slang, borderline tone, or missing attribution.

### E. Correction Assistant
- Side-by-side comparison of original detected phrases vs. drop-in corrections.
- One-click copy for individual fixes.
- **One-Click "Replace in Editor":** Automatically updates the editor with compliant brand copy.
- Re-run verification to instantly verify that the cleaned draft achieves a 100% score.

### F. Human Review & Approval Centre
- Formal gatekeeping workflow before content is cleared for public release.
- Reviewer actions: **Approve**, **Reject**, or **Request Changes**.
- Captures reviewer name, role, timestamp, and qualitative rationale.
- Append-only chronological Audit Trail timeline.

### G. Governance & Error Insights
- Empirical recurring error analytics derived directly from saved audit logs.
- Most frequent prohibited words attempted.
- Highest-frequency violation categories.
- High-friction guidelines highlighting internal team training needs.

---

## 3. Technology Stack & Visual Design System

- **Frontend:** React 18, Vite 6, Tailwind CSS 3, Lucide React Icons.
- **Design System:** High-contrast, minimalist tech aesthetic inspired by modern enterprise design:
  - **Midnight Black (`#0B0B0C`)**: Structural navigation, elevated dark panels, contrast backgrounds.
  - **Pure White (`#FFFFFF`) & Slate Neutrals**: High-legibility workspace canvases, forms, and data tables.
  - **Signature Lime Green (`#C6F432`)**: Primary action triggers, score meters, active indicators, and focus highlights.
  - **Subtle 3D Depth**: Realistic soft shadows, multi-layered card elevation, and tactile micro-interactions.
- **Backend:** Node.js 24, Express.js 4, CORS, Dotenv.
- **Data Persistence:** Browser LocalStorage for zero-setup single-user persistence with instant demo reset capability.
- **AI Architecture:** Provider-independent hybrid model. Fast deterministic JavaScript rule engine with optional Google Gemini API proxy on the backend.
- **Deployment Ready:** Vercel (`vercel.json`) for frontend; Render (`render.yaml`) for backend.

---

## 4. How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended; tested on v24.18)
- npm

### Step 1: Environment Configuration
The frontend and backend use environment variables to manage API endpoints:
- In `client/.env`:
  ```bash
  # Local development API endpoint
  VITE_API_BASE_URL=http://localhost:5000
  ```
- In `server/.env`:
  ```bash
  PORT=5000
  HOST=0.0.0.0
  CLIENT_URL=*
  # Optional: GEMINI_API_KEY=
  ```
*(For production deployment on Render or Vercel, set `VITE_API_BASE_URL` in your frontend cloud dashboard to your public Render backend URL. Never hardcode localhost into production).*

### Step 2: Install Dependencies
Open your terminal in the project root folder and run:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

### Step 3: Start the Backend Server
```bash
cd server
npm start
```
The backend verification server will start on `http://localhost:5000` with the health check available at `/api/health`.

### Step 4: Start the Frontend Application
In a separate terminal:
```bash
cd client
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`** (or the port displayed in your terminal).

---

## 5. Walkthrough of Demonstration Scenario

Credence AI comes pre-loaded with an official demonstration brand: **NovaFit Nutrition**.

1. Navigate to **Content Checker** from the sidebar.
2. Click the button: **"Load Demonstration Copy"**.  
   This loads the test copy:
   > *"Yo guys! Get our cheap Protein Blend for just INR 999. Guaranteed to double your muscle recovery!"*
3. Click **"Run Verification"**.
4. Observe the 5 detected compliance issues:
   - **Tone & Style:** *"Yo guys"* flagged as informal slang (violates Professional, Friendly, Trustworthy tone).
   - **Prohibited Terminology:** *"cheap"* flagged (violates Brand Voice; suggests *"Affordable"*).
   - **Outdated Pricing:** *"INR 999"* flagged as obsolete (revised to approved price of **₹1,199**).
   - **Unsupported Claim:** *"Guaranteed to double your muscle recovery!"* flagged as an unverified absolute guarantee (suggests *"Designed to support normal muscle recovery."*).
   - **Attribution:** Missing master brand name attribution.
5. In the **Correction Assistant** card at the bottom, click **"Replace in Editor"**.  
   The copy transforms into:
   > *"Discover NovaFit Protein Blend at its approved price of ₹1,199. Designed to support normal muscle recovery."*
6. Click **"Run Verification"** again — the content achieves a **100% Brand Compliance Score**!
7. Click **"Submit to Human Review Centre"**.
8. In the **Review Centre**, review the submission, enter your name/notes, and click **"Approve"**.
9. Visit **Dashboard** and **Governance Insights** to see the live metrics update.

---

## 6. Architecture & Security Highlights

- **Zero Client-Side Secret Exposure:** No API keys are ever stored or transmitted in client JavaScript.
- **Deterministic Reliability:** Does not rely on probabilistic AI hallucination to verify numerical prices or banned word lists.
- **Fail-Safe Offline Mode:** If the backend or external AI provider goes offline, the frontend's isomorphic rule engine continues verifying content with 100% availability.
- **Legal Compliance:** Does not claim legal or statutory regulatory certification; clearly positioned as a corporate factual alignment and brand governance platform.

---

## 7. Known Limitations

- **Single-User Local Storage:** The current hackathon prototype stores data in browser LocalStorage. Multi-tenant database clustering (PostgreSQL/Supabase) is planned for Round 3.
- **Text & Copy Scope:** Currently focused on textual marketing assets (social captions, ad copy, emails, websites). Multimodal visual asset analysis is part of the Round 3 roadmap.
