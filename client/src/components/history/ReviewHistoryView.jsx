import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, SeverityBadge } from '../common/Badges';

export function ReviewHistoryView() {
  const { reviews, setSelectedReviewId, setActiveTab, deleteReview } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectModalRev, setInspectModalRev] = useState(null);

  const filtered = reviews.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.contentType.toLowerCase().includes(search.toLowerCase()) ||
      r.originalContent.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.reviewStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenInReviewCentre = (id) => {
    setSelectedReviewId(id);
    setActiveTab('review');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-depth rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <History className="w-4 h-4 text-midnight-950" />
            <span>Audit Trail & Records</span>
          </div>
          <h1 className="text-xl font-extrabold text-midnight-950 tracking-tight">
            Review History & Archive
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Historical audit log of all marketing copy submissions, detected compliance findings, and human approval decisions.
          </p>
        </div>

        <div className="text-xs font-bold text-midnight-950 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto">
          {reviews.length} Audited Records
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, draft title, channel, or phrase..."
            className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mr-1" />
          {['ALL', 'PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'btn-dark'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="card-depth rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-28">Review ID</th>
                <th className="py-3 px-4">Subject & Excerpt</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Issues</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sign-Off Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs font-medium">
                    No historical records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-midnight-950">
                      {rev.id}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-midnight-950 truncate">{rev.title}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        "{rev.originalContent}"
                      </div>
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
                        <span className="font-bold text-amber-700">
                          {rev.findings.length} flagged
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={rev.reviewStatus} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap font-medium">
                      {rev.reviewedAt ? new Date(rev.reviewedAt).toLocaleDateString() : 'Pending'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setInspectModalRev(rev)}
                          className="p-1.5 text-slate-500 hover:text-midnight-950 hover:bg-slate-100 rounded transition-colors"
                          title="Inspect record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenInReviewCentre(rev.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-[11px] text-midnight-950 rounded-md transition-colors shadow-sm"
                        >
                          Review Centre
                        </button>
                        <button
                          onClick={() => deleteReview(rev.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {inspectModalRev && (
        <div className="fixed inset-0 z-50 bg-midnight-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-midnight-950 font-bold bg-slate-100 px-2 py-0.5 rounded">{inspectModalRev.id}</span>
                <h3 className="font-extrabold text-midnight-950 text-base mt-1">{inspectModalRev.title}</h3>
              </div>
              <button onClick={() => setInspectModalRev(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Submitted Copy</span>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 leading-relaxed shadow-inner-subtle">
                  "{inspectModalRev.originalContent}"
                </div>
              </div>

              {inspectModalRev.suggestedCleanContent && (
                <div>
                  <span className="font-bold text-midnight-950 block mb-1">Recommended Compliant Version</span>
                  <div className="p-3.5 bg-lime-400/20 rounded-lg border border-lime-500/40 text-midnight-950 font-medium leading-relaxed shadow-sm">
                    "{inspectModalRev.suggestedCleanContent}"
                  </div>
                </div>
              )}

              <div>
                <span className="font-bold text-slate-700 block mb-1">
                  Findings ({inspectModalRev.findings?.length || 0})
                </span>
                {inspectModalRev.findings?.length > 0 ? (
                  <div className="space-y-2">
                    {inspectModalRev.findings.map((f, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-midnight-950">{f.issueCategory}</span>
                          <SeverityBadge severity={f.severity} />
                        </div>
                        <p className="text-slate-600">{f.explanation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-lime-700 font-bold">None</p>
                )}
              </div>

              {inspectModalRev.comments && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Reviewer Sign-off Notes</span>
                  <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800 italic shadow-inner-subtle">
                    "{inspectModalRev.comments}"
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  handleOpenInReviewCentre(inspectModalRev.id);
                  setInspectModalRev(null);
                }}
                className="text-xs font-bold text-midnight-950 hover:underline"
              >
                Open in Review Centre
              </button>
              <button
                onClick={() => setInspectModalRev(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
