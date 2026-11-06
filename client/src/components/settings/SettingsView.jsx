import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  User, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Terminal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function SettingsView() {
  const { 
    settings, 
    setSettings, 
    resetToDemoData, 
    showToast,
    connectionStatus,
    backendMeta,
    checkBackendHealth
  } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);

  const isDevMode = import.meta.env.DEV;
  const envModeName = isDevMode ? 'Local Development' : 'Production';

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formData);
    showToast('Settings saved successfully.', 'success');
  };

  const handleManualTest = async () => {
    setIsTesting(true);
    const result = await checkBackendHealth(formData.apiUrl);
    setIsTesting(false);
    setTestResult(result);
    if (result.ok) {
      showToast('Connected to CREDENCE AI verification backend.', 'success');
    } else {
      showToast('Backend verification service is unreachable. Running in rules-only mode.', 'warning');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card-depth rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Settings className="w-4 h-4 text-midnight-950" />
            <span>System Configuration</span>
          </div>
          <h1 className="text-xl font-extrabold text-midnight-950 tracking-tight">
            Settings & Architecture
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Manage verification backend connectivity, reviewer sign-off personas, and deployment parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={resetToDemoData}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-all shadow-sm hover:shadow flex items-center gap-1.5 self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Connection & Verification Engine Status */}
        <div className="card-depth rounded-xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-midnight-950" />
              <h2 className="text-sm font-extrabold text-midnight-950">System Status & Engine Mode</h2>
            </div>
            <span className="text-[11px] font-mono font-bold text-midnight-950 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
              Mode: {envModeName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backend Service Status Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 shadow-inner-subtle">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                Backend Verification Service
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-lime-500 shadow-lime-sm' :
                  connectionStatus === 'rules-only' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span className="font-extrabold text-xs text-midnight-950">
                  {connectionStatus === 'connected' && 'Connected (API Online)'}
                  {connectionStatus === 'disconnected' && 'Disconnected (Offline)'}
                  {connectionStatus === 'rules-only' && 'Rules-Only Mode (Client-Side)'}
                  {connectionStatus === 'checking' && 'Verifying Connectivity...'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {connectionStatus === 'connected' && `Service responding on ${formData.apiUrl || 'configured host'}. Full backend API verification active.`}
                {connectionStatus === 'disconnected' && 'The backend server is not running or unreachable. The system seamlessly runs the deterministic rule engine locally in your browser.'}
                {connectionStatus === 'rules-only' && 'No remote API endpoint configured. The platform operates 100% deterministically in your browser with zero network dependencies.'}
              </p>
            </div>

            {/* AI Provider Status Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 shadow-inner-subtle">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                AI Intelligence Provider
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  backendMeta?.geminiConfigured ? 'bg-lime-500 shadow-lime-sm' : 'bg-slate-400'
                }`} />
                <span className="font-extrabold text-xs text-midnight-950">
                  {backendMeta?.geminiConfigured ? 'Google Gemini AI Configured' : 'Deterministic Rule Engine Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {backendMeta?.geminiConfigured 
                  ? 'Gemini API key verified in backend environment. Semantic nuance checks enabled.' 
                  : 'Operating via deterministic JavaScript rules. 100% factual, zero-hallucination, zero external API key requirements.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Reviewer Persona Defaults */}
        <div className="card-depth rounded-xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-midnight-950" />
            <h2 className="text-sm font-extrabold text-midnight-950">Reviewer Persona Defaults</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Default Reviewer Name
              </label>
              <input
                type="text"
                value={formData.reviewerName}
                onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Reviewer Designation / Title
              </label>
              <input
                type="text"
                value={formData.reviewerRole}
                onChange={(e) => setFormData({ ...formData, reviewerRole: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Developer & Deployment Diagnostics (Collapsible) */}
        <div className="card-depth rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-midnight-950" />
              <h2 className="text-sm font-extrabold text-midnight-950">Developer & Endpoint Diagnostics</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowDeveloperPanel(!showDeveloperPanel)}
              className="text-xs font-bold text-midnight-950 hover:underline"
            >
              {showDeveloperPanel ? 'Hide Details' : 'Show Advanced Settings'}
            </button>
          </div>

          {showDeveloperPanel ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Backend API Base URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.apiUrl}
                    onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                    placeholder="e.g. http://localhost:5000 or your Render backend URL"
                    className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none font-mono text-xs shadow-inner-subtle"
                  />
                  <button
                    type="button"
                    onClick={handleManualTest}
                    disabled={isTesting}
                    className="btn-dark px-4 py-2 rounded-lg font-bold"
                  >
                    {isTesting ? 'Pinging...' : 'Test Endpoint'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Default local endpoint: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">http://localhost:5000</code>. On Render, set <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">VITE_API_BASE_URL</code> to your deployed Render URL.
                </p>
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-lg border text-xs shadow-sm ${testResult.ok ? 'bg-lime-400/20 border-lime-500/40 text-midnight-950 font-bold' : 'bg-amber-50 border-amber-200 text-amber-950'}`}>
                  {testResult.ok ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-lime-700" />
                      <span>Endpoint verified successfully: {testResult.data.service} (Version {testResult.data.version})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>Endpoint failed to respond ({testResult.error || 'Connection refused'}). System will use client-side rules.</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-slate-600 shadow-inner-subtle">
                <div className="font-bold text-midnight-950 text-[11px] uppercase tracking-wider">
                  Deployment Architecture Note
                </div>
                <p className="text-[11px] leading-relaxed">
                  During development on your computer, the backend runs locally on <code className="bg-slate-200 px-1 py-0.2 rounded font-mono font-bold">localhost</code>. 
                  When deploying to production (such as Vercel + Render), set the environment variable <code className="bg-slate-200 px-1 py-0.2 rounded font-mono font-bold">VITE_API_BASE_URL</code> in your Vercel deployment dashboard to your live public Render URL.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              Active endpoint: <span className="font-mono text-midnight-950 font-bold">{formData.apiUrl || 'Client Deterministic Engine'}</span>. Click "Show Advanced Settings" to configure endpoints or run diagnostic pings.
            </p>
          )}
        </div>

        {/* Section 4: Regulatory & Legal Disclaimer */}
        <div className="card-depth rounded-xl p-4 text-xs text-slate-600 space-y-1 bg-slate-50">
          <div className="flex items-center gap-2 font-bold text-midnight-950">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>Legal & Regulatory Governance Statement</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Credence AI is an internal brand governance, factual alignment, and editorial compliance system. All checks are performed strictly against corporate guidelines and uploaded Brand Truth Ledger entries. It does not replace statutory, legal, or regulatory counsel.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-lime px-6 py-2.5 rounded-lg text-xs shadow-lime-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
