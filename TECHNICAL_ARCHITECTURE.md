# TECHNICAL ARCHITECTURE — CREDENCE AI

## 1. System Overview

Credence AI is built as a resilient, evidence-first brand governance system. It utilizes an isomorphic architecture where factual verification rules can execute with zero latency either inside the client browser or through a Node.js / Express backend service.

```
                    +------------------------------------------+
                    |           CREDENCE AI FRONTEND           |
                    | (React 18 + Vite 6 + Tailwind CSS)       |
                    +--------------------+---------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
        +------------------------------+     +-------------------------------+
        |    Isomorphic Rule Engine    |     |      LocalStorage Store       |
        |  (Client-Side Verification)  |     |  - Brand Workspace Guidelines |
        +------------------------------+     |  - Brand Truth Ledger         |
                       |                     |  - Review Records & History   |
                       |                     +-------------------------------+
                       | (Optional AI / Proxy)
                       v
        +------------------------------+
        |      EXPRESS BACKEND API     |
        |    (Node.js 24 + Express 4)  |
        +--------------+---------------+
                       |
                       +---- [Rule Engine Backup]
                       |
                       +---- [Optional Google Gemini 1.5/2.5 Flash]
                             (Secure Backend-Only API Key)
```

---

## 2. Frontend Architecture

- **Framework:** React 18 with modern functional components and Hooks.
- **State Management (`AppContext.jsx`):**
  - Manages active brand configuration, truth ledger entries, submissions, review decisions, and navigation tabs.
  - Automatically synchronizes all mutations to `localStorage` under isolated keys (`credence_brand_v1`, `credence_ledger_v1`, `credence_reviews_v1`, `credence_settings_v1`).
- **Styling & UI Kit:**
  - Tailwind CSS with a customized **Midnight Navy** (`#0F172A`, `#1E293B`) and **Teal** (`#0D9488`, `#14B8A6`) enterprise aesthetic.
  - Plus Jakarta Sans typography and Lucide React icons.
  - Accessible severity indicators and evidentiary status badges.

---

## 3. Backend Architecture

- **Runtime:** Node.js (v24.18.1)
- **Framework:** Express.js 4 with CORS and JSON body-parser middlewares.
- **Port & Host Binding:** Configured via `PORT` (default: `5000`) and `HOST` (default: `0.0.0.0`), allowing proper binding across local network interfaces and production containers.
- **Environment Management:**
  - `client/.env`: Sets `VITE_API_BASE_URL=http://localhost:5000` for local development. In production (Vercel/Render), `VITE_API_BASE_URL` is configured to the live Render backend URL.
  - `server/.env`: Stores backend port and optional `GEMINI_API_KEY`.
- **API Endpoints:**
  - `GET /`: Health check and API service information.
  - `GET /api/health`: Comprehensive health diagnostics, returning `{ status: 'online', service, version, geminiConfigured, engine, timestamp }`.
  - `POST /api/verify`: Main content verification endpoint. Accepts content, brand profile, and truth ledger facts. Runs deterministic checks first, followed by optional Gemini AI assistance if requested by the user.

---

## 4. Verification Workflow & Evidentiary Grounding

1. **Input Ingestion:** Marketer submits copy with selected channel (e.g. Instagram caption, Newsletter).
2. **Prohibited Word Scanning:** Regex boundary matching (`\bword\b`) flags unauthorized vocabulary (e.g., *"cheap"*).
3. **Tone Inconsistency Detection:** Scans for informal street slang (e.g., *"Yo guys!"*) or aggressive clickbait claims that contradict the brand's stated communication style.
4. **Commercial Pricing Reconciliation:** Compares currency mentions against the catalog. Differentiates between outdated historical pricing (e.g. ₹999) and flat pricing mismatches.
5. **Medical & Efficacy Substantiation:** Checks functional benefits against the Truth Ledger. Unsupported superlatives (e.g., *"Guaranteed to double muscle recovery"*) are flagged as `CONTRADICTED` or `UNVERIFIED`.
6. **Brand Attribution:** Ensures the core enterprise brand is represented.
7. **Correction Generation:** Generates suggested replacement text and drops it into the Correction Assistant.
8. **Human Gatekeeping:** Content is routed to the Review Centre where human compliance leads make the final sign-off.

---

## 5. Security & Privacy Philosophy

1. **No Frontend Secrets:** Frontend contains zero API keys or credentials.
2. **Deterministic-First:** The system never hallucinates evidence. If a claim lacks proof in the Truth Ledger, it is marked `UNVERIFIED` rather than inventively validated.
3. **Graceful Degeneration:** Complete platform functionality is available even with zero network connectivity or if external AI rate limits are exceeded.
