import React from 'react';

export function SeverityBadge({ severity }) {
  const styles = {
    Critical: 'bg-red-50 text-red-800 border-red-200 shadow-sm',
    High: 'bg-orange-50 text-orange-800 border-orange-200 shadow-sm',
    Medium: 'bg-amber-50 text-amber-900 border-amber-200 shadow-sm',
    Low: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const current = styles[severity] || styles.Low;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${current}`}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    VERIFIED: 'bg-lime-400/20 text-lime-900 border-lime-500/40 font-semibold',
    CONTRADICTED: 'bg-red-50 text-red-800 border-red-200',
    OUTDATED: 'bg-purple-50 text-purple-800 border-purple-200',
    UNVERIFIED: 'bg-amber-50 text-amber-900 border-amber-200',
    UNCERTAIN: 'bg-slate-100 text-slate-700 border-slate-300',
    APPROVED: 'bg-lime-400/25 text-midnight-950 border-lime-500/50 font-bold',
    REJECTED: 'bg-red-50 text-red-800 border-red-200',
    PENDING: 'bg-sky-50 text-sky-800 border-sky-200',
    CHANGES_REQUESTED: 'bg-amber-50 text-amber-900 border-amber-200'
  };

  const current = styles[status] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] tracking-wide border shadow-sm ${current}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function EngineBadge({ engine }) {
  if (engine === 'gemini-ai') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-midnight-950 text-white border border-midnight-700 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></span>
        AI Grounding Engine
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
      Deterministic Rule Engine
    </span>
  );
}
