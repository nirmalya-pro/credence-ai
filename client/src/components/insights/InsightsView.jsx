import React from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function InsightsView() {
  const { reviews } = useApp();

  const allFindings = reviews.flatMap(r => r.findings || []);

  const categoryCounts = allFindings.reduce((acc, f) => {
    const cat = f.issueCategory || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  const phraseCounts = allFindings.reduce((acc, f) => {
    if (f.originalText && f.originalText !== 'Missing Brand Attribution') {
      const phrase = f.originalText.toLowerCase().trim();
      acc[phrase] = (acc[phrase] || 0) + 1;
    }
    return acc;
  }, {});
  const sortedPhrases = Object.entries(phraseCounts).sort((a, b) => b[1] - a[1]);

  const statusCounts = allFindings.reduce((acc, f) => {
    const st = f.status || 'UNVERIFIED';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const guidelineViolations = allFindings.reduce((acc, f) => {
    const ref = f.sourceReference || 'General Brand Directive';
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {});
  const sortedGuidelines = Object.entries(guidelineViolations).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-depth rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <BarChart3 className="w-4 h-4 text-midnight-950" />
            <span>Governance Analytics</span>
          </div>
          <h1 className="text-xl font-extrabold text-midnight-950 tracking-tight">
            Governance & Error Insights
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Empirical compliance analytics computed strictly from your stored review history. Identifies recurring vocabulary errors, pricing confusion, and training opportunities.
          </p>
        </div>

        <div className="text-xs font-bold text-midnight-950 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto">
          Based on {reviews.length} Audits ({allFindings.length} Total Findings)
        </div>
      </div>

      {allFindings.length === 0 ? (
        <div className="card-depth rounded-xl p-12 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-lime-600 mx-auto" />
          <h2 className="font-extrabold text-midnight-950 text-sm">No Compliance Violations Recorded</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Once you audit marketing drafts with detected compliance issues, empirical recurring error trends and vocabulary frequencies will populate here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Issue Categories with Lime Progress Bars */}
          <div className="card-depth rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-extrabold text-midnight-950">Most Frequent Issue Categories</h2>
            </div>

            <div className="space-y-3.5">
              {sortedCategories.slice(0, 5).map(([category, count]) => {
                const percentage = Math.round((count / allFindings.length) * 100);
                return (
                  <div key={category} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-midnight-950">{category}</span>
                      <span className="font-mono text-slate-500 font-semibold">{count} occurrences ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner-subtle">
                      <div
                        className="bg-lime-500 h-full rounded-full transition-all shadow-lime-sm"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Frequently Attempted Prohibited Phrases */}
          <div className="card-depth rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-extrabold text-midnight-950">Frequently Flagged Vocabulary</h2>
            </div>

            <div className="space-y-2">
              {sortedPhrases.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No recurring phrases identified.</p>
              ) : (
                sortedPhrases.slice(0, 5).map(([phrase, count]) => (
                  <div
                    key={phrase}
                    className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between text-xs shadow-sm"
                  >
                    <span className="font-mono font-bold text-red-950">"{phrase}"</span>
                    <span className="font-bold text-red-800 text-[11px] bg-red-100 px-2 py-0.5 rounded">
                      {count} {count === 1 ? 'occurrence' : 'occurrences'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Guidelines Causing Friction */}
          <div className="card-depth rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-midnight-950" />
              <h2 className="text-sm font-extrabold text-midnight-950">Guidelines Causing Content Friction</h2>
            </div>

            <div className="space-y-2.5 text-xs">
              {sortedGuidelines.slice(0, 4).map(([guide, count]) => (
                <div key={guide} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 shadow-inner-subtle">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-midnight-950">{guide}</span>
                    <span className="text-[11px] font-mono font-extrabold text-midnight-950 bg-slate-200 px-2 py-0.5 rounded">{count} flags</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    High violation rate indicates guideline ambiguity or a training opportunity for the copy team.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidentiary Status Distribution with 3D Depth */}
          <div className="card-depth rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-midnight-950" />
              <h2 className="text-sm font-extrabold text-midnight-950">Evidentiary Status Distribution</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-red-700 block">Contradicted</span>
                <span className="text-2xl font-extrabold text-red-950 mt-1 block">{statusCounts['CONTRADICTED'] || 0}</span>
                <p className="text-[10px] text-red-800 mt-0.5 font-medium">Clashes with approved pricing or facts.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Outdated</span>
                <span className="text-2xl font-extrabold text-purple-950 mt-1 block">{statusCounts['OUTDATED'] || 0}</span>
                <p className="text-[10px] text-purple-800 mt-0.5 font-medium">Matches superseded prices or facts.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Unverified</span>
                <span className="text-2xl font-extrabold text-amber-950 mt-1 block">{statusCounts['UNVERIFIED'] || 0}</span>
                <p className="text-[10px] text-amber-800 mt-0.5 font-medium">Hyperbolic claim lacking clinical proof.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">Tone / Style</span>
                <span className="text-2xl font-extrabold text-midnight-950 mt-1 block">{statusCounts['UNCERTAIN'] || 0}</span>
                <p className="text-[10px] text-slate-600 mt-0.5 font-medium">Slang or missing brand attribution.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
