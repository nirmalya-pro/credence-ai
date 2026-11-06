import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_BRAND, DEMO_TRUTH_LEDGER, INITIAL_REVIEWS } from '../data/defaultData';
import { runRuleBasedVerification } from '../engine/verificationEngine';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  BRAND: 'credence_brand_v2',
  LEDGER: 'credence_ledger_v2',
  REVIEWS: 'credence_reviews_v2',
  SETTINGS: 'credence_settings_v2'
};

// Determine default API URL cleanly based on environment
const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

export function AppProvider({ children }) {
  // Mobile sidebar state (true = open) – defaults to false for small screens
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Brand state with persistent local storage
  const [brand, setBrand] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRAND);
      return saved ? JSON.parse(saved) : DEMO_BRAND;
    } catch {
      return DEMO_BRAND;
    }
  });

  // Truth Ledger state
  const [truthLedger, setTruthLedger] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEDGER);
      return saved ? JSON.parse(saved) : DEMO_TRUTH_LEDGER;
    } catch {
      return DEMO_TRUTH_LEDGER;
    }
  });

  // Reviews & audit trail state
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Settings state
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : {
        apiUrl: DEFAULT_API_URL,
        enableAiByDefault: false,
        reviewerName: 'Lead Compliance Reviewer',
        reviewerRole: 'Brand Governance Director'
      };
    } catch {
      return {
        apiUrl: DEFAULT_API_URL,
        enableAiByDefault: false,
        reviewerName: 'Lead Compliance Reviewer',
        reviewerRole: 'Brand Governance Director'
      };
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Currently focused review item
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  // Active draft for Content Checker
  const [activeDraft, setActiveDraft] = useState({
    title: '',
    contentType: 'Social Media Caption',
    content: '',
    verificationResult: null,
    isVerifying: false
  });

  // Backend connection status tracking
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'connected' | 'disconnected' | 'rules-only' | 'checking'
  const [backendMeta, setBackendMeta] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRAND, JSON.stringify(brand));
    } catch (e) {
      console.error('Failed to save brand to localStorage', e);
    }
  }, [brand]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(truthLedger));
    } catch (e) {
      console.error('Failed to save truth ledger to localStorage', e);
    }
  }, [truthLedger]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Live Backend Connection Health Check
  const checkBackendHealth = useCallback(async (customUrl = null) => {
    const targetUrl = customUrl || settings.apiUrl;
    if (!targetUrl || targetUrl.trim() === '') {
      setConnectionStatus('rules-only');
      setBackendMeta(null);
      return { ok: false, reason: 'rules-only' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${targetUrl.replace(/\/$/, '')}/api/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setConnectionStatus('connected');
        setBackendMeta(data);
        return { ok: true, data };
      } else {
        setConnectionStatus('disconnected');
        setBackendMeta(null);
        return { ok: false, error: `HTTP ${res.status}` };
      }
    } catch (err) {
      setConnectionStatus('disconnected');
      setBackendMeta(null);
      return { ok: false, error: err.message };
    }
  }, [settings.apiUrl]);

  // Check health on mount and when API URL changes
  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth]);

  // Brand Management Actions
  const updateBrand = (updatedBrand) => {
    setBrand(updatedBrand);
    showToast('Brand configuration updated successfully.', 'success');
  };

  // Truth Ledger Actions
  const addLedgerEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: entry.id || `BTL-${String(truthLedger.length + 1).padStart(3, '0')}`,
      version: 'v1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      changeHistory: [
        {
          version: 'v1.0',
          date: new Date().toISOString().split('T')[0],
          note: 'Initial truth record created.'
        }
      ]
    };
    setTruthLedger(prev => [newEntry, ...prev]);
    showToast(`Added truth record #${newEntry.id}`, 'success');
  };

  const updateLedgerEntry = (id, updatedFields) => {
    setTruthLedger(prev => prev.map(item => {
      if (item.id === id) {
        const currentVerNum = parseFloat(item.version?.replace('v', '') || '1.0');
        const nextVersion = `v${(currentVerNum + 0.1).toFixed(1)}`;
        const historyNote = updatedFields.historyNote || `Updated approved value to "${updatedFields.approvedValue}"`;

        return {
          ...item,
          ...updatedFields,
          version: nextVersion,
          lastUpdated: new Date().toISOString().split('T')[0],
          changeHistory: [
            {
              version: nextVersion,
              date: new Date().toISOString().split('T')[0],
              note: historyNote
            },
            ...(item.changeHistory || [])
          ]
        };
      }
      return item;
    }));
    showToast(`Updated record #${id}`, 'success');
  };

  const deleteLedgerEntry = (id) => {
    setTruthLedger(prev => prev.filter(item => item.id !== id));
    showToast(`Removed record #${id} from Truth Ledger`, 'info');
  };

  // Reset to original demonstration brand data
  const resetToDemoData = () => {
    setBrand(DEMO_BRAND);
    setTruthLedger(DEMO_TRUTH_LEDGER);
    setReviews(INITIAL_REVIEWS);
    showToast('Reset all workspace data to NovaFit Nutrition demonstration preset.', 'success');
  };

  // Core Verification Engine Invocation
  const verifyContent = async (contentToVerify, useAi = false) => {
    if (!contentToVerify || !contentToVerify.trim()) {
      showToast('Please enter marketing copy to verify.', 'error');
      return null;
    }

    setActiveDraft(prev => ({ ...prev, isVerifying: true }));

    let result = null;

    // If backend is configured, attempt backend verification
    if (settings.apiUrl && settings.apiUrl.trim() !== '') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(`${settings.apiUrl.replace(/\/$/, '')}/api/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: contentToVerify,
            brand,
            truthLedger,
            useAi
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          result = await response.json();
        }
      } catch (err) {
        console.warn('Backend verification unavailable. Running client-side deterministic rule engine.', err.message);
      }
    }

    // Reliable fallback to client deterministic rule engine
    if (!result) {
      result = runRuleBasedVerification(contentToVerify, brand, truthLedger);
    }

    setActiveDraft(prev => ({
      ...prev,
      content: contentToVerify,
      verificationResult: result,
      isVerifying: false
    }));

    if (result.findings.length > 0) {
      showToast(`Audit complete: ${result.findings.length} compliance issue(s) identified.`, 'warning');
    } else {
      showToast('Audit complete: Content 100% compliant with Brand Truth Ledger.', 'success');
    }

    return result;
  };

  // Submit Content for Human Review
  const submitForReview = ({ title, contentType, content, verificationResult }) => {
    const newReview = {
      id: `REV-${1000 + reviews.length + 1}`,
      title: title || `${contentType} Submission`,
      brandId: brand.id,
      brandName: brand.name,
      contentType: contentType || 'Social Media Caption',
      originalContent: content,
      suggestedCleanContent: verificationResult?.suggestedCleanContent || content,
      score: verificationResult?.score ?? 100,
      findings: verificationResult?.findings || [],
      reviewStatus: 'PENDING',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewerName: null,
      reviewerRole: null,
      comments: '',
      engine: verificationResult?.engine || 'deterministic-rules',
      history: [
        {
          action: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          by: 'Author / Marketer',
          notes: `Submitted with ${verificationResult?.findings?.length || 0} detected issue(s).`
        }
      ]
    };

    setReviews(prev => [newReview, ...prev]);
    showToast(`Submission #${newReview.id} routed to Review Centre.`, 'success');
    setSelectedReviewId(newReview.id);
    setActiveTab('review');
    return newReview;
  };

  // Review Decisions: APPROVE, REJECT, REQUEST_CHANGES
  const updateReviewDecision = (reviewId, { decision, reviewerName, reviewerRole, comments }) => {
    setReviews(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        const timestamp = new Date().toISOString();
        const actionLabel = decision === 'APPROVED' ? 'APPROVED' : decision === 'REJECTED' ? 'REJECTED' : 'CHANGES_REQUESTED';
        
        return {
          ...rev,
          reviewStatus: decision,
          reviewedAt: timestamp,
          reviewerName: reviewerName || settings.reviewerName,
          reviewerRole: reviewerRole || settings.reviewerRole,
          comments: comments || '',
          history: [
            {
              action: actionLabel,
              timestamp,
              by: `${reviewerName || settings.reviewerName} (${reviewerRole || settings.reviewerRole})`,
              notes: comments || `Status changed to ${decision}`
            },
            ...(rev.history || [])
          ]
        };
      }
      return rev;
    }));

    showToast(`Review #${reviewId} marked as ${decision}.`, 'success');
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    if (selectedReviewId === reviewId) setSelectedReviewId(null);
    showToast(`Removed review record #${reviewId}`, 'info');
  };

  const value = {
    isSidebarOpen,
    toggleSidebar,
    brand,
    updateBrand,
    truthLedger,
    addLedgerEntry,
    updateLedgerEntry,
    deleteLedgerEntry,
    reviews,
    submitForReview,
    updateReviewDecision,
    deleteReview,
    activeTab,
    setActiveTab,
    selectedReviewId,
    setSelectedReviewId,
    activeDraft,
    setActiveDraft,
    verifyContent,
    resetToDemoData,
    settings,
    setSettings,
    connectionStatus,
    backendMeta,
    checkBackendHealth,
    toast,
    showToast
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
