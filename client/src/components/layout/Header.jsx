import React from 'react';
import { Building2, RotateCcw, Cpu, Menu } from 'lucide-react';
<<<<<<< HEAD
import { useApp } from '../../context/AppContext';

export function Header() {
  const { brand, resetToDemoData, activeTab, connectionStatus, toggleSidebar } = useApp();
=======
const { brand, resetToDemoData, activeTab, connectionStatus, toggleSidebar } = useApp();
import { useApp } from '../../context/AppContext';

export function Header() {
  const { brand, resetToDemoData, activeTab, connectionStatus } = useApp();
>>>>>>> 5c7cbfa7fc7a1a7c61b748ab3370a60fb55f0875

  const tabTitles = {
    dashboard: 'Governance Overview',
    workspace: 'Brand Workspace',
    ledger: 'Brand Truth Ledger',
    checker: 'Content Checker',
    review: 'Review Centre',
    history: 'Review History',
    insights: 'Governance Insights',
    settings: 'Settings & Architecture'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-8 flex items-center justify-between sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Breadcrumb & Section Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Brand Governance</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-midnight-950 text-sm tracking-tight">{tabTitles[activeTab] || 'Workspace'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button onClick={toggleSidebar} className="lg:hidden flex items-center text-slate-500 hover:text-midnight-950">
          <Menu className="w-5 h-5" />
        </button>
        {/* Brand Header pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-midnight-950 shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-slate-700" />
          <span>{brand.name}</span>
        </div>

<<<<<<< HEAD
=======
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-midnight-950 shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-slate-700" />
          <span>{brand.name}</span>
        </div>

>>>>>>> 5c7cbfa7fc7a1a7c61b748ab3370a60fb55f0875
        {/* Backend Connection Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-lime-500 shadow-lime-sm' :
              connectionStatus === 'rules-only' ? 'bg-amber-500' : 'bg-slate-400'
            }`} />
          <span className="text-[11px]">
            {connectionStatus === 'connected' ? 'API Online' : 'Deterministic Rules'}
          </span>
        </div>

        {/* Quick Demo Reset Button */}
        <button
          onClick={resetToDemoData}
          title="Reset demonstration data to default state"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-midnight-950 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-all shadow-sm hover:shadow"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
}
