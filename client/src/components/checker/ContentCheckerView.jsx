import React, { useState } from 'react';
import { 
  FileCheck2, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Wand2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_CONTENT_PRESET } from '../../data/defaultData';
import { SeverityBadge, StatusBadge, EngineBadge } from '../common/Badges';

export function ContentCheckerView() {
  const { 
    brand, 
    verifyContent, 
    submitForReview, 
    activeDraft, 
    setActiveDraft, 
    showToast,
    settings 
  } = useApp();

  const [useAi, setUseAi] = useState(settings.enableAiByDefault || false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedFull, setCopiedFull] = useState(false);

  const contentTypes = [
    'Social Media Caption',
    'Advertisement Copy',
    'Website Copy',
    'Email Newsletter',
    'Product Packaging',
    'Press Release'
  ];

  const handleLoadDemo = () => {
    setActiveDraft({
      title: DEMO_CONTENT_PRESET.title,
      contentType: DEMO_CONTENT_PRESET.contentType,
      content: DEMO_CONTENT_PRESET.content,
      verificationResult: null,
      isVerifying: false
    });
    showToast('Loaded NovaFit Nutrition demonstration marketing copy.', 'info');
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!activeDraft.content.trim()) {
      showToast('Please provide marketing copy to verify.', 'error');
      return;
    }
    await verifyContent(activeDraft.content, useAi);
  };

  const handleApplySingleCorrection = (originalText, correction) => {
    if (!originalText || !correction) return;
    const updatedContent = activeDraft.content.replace(originalText, correction);
    setActiveDraft(prev => ({
      ...prev,
      content: updatedContent
    }));
    showToast(`Applied: "${correction}"`, 'success');
  };

  const handleApplyAllCorrections = () => {
    if (!activeDraft.verificationResult?.suggestedCleanContent) return;
    const cleanContent = activeDraft.verificationResult.suggestedCleanContent;
    setActiveDraft(prev => ({
      ...prev,
      content: cleanContent
    }));
    showToast('Applied recommended corrections to editor.', 'success');
  };

  const handleCopyFullClean = () => {
    if (!activeDraft.verificationResult?.suggestedCleanContent) return;
    navigator.clipboard.writeText(activeDraft.verificationResult.suggestedCleanContent);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
    showToast('Copied compliant copy to clipboard.', 'info');
  };

  const handleCopySingle = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    showToast('Copied correction snippet.', 'info');
  };

  const handleSubmitReview = () => {
    if (!activeDraft.content.trim()) return;
    submitForReview({
      title: activeDraft.title || `${activeDraft.contentType} Draft`,
      contentType: activeDraft.contentType,
      content: activeDraft.content,
      verificationResult: activeDraft.verificationResult
    });
  };

  const result = activeDraft.verificationResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-depth rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <FileCheck2 className="w-4 h-4 text-midnight-950" />
            <span>Pre-Flight Verification</span>
          </div>
          <h1 className="text-xl font-extrabold text-midnight-950 tracking-tight">
            Content Checker
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Audit draft marketing copy against verified brand records before publication. Flags commercial price revisions, banned vocabulary, informal slang, and unsupported efficacy claims.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDemo}
          className="btn-dark px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 self-start md:self-auto"
        >
          <FileText className="w-4 h-4 text-lime-400" />
          <span>Load Demonstration Copy</span>
        </button>
      </div>

      {/* Editor & Results Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card-depth rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Draft Title / Subject
                </label>
                <input
                  type="text"
                  value={activeDraft.title}
                  onChange={(e) => setActiveDraft({ ...activeDraft, title: e.target.value })}
                  placeholder="e.g. Q1 Instagram Product Promo"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Distribution Channel
                </label>
                <select
                  value={activeDraft.contentType}
                  onChange={(e) => setActiveDraft({ ...activeDraft, contentType: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none shadow-inner-subtle font-medium"
                >
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Marketing Copy to Audit
                </label>
                <span className="text-[11px] text-slate-400 font-mono font-medium">
                  {activeDraft.content.length} characters
                </span>
              </div>
              <textarea
                rows={6}
                value={activeDraft.content}
                onChange={(e) => setActiveDraft({ ...activeDraft, content: e.target.value })}
                placeholder="Paste marketing copy, promotional email, or social caption here..."
                className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-lg focus:border-midnight-950 focus:outline-none font-sans leading-relaxed shadow-inner-subtle"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAi}
                  onChange={(e) => setUseAi(e.target.checked)}
                  className="w-4 h-4 rounded text-midnight-950 focus:ring-0 border-slate-300 accent-lime-500"
                />
                <span className="font-semibold text-slate-800">Optional Gemini AI Assist</span>
                <span className="text-[10px] text-slate-400">(Backend proxy)</span>
              </label>

              <button
                type="button"
                onClick={handleVerify}
                disabled={activeDraft.isVerifying || !activeDraft.content.trim()}
                className="btn-lime px-5 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lime-sm"
              >
                {activeDraft.isVerifying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying against Truth Ledger...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Run Verification</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Reference Grounding Box */}
          <div className="card-depth rounded-xl p-4 text-xs space-y-1.5 bg-slate-50">
            <div className="flex items-center gap-1.5 font-bold text-midnight-950">
              <Info className="w-3.5 h-3.5 text-slate-700" />
              <span>Grounding Directives ({brand.name})</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Required Tone: <span className="font-bold text-slate-800">{brand.tone}</span> | 
              Approved Price: <span className="font-extrabold text-midnight-950">{brand.products[0]?.approvedPrice}</span> | 
              Outdated Price: <span className="line-through text-slate-400">{brand.products[0]?.previousPrice}</span> | 
              Prohibited: <span className="font-bold text-red-700">{brand.prohibitedTerms.join(', ')}</span>
            </p>
          </div>
        </div>

        {/* Right Column: Findings & Status (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="card-depth rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Brand Compliance Rating
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className={`text-4xl font-extrabold ${
                      result.score >= 80 ? 'text-lime-700' : result.score >= 50 ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      {result.score}%
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {result.score >= 80 ? 'Publication ready' : 'Revisions required'}
                    </span>
                  </div>
                </div>

                <EngineBadge engine={result.engine} />
              </div>

              {/* Status Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-sm">
                  <span className="text-[10px] font-bold text-red-700 uppercase block">Contradicted</span>
                  <span className="text-xl font-extrabold text-red-950 mt-0.5 block">{result.contradictedCount}</span>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 shadow-sm">
                  <span className="text-[10px] font-bold text-purple-700 uppercase block">Outdated Info</span>
                  <span className="text-xl font-extrabold text-purple-950 mt-0.5 block">{result.outdatedCount}</span>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 shadow-sm">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Unverified Claim</span>
                  <span className="text-xl font-extrabold text-amber-950 mt-0.5 block">{result.unverifiedCount}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-700 uppercase block">Tone / Style</span>
                  <span className="text-xl font-extrabold text-midnight-950 mt-0.5 block">{result.uncertainCount}</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed shadow-inner-subtle">
                {result.summary}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="w-full py-2.5 btn-dark rounded-lg font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-lime-400" />
                  <span>Submit to Human Review Centre</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="card-depth rounded-xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-midnight-950 uppercase tracking-wider">Awaiting Verification</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Paste draft copy and click <span className="font-bold text-midnight-950">"Run Verification"</span> or click <span className="font-bold text-lime-700">"Load Demonstration Copy"</span> to evaluate against the Truth Ledger.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Findings & Correction Assistant Section */}
      {result && (
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-extrabold text-midnight-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Detected Compliance Issues ({result.findings.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every issue is corroborated by authoritative Brand Truth Ledger facts and style policies.
              </p>
            </div>

            {result.findings.length > 0 && result.suggestedCleanContent && (
              <button
                type="button"
                onClick={handleApplyAllCorrections}
                className="btn-lime px-4 py-2 rounded-lg text-xs shadow-lime-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Apply All Corrections to Editor</span>
              </button>
            )}
          </div>

          {result.findings.length === 0 ? (
            <div className="card-depth bg-lime-400/10 border-lime-500/40 rounded-xl p-6 text-center text-midnight-950 space-y-1">
              <CheckCircle2 className="w-7 h-7 text-lime-600 mx-auto" />
              <div className="font-extrabold text-xs">No Policy Violations Detected</div>
              <p className="text-xs text-slate-600 font-medium">
                Content is 100% compliant with approved Brand Truth Ledger facts and price schedules.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.findings.map((finding, idx) => (
                <div
                  key={finding.id || idx}
                  className="card-depth-hover rounded-xl p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-midnight-950">{finding.issueCategory}</span>
                      <SeverityBadge severity={finding.severity} />
                      <StatusBadge status={finding.status} />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopySingle(finding.suggestedCorrection, idx)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 bg-white rounded-md border border-slate-200 transition-colors flex items-center gap-1 shadow-sm"
                        title="Copy suggested fix"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-lime-700" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>

                      {finding.originalText !== 'Missing Brand Attribution' && (
                        <button
                          type="button"
                          onClick={() => handleApplySingleCorrection(finding.originalText, finding.suggestedCorrection)}
                          className="px-2.5 py-1 text-xs font-bold text-midnight-950 bg-lime-400/30 hover:bg-lime-400/50 border border-lime-500/50 rounded-md transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Wand2 className="w-3 h-3 text-midnight-950" />
                          <span>Apply</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Original vs Suggested Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-red-700 block mb-1">
                        Detected Content Phrase
                      </span>
                      <div className="font-mono text-red-950 font-bold">
                        "{finding.originalText}"
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-lime-400/20 border border-lime-500/40 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-lime-900 block mb-1">
                        Suggested Replacement
                      </span>
                      <div className="font-mono text-midnight-950 font-bold">
                        "{finding.suggestedCorrection}"
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-midnight-950">Analysis: </span>
                    {finding.explanation}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50 -mx-5 -mb-5 px-5 py-2.5 rounded-b-xl">
                    <div className="flex items-center gap-1.5 truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-midnight-950 flex-shrink-0" />
                      <span className="font-bold text-midnight-950">Ledger Citation:</span>
                      <span className="truncate">{finding.relevantFact}</span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                      Ref: {finding.sourceReference}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Correction Assistant Container with 3D Midnight Black & Lime */}
          {result.suggestedCleanContent && (
            <div className="bg-midnight-950 text-white rounded-xl p-6 border border-midnight-800 shadow-[0_12px_36px_rgba(11,11,12,0.25)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-lime-400" />
                    <span>Correction Assistant — Recommended Compliant Copy</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Preserves original creator intent while ensuring 100% compliance with Brand Truth Ledger.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyFullClean}
                    className="btn-dark px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    {copiedFull ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedFull ? 'Copied' : 'Copy Clean Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyAllCorrections}
                    className="btn-lime px-4 py-2 text-xs rounded-lg flex items-center gap-1.5 shadow-lime-sm"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Replace in Editor</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-midnight-900 border border-midnight-800 text-xs font-sans text-slate-100 leading-relaxed shadow-inner">
                "{result.suggestedCleanContent}"
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Verified against NovaFit Nutrition Brand Truth Ledger</span>
                <button
                  type="button"
                  onClick={handleVerify}
                  className="text-lime-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-audit current editor text</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
