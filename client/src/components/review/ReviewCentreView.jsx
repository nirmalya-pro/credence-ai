import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  User, 
  History, 
  Send,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, SeverityBadge } from '../common/Badges';

export function ReviewCentreView() {
  const { 
    reviews, 
    selectedReviewId, 
    setSelectedReviewId, 
    updateReviewDecision, 
    deleteReview,
    settings 
  } = useApp();

  const activeReview = reviews.find(r => r.id === selectedReviewId) || reviews[0] || null;

  const [decision, setDecision] = useState('APPROVED');
  const [reviewerName, setReviewerName] = useState(settings.reviewerName || 'Lead Compliance Reviewer');
  const [reviewerRole, setReviewerRole] = useState(settings.reviewerRole || 'Brand Governance Director');
  const [comments, setComments] = useState('');

  const handleDecisionSubmit = (e) => {
    e.preventDefault();
    if (!activeReview) return;
    updateReviewDecision(activeReview.id, {
      decision,
      reviewerName,
      reviewerRole,
      comments
    });
    setComments('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-depth rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <ClipboardCheck className="w-4 h-4 text-midnight-950" />
            <span>Human Review & Governance</span>
          </div>
          <h1 className="text-xl font-extrabold text-midnight-950 tracking-tight">
            Review Centre
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Formal human compliance sign-off portal. Authorize publication, request factual amendments, or reject copy with an immutable audit log.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-lime-400/25 text-midnight-950 font-bold border border-lime-500/50 shadow-sm">
            {reviews.filter(r => r.reviewStatus === 'PENDING').length} Pending Decision
          </span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="card-depth rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-700 flex justify-between items-center">
              <span>Submissions Queue ({reviews.length})</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto bg-white">
              {reviews.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  No review submissions in queue.
                </div>
              ) : (
                reviews.map((rev) => {
                  const isSelected = activeReview?.id === rev.id;

                  return (
                    <div
                      key={rev.id}
                      onClick={() => setSelectedReviewId(rev.id)}
                      className={`p-3.5 text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-slate-100 border-l-4 border-l-lime-500 shadow-inner-subtle' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-[11px] font-bold text-midnight-950">{rev.id}</span>
                        <StatusBadge status={rev.reviewStatus} />
                      </div>
                      <div className="font-bold text-midnight-950 truncate">{rev.title}</div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between font-medium">
                        <span>{rev.contentType}</span>
                        <span className={rev.findings?.length > 0 ? 'text-amber-700 font-bold' : 'text-lime-700 font-bold'}>
                          {rev.findings?.length || 0} issues
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Active Review Detail & Action (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activeReview ? (
            <div className="space-y-5">
              {/* Submission Overview Card */}
              <div className="card-depth rounded-xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs text-midnight-950 font-bold bg-slate-100 px-2 py-0.5 rounded">{activeReview.id}</span>
                    <h2 className="text-base font-extrabold text-midnight-950 mt-1">{activeReview.title}</h2>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">
                      Submitted on {new Date(activeReview.submittedAt).toLocaleString()} • Channel: {activeReview.contentType}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={activeReview.reviewStatus} />
                    <button
                      onClick={() => deleteReview(activeReview.id)}
                      className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Comparison */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Submitted Copy
                  </span>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 leading-relaxed shadow-inner-subtle">
                    "{activeReview.originalContent}"
                  </div>
                </div>

                {activeReview.suggestedCleanContent && activeReview.suggestedCleanContent !== activeReview.originalContent && (
                  <div>
                    <span className="text-xs font-bold text-midnight-950 block mb-1">
                      Recommended Compliant Version
                    </span>
                    <div className="p-3.5 rounded-lg bg-lime-400/20 border border-lime-500/40 text-xs font-sans text-midnight-950 font-medium leading-relaxed shadow-sm">
                      "{activeReview.suggestedCleanContent}"
                    </div>
                  </div>
                )}

                {/* Findings Breakdown */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Verification Findings ({activeReview.findings?.length || 0})
                  </span>

                  {activeReview.findings && activeReview.findings.length > 0 ? (
                    <div className="space-y-2">
                      {activeReview.findings.map((f, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-midnight-950">{f.issueCategory}</span>
                            <div className="flex gap-1.5">
                              <SeverityBadge severity={f.severity} />
                              <StatusBadge status={f.status} />
                            </div>
                          </div>
                          <p className="text-slate-600">{f.explanation}</p>
                          <div className="text-[11px] text-midnight-950 font-bold">
                            Suggestion: "{f.suggestedCorrection}"
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-lg bg-lime-400/20 border border-lime-500/40 text-midnight-950 text-xs font-bold flex items-center gap-2 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-lime-700" />
                      <span>Zero policy violations detected. Content is 100% verified.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Decision Form */}
              <div className="card-depth rounded-xl p-6 space-y-4">
                <div className="border-b border-slate-100 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-midnight-950" />
                  <h3 className="font-extrabold text-sm text-midnight-950">Record Compliance Decision</h3>
                </div>

                <form onSubmit={handleDecisionSubmit} className="space-y-4 text-xs">
                  {/* 3 Decision Selector Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setDecision('APPROVED')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-bold transition-all shadow-sm ${
                        decision === 'APPROVED'
                          ? 'bg-lime-400/25 border-lime-500 text-midnight-950 ring-2 ring-lime-500/40'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-lime-700" />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('CHANGES_REQUESTED')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-bold transition-all shadow-sm ${
                        decision === 'CHANGES_REQUESTED'
                          ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/30'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('REJECTED')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-bold transition-all shadow-sm ${
                        decision === 'REJECTED'
                          ? 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-500/30'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-red-700" />
                      <span>Reject</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Reviewer Name</label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Reviewer Role / Title</label>
                      <input
                        type="text"
                        value={reviewerRole}
                        onChange={(e) => setReviewerRole(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Reviewer Feedback / Directive Notes
                    </label>
                    <textarea
                      rows={2}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add compliance notes or revision instructions..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="btn-dark px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5 text-lime-400" />
                      <span>Commit Decision to Audit Trail</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Audit Trail Timeline */}
              <div className="card-depth rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <History className="w-4 h-4 text-midnight-950" />
                  <h3 className="font-extrabold text-sm text-midnight-950">Audit Trail History</h3>
                </div>

                <div className="relative border-l-2 border-slate-200 ml-2 space-y-4 py-2 text-xs">
                  {activeReview.history && activeReview.history.map((step, idx) => (
                    <div key={idx} className="ml-4 relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-midnight-950 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-midnight-950">{step.action}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(step.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-slate-600 mt-0.5">By: <span className="font-bold text-midnight-950">{step.by}</span></div>
                      {step.notes && (
                        <p className="text-slate-700 mt-1 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 shadow-inner-subtle">
                          "{step.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-depth rounded-xl p-8 text-center text-slate-500 text-xs">
              Select a submission from the queue on the left to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
