import React from 'react';
import { 
  FileCheck2, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badges';

export function DashboardView() {
  const { reviews, brand, truthLedger, setActiveTab, setSelectedReviewId } = useApp();

  const totalReviews = reviews.length;
  const totalIssuesDetected = reviews.reduce((sum, r) => sum + (r.findings?.length || 0), 0);
  const pendingApprovals = reviews.filter(r => r.reviewStatus === 'PENDING').length;
  const approvedCount = reviews.filter(r => r.reviewStatus === 'APPROVED').length;
  const rejectedCount = reviews.filter(r => r.reviewStatus === 'REJECTED').length;

  const handleOpenReview = (id) => {
    setSelectedReviewId(id);
    setActiveTab('review');
  };

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner with Midnight Black & Lime Green 3D Depth */}
      <div className="bg-midnight-950 text-white rounded-xl p-7 border border-midnight-800 shadow-[0_10px_30px_rgba(11,11,12,0.18)] relative overflow-hidden">
        {/* Subtle geometric 3D background accent */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-lime-500/10 via-transparent to-transparent pointer-events-none rounded-bl-full" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-midnight-900 border border-midnight-700/80 text-lime-400 text-xs font-bold mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-lime-500" />
            <span>Brand Governance Dashboard</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Confidence in Every Brand Claim.
          </h1>

          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Verify marketing copy against the authoritative <strong className="text-white font-bold">{brand.name}</strong> Brand Truth Ledger. Detect commercial pricing revisions, prohibited vocabulary, and unverified efficacy promises before publication.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('checker')}
              className="btn-lime px-4 py-2.5 rounded-lg text-xs flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Verify New Marketing Content</span>
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className="btn-dark px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-lime-400" />
              <span>Inspect Truth Ledger ({truthLedger.length} Facts)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Metric Cards with 3D Hover Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card-depth-hover p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Audits</span>
            <FileCheck2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-midnight-950">{totalReviews}</span>
            <span className="text-xs text-slate-500">records</span>
          </div>
        </div>

        <div className="card-depth-hover p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Issues Caught</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{totalIssuesDetected}</span>
            <span className="text-xs text-slate-500">findings</span>
          </div>
        </div>

        <div className="card-depth-hover p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Sign-Off</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-sky-700">{pendingApprovals}</span>
            <span className="text-xs text-slate-500">in queue</span>
          </div>
        </div>

        <div className="card-depth-hover p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Approved Copy</span>
            <CheckCircle2 className="w-4 h-4 text-lime-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-midnight-950">{approvedCount}</span>
            <span className="text-xs font-bold text-lime-700">cleared</span>
          </div>
        </div>

        <div className="card-depth-hover p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Rejected Copy</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-700">{rejectedCount}</span>
            <span className="text-xs text-slate-500">blocked</span>
          </div>
        </div>
      </div>

      {/* Split Grid: Activity Table & Truth Ledger Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Audits Table (8 cols) */}
        <div className="lg:col-span-8 card-depth rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div>
              <h3 className="font-bold text-sm text-midnight-950">Recent Content Reviews</h3>
              <p className="text-xs text-slate-500 mt-0.5">Chronological record of recent submissions and compliance findings</p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-bold text-midnight-950 hover:text-lime-700 flex items-center gap-1 transition-colors"
            >
              <span>Full Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1 bg-white">
            {reviews.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No content reviews logged. Launch your first check in the Content Checker.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Compliance</th>
                    <th className="py-3 px-4">Issues</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.slice(0, 5).map((rev) => (
                    <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-midnight-950">{rev.title}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">{rev.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {rev.contentType}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-extrabold ${rev.score >= 80 ? 'text-lime-700' : rev.score >= 50 ? 'text-amber-700' : 'text-red-700'}`}>
                          {rev.score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {rev.findings?.length > 0 ? (
                          <span className="font-semibold text-amber-700">
                            {rev.findings.length} flagged
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={rev.reviewStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenReview(rev.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-midnight-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all shadow-sm hover:shadow"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Truth Directives Card with Lime Accents (4 cols) */}
        <div className="lg:col-span-4 card-depth rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-midnight-950">Active Brand Policy</h3>
              <p className="text-xs text-slate-500 font-medium">{brand.name}</p>
            </div>
            <button
              onClick={() => setActiveTab('workspace')}
              className="text-xs font-bold text-midnight-950 hover:underline"
            >
              Configure
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                Approved Communication Style
              </span>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium shadow-inner-subtle">
                {brand.tone}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                Product Commercial Pricing
              </span>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 font-medium shadow-inner-subtle">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">{brand.products[0]?.name || 'Protein Blend'}:</span>
                  <span className="font-extrabold text-midnight-950">{brand.products[0]?.approvedPrice}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Superseded Price:</span>
                  <span className="line-through">{brand.products[0]?.previousPrice}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                Terminology Guidelines
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-lime-400/20 border border-lime-500/40 text-midnight-950 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-lime-900 block">Approved</span>
                  <span className="font-extrabold">{brand.approvedTerms[0] || 'Affordable'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-red-700 block">Prohibited</span>
                  <span className="font-extrabold">{brand.prohibitedTerms[0] || 'Cheap'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('checker')}
                className="w-full py-2.5 btn-dark rounded-lg font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Audit Demonstration Copy</span>
                <ArrowRight className="w-3.5 h-3.5 text-lime-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
