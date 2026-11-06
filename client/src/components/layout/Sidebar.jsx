import React from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  Database,
  FileCheck2,
  ClipboardCheck,
  History,
  BarChart3,
  Settings,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Sidebar() {
  const { activeTab, setActiveTab, reviews, brand, connectionStatus, isSidebarOpen, toggleSidebar } = useApp();

  const pendingCount = reviews.filter(r => r.reviewStatus === 'PENDING').length;

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace', label: 'Brand Workspace', icon: Building2 },
    { id: 'ledger', label: 'Brand Truth Ledger', icon: Database },
    { id: 'checker', label: 'Content Checker', icon: FileCheck2 },
    { id: 'review', label: 'Review Centre', icon: ClipboardCheck, badge: pendingCount },
    { id: 'history', label: 'Review History', icon: History },
    { id: 'insights', label: 'Governance Insights', icon: BarChart3 },
  ];

  const systemNavItems = [
    { id: 'settings', label: 'Settings & Architecture', icon: Settings }
  ];

  return (
    <aside className={`w-64 bg-midnight-950 text-slate-300 flex flex-col border-r border-midnight-800/90 select-none min-h-screen flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.12)] z-30 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}
    >
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-2">
        <button onClick={toggleSidebar} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Brand Header with 3D depth */}
      <div className="p-5 border-b border-midnight-800/80 bg-midnight-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-midnight-900 border border-midnight-700/80 flex items-center justify-center text-lime-500 flex-shrink-0 font-bold shadow-[0_2px_10px_rgba(198,244,50,0.15)]">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5 leading-none">
              CREDENCE <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-lime-500 text-midnight-950 rounded shadow-lime-sm">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 truncate font-medium">
              Confidence in Every Brand Claim
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Operations
          </div>
          <div className="space-y-1">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); toggleSidebar && toggleSidebar(); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-midnight-850 text-white font-semibold shadow-inner border border-midnight-700'
                      : 'text-slate-400 hover:text-white hover:bg-midnight-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-lime-500' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded bg-lime-500 text-midnight-950 shadow-lime-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Platform System
          </div>
          <div className="space-y-1">
            {systemNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); toggleSidebar && toggleSidebar(); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-midnight-850 text-white font-semibold shadow-inner border border-midnight-700'
                      : 'text-slate-400 hover:text-white hover:bg-midnight-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-lime-500' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Enterprise Status Footer */}
      <div className="p-4 border-t border-midnight-800/80 bg-midnight-950 text-xs">
        <div className="p-3 rounded-lg bg-midnight-900 border border-midnight-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] font-bold truncate">{brand.name}</span>
            <span className="text-[10px] text-lime-400 font-mono font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] pt-0.5">
            <span className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-lime-500 shadow-lime-sm animate-pulse' :
              connectionStatus === 'rules-only' ? 'bg-amber-400' : 'bg-slate-500'
            }`} />
            <span className="text-slate-400">
              {connectionStatus === 'connected' ? 'API Online' :
               connectionStatus === 'rules-only' ? 'Deterministic Engine' : 'Offline Mode'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
