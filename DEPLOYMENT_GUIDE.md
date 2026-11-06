# Deployment Guide for CREDENCE AI

This document provides the exact steps required to deploy the **CREDENCE AI** project to GitHub, Render (backend), and Vercel (frontend). All instructions assume you have a GitHub account and have installed the Render and Vercel CLIs or are using their web consoles.

---

## 1. Repository Preparation

1. **Create a new GitHub repository** (e.g. `username/credence-ai`).
2. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/username/credence-ai.git
   cd credence-ai
   ```
3. **Copy the entire project folder** `CREDENCE AI` into the cloned repository directory. The directory structure must be:
   ```
   credence-ai/
   ├─ client/          # React + Vite frontend
   ├─ server/          # Express backend
   ├─ .gitignore
   ├─ package.json     # Root (contains workspace scripts if any)
   ├─ render.yaml      # Render service definition
   ├─ vercel.json      # Vercel build configuration
   ├─ README.md
   ├─ DEPLOYMENT_GUIDE.md   # (this file)
   └─ FINAL_HANDOFF.md
   ```
4. **Commit and push** the initial code:
   ```bash
   git add .
   git commit -m "Initial commit – CREDENCE AI ready for deployment"
   git push origin main
   ```

---

## 2. Backend – Render Deployment

### 2.1 Render Service Definition (`render.yaml`)
The file `render.yaml` is already placed at the repository root. It defines a **Web Service** named `credence-ai-backend`.

Key fields:
- `rootDir: server` – points to the backend source.
- `buildCommand: npm install` – installs dependencies only.
- `startCommand: npm start` – runs `node server.js`.
- Environment variables (`envVars`):
  - `PORT` – the port Render will assign (default `10000` in the file; can be left as is).
  - `CLIENT_URL` – set to `*` for development; **replace with your actual Render service URL** after deployment (e.g. `https://credence-ai-backend.onrender.com`).
  - `GEMINI_API_KEY` – *optional*; leave **unsynced** if you do not have a Gemini key.

### 2.2 Deploy via Render Web UI
1. Log in to **Render.com** and create a new **Web Service**.
2. Connect the service to the GitHub repo you just pushed.
3. In the *Service Settings* panel, **replace** the automatically generated `render.yaml` with the one in the repo (or simply let Render detect it).
4. Set the **Environment Variables**:
   - `PORT` – keep as `10000` (Render will override with its own port if needed).
   - `CLIENT_URL` – **do not modify**; the frontend will use the Vite environment variable at runtime.
   - `GEMINI_API_KEY` – optional; leave blank for deterministic rule engine.
5. Click **Create Web Service**. Render will run `npm install` and then `npm start`.
6. After the service is live, note the **service URL** (e.g. `https://credence-ai-backend.onrender.com`). This URL will be used in the frontend configuration.

---

## 3. Frontend – Vercel Deployment

### 3.1 Vercel Configuration (`vercel.json`)
The repository already contains `vercel.json` with the following important settings:
```json
{
  "builds": [{ "src": "client/package.json", "use": "@vercel/static-build", "config": { "distDir": "client/dist" } }]
}
```
Vercel will run `npm run build` inside the `client` directory.

### 3.2 Environment Variable
Create a Vercel environment variable named `VITE_API_BASE_URL` with **the Render backend URL** you obtained in step 2 (e.g. `https://credence-ai-backend.onrender.com`).
- **Do not** set a value for development; Vite will fallback to `http://localhost:5000` when `import.meta.env.DEV` is true.
- The variable is prefixed with `VITE_`, therefore it will be exposed to the client bundle – **only public URLs** should be stored here.

### 3.3 Deploy via Vercel Web UI
1. Log in to **Vercel.com** and click **New Project**.
2. Import the GitHub repository.
3. In the *Root Directory* field, set `client`.
4. Add the environment variable `VITE_API_BASE_URL` with the Render backend URL.
5. Click **Deploy**. Vercel will run `npm install` then `npm run build` and publish the `client/dist` folder.

---

## 4. Environment Files
- **`.env.example`** (included):
  ```env
  # Local development endpoint (Vite dev server)
  VITE_API_BASE_URL=http://localhost:5000

  # Production – replace with your Render URL or leave blank
  # VITE_API_BASE_URL=https://your-backend.onrender.com
  ```
- **`.gitignore`** already excludes real `.env` files, `node_modules/`, and the built `client/dist/` folder.

---

## 5. Running Locally (for verification)
```bash
# Backend
cd server
npm install
npm start   # runs on http://localhost:5000

# Frontend (dev mode)
cd ../client
npm install
npm run dev   # Vite dev server proxies to backend automatically
```
The verification engine can be run with:
```bash
npm run test:engine   # executes server/audit-test.js
```
All tests should pass (see `audit-test.js` output).

---

## 6. Final Checklist
- [x] Backend starts (`npm start`) and reports health endpoint.
- [x] Frontend production build succeeds (`npm run build`).
- [x] `npm run test:engine` passes all verification suites.
- [x] `.gitignore` protects `.env` files.
- [x] `render.yaml` does **not** run the server during the build step.
- [x] Mobile navigation (hamburger + slide‑in sidebar) works (verified manually).
- [x] No API keys or secrets are committed.
- [x] Documentation files (`README.md`, `DEPLOYMENT_GUIDE.md`, `FINAL_HANDOFF.md`) are present.

You can now submit the repository URL for the hackathon. All required functionality is operational.

