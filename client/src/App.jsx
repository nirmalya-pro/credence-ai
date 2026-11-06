import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { BrandWorkspaceView } from './components/workspace/BrandWorkspaceView';
import { TruthLedgerView } from './components/ledger/TruthLedgerView';
import { ContentCheckerView } from './components/checker/ContentCheckerView';
import { ReviewCentreView } from './components/review/ReviewCentreView';
import { ReviewHistoryView } from './components/history/ReviewHistoryView';
import { InsightsView } from './components/insights/InsightsView';
import { SettingsView } from './components/settings/SettingsView';
import { Toast } from './components/common/Toast';

function MainContent() {
  const { activeTab } = useApp();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 overflow-x-hidden min-w-0">
      <Header />
      <main className="flex-1 px-8 py-6 max-w-[1600px] w-full mx-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'workspace' && <BrandWorkspaceView />}
        {activeTab === 'ledger' && <TruthLedgerView />}
        {activeTab === 'checker' && <ContentCheckerView />}
        {activeTab === 'review' && <ReviewCentreView />}
        {activeTab === 'history' && <ReviewHistoryView />}
        {activeTab === 'insights' && <InsightsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
      <footer className="py-3.5 px-8 border-t border-slate-200/80 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-midnight-950 tracking-tight">CREDENCE AI</span>
          <span>•</span>
          <span className="font-medium text-slate-600">Confidence in Every Brand Claim</span>
        </div>
        <div className="text-slate-400 font-mono text-[11px] font-semibold">
          v1.2.0 • Evidence-First Brand Governance
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar />
        <MainContent />
        <Toast />
      </div>
    </AppProvider>
  );
}
