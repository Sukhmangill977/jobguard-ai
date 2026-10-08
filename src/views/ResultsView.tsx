import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Printer,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  XCircle,
  FileText,
  Lock,
  Download,
} from 'lucide-react';
import { RiskAnalysisResult, RedFlag, EvidenceItem } from '../types/jobguard';
import { ScoreGauge } from '../components/ScoreGauge';

interface ResultsViewProps {
  result: RiskAnalysisResult;
  onCheckAnother: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onCheckAnother }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'checklist' | 'patterns'>('overview');

  const handleCopySummary = () => {
    const summaryText = `JobGuard AI Risk Assessment
Opportunity: ${result.jobTitle} at ${result.companyName}
Risk Indicator Score: ${result.riskScore}/100 (${result.verdict})
Recommended Decision: ${result.recommendedDecision}

Rationale: ${result.decisionRationale}

Top Red Flags:
${result.redFlags.map((rf) => `- [${rf.severity}] ${rf.title}: "${rf.evidenceQuote}"`).join('\n')}

Verification Next Step:
Search independently for the employer's official website and verify through published phone numbers.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Color mapping for recommended decision
  const getDecisionTheme = (decision: string) => {
    switch (decision) {
      case 'Do Not Pay / Do Not Proceed Until Verified':
        return {
          bg: 'bg-red-950/30 border-red-800/60 text-red-200',
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: <XCircle className="w-5 h-5 text-red-400" />,
        };
      case 'Pause and Verify':
        return {
          bg: 'bg-amber-950/30 border-amber-800/60 text-amber-200',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        };
      case 'Proceed After Verification':
        return {
          bg: 'bg-yellow-950/30 border-yellow-800/60 text-yellow-200',
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          icon: <CheckCircle2 className="w-5 h-5 text-yellow-400" />,
        };
      case 'Proceed':
        return {
          bg: 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        };
      default:
        return {
          bg: 'bg-slate-900 border-slate-800 text-slate-300',
          badge: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: <HelpCircle className="w-5 h-5 text-slate-400" />,
        };
    }
  };

  const decisionTheme = getDecisionTheme(result.recommendedDecision);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 print:p-0 print:space-y-4">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Assessment Record</span>
            <span aria-hidden="true">·</span>
            <span>{new Date(result.timestamp).toLocaleDateString()}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-500">ID: {result.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {result.jobTitle}
          </h1>
          <p className="text-sm font-medium text-emerald-400 mt-0.5">
            {result.companyName || 'Unspecified Employer'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-2 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={onCheckAnother}
            className="px-3.5 py-2 text-xs rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Check Another</span>
          </button>
        </div>
      </div>

      {/* Main Score & Verdict Gauge */}
      <ScoreGauge
        score={result.riskScore}
        riskLevel={result.riskLevel}
        verdict={result.verdict}
        confidence={result.confidence}
      />

      {/* Recommended Decision Banner */}
      <div className={`p-6 rounded-2xl border ${decisionTheme.bg} space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {decisionTheme.icon}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Recommended Decision
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {result.recommendedDecision}
              </h2>
            </div>
          </div>

          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border self-start sm:self-auto ${decisionTheme.badge}`}>
            {result.verdictHeadline}
          </span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
          {result.decisionRationale}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium print:hidden">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-slate-100 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview & Red Flags ({result.redFlags.length})
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'evidence'
              ? 'bg-slate-800 text-slate-100 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Evidence Breakdown ({result.evidenceTable.length})
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'checklist'
              ? 'bg-slate-800 text-slate-100 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Verification Checklist ({result.verificationChecklist.length} steps)
        </button>

        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'patterns'
              ? 'bg-slate-800 text-slate-100 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Matched Patterns ({result.matchedScamPatterns.length})
        </button>
      </div>

      {/* Tab 1: Overview & Red Flags */}
      {(activeTab === 'overview' || typeof window !== 'undefined') && (
        <div className={`space-y-8 ${activeTab !== 'overview' ? 'hidden print:block' : ''}`}>
          {/* Summary Callout */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-slate-100">Assessment Summary: </strong>
            {result.summary}
          </div>

          {/* Top Red Flags Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>🚩 Top Red Flags</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {result.redFlags.length} Detected
                </span>
              </h3>
              <span className="text-[11px] text-slate-500">Based directly on provided text</span>
            </div>

            {result.redFlags.length === 0 ? (
              <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                <span>No high-severity red flags were detected in the supplied evidence.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {result.redFlags.map((flag) => {
                  const isCrit = flag.severity === 'CRITICAL';
                  const isHigh = flag.severity === 'HIGH';

                  return (
                    <div
                      key={flag.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              isCrit
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : isHigh
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                            }`}
                          >
                            {flag.severity}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {flag.category}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-semibold text-sm text-slate-100">
                        {flag.title}
                      </h4>

                      <div className="space-y-1.5 text-xs">
                        <p className="text-slate-300 leading-relaxed">
                          <strong className="text-slate-400">Why it matters: </strong>
                          {flag.whyItMatters}
                        </p>

                        {flag.evidenceQuote && (
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 text-slate-300 font-mono text-[11px] leading-relaxed">
                            <span className="text-slate-500 select-none">"</span>
                            {flag.evidenceQuote}
                            <span className="text-slate-500 select-none">"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Positive Signals & Unknowns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Signals */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>✅ Positive Signals</span>
                <span className="text-xs text-emerald-400 font-semibold">
                  ({result.positiveSignals.length})
                </span>
              </h3>

              {result.positiveSignals.length === 0 ? (
                <p className="text-xs text-slate-500 p-3 rounded-lg bg-slate-900 border border-slate-800">
                  No verified positive recruitment signals logged.
                </p>
              ) : (
                <div className="space-y-2">
                  {result.positiveSignals.map((ps) => (
                    <div
                      key={ps.id}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{ps.title}</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{ps.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* What We Could Not Verify */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>❓ What We Could Not Verify</span>
                  <span className="text-xs text-slate-400">({result.unknowns.length})</span>
                </h3>
              </div>

              {result.unknowns.length === 0 ? (
                <p className="text-xs text-slate-500 p-3 rounded-lg bg-slate-900 border border-slate-800">
                  All critical recruitment parameters were provided for review.
                </p>
              ) : (
                <div className="space-y-2">
                  {result.unknowns.map((uk) => (
                    <div
                      key={uk.id}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2 font-semibold text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{uk.item}</span>
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{uk.impact}</p>
                      <p className="text-emerald-400/90 text-[11px]">
                        <strong>How to check: </strong> {uk.howToVerify}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-slate-500 italic">
                * Note: Unknown information does not equal fraud. It represents missing facts that require independent check.
              </p>
            </div>
          </div>

          {/* 7 Risk Pillars Health Summary Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100">
              7-Pillar Category Health Matrix
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
              {Object.entries(result.categories).map(([catKey, data]) => {
                const isWarn = data.status === 'warning';
                const isCaut = data.status === 'caution';
                const isHealth = data.status === 'healthy';

                const labelMap: Record<string, string> = {
                  companyAuthenticity: 'Company',
                  recruiterAuthenticity: 'Recruiter',
                  jobDescriptionRisk: 'Job Scope',
                  paymentRisk: 'Payment',
                  communicationRisk: 'Channels',
                  offerLetterRisk: 'Offer Letter',
                  linkWebsiteRisk: 'Website/Links',
                };

                return (
                  <div
                    key={catKey}
                    className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                      isWarn
                        ? 'bg-red-950/20 border-red-800/40 text-red-200'
                        : isCaut
                        ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                        : isHealth
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-[11px] block text-slate-200">
                        {labelMap[catKey] || catKey}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          isWarn
                            ? 'text-red-400'
                            : isCaut
                            ? 'text-amber-400'
                            : isHealth
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {data.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2" title={data.notes}>
                      {data.notes}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Evidence Breakdown Table */}
      {(activeTab === 'evidence' || typeof window !== 'undefined') && (
        <div className={`space-y-4 ${activeTab !== 'evidence' ? 'hidden print:block' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Evidence Table</h3>
              <p className="text-xs text-slate-400">
                Detailed catalog of signals extracted from your submitted recruitment materials.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {result.evidenceTable.length} recorded signals
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Signal</th>
                  <th className="py-3 px-4">Evidence Cite</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {result.evidenceTable.map((row, idx) => {
                  const isCrit = row.severity === 'Critical';
                  const isHigh = row.severity === 'High';
                  const isMed = row.severity === 'Medium';

                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-200">{row.signal}</td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-[11px] max-w-xs break-words">
                        {row.evidence}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{row.category}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isCrit
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : isHigh
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : isMed
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{row.confidence}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Prioritized Action Plan & Verification Checklist */}
      {(activeTab === 'checklist' || typeof window !== 'undefined') && (
        <div className={`space-y-8 ${activeTab !== 'checklist' ? 'hidden print:block' : ''}`}>
          {/* Action Plan: Do Now / Before Proceeding / If Verified */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>What Should I Do?</span>
              <span className="text-xs text-slate-400 font-normal">Prioritized action plan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Do Now */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>🔴 Do This Now</span>
                </div>
                <ul className="space-y-2 text-slate-300 leading-relaxed">
                  {result.recommendedActions.doNow.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Before Proceeding */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>🟠 Before Proceeding</span>
                </div>
                <ul className="space-y-2 text-slate-300 leading-relaxed">
                  {result.recommendedActions.beforeProceeding.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* If Verified */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>🟢 If Independently Verified</span>
                </div>
                <ul className="space-y-2 text-slate-300 leading-relaxed">
                  {result.recommendedActions.ifVerified.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Independent Verification Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Follow these precise steps to confirm the employer's legitimacy without relying on the recruiter's unverified channels.
              </p>
            </div>

            <div className="space-y-3">
              {result.verificationChecklist.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">
                      {step.stepNumber}
                    </span>
                    <span>{step.title}</span>
                  </div>

                  <p className="text-slate-300 pl-7 leading-relaxed">{step.instruction}</p>

                  {step.criticalWarning && (
                    <div className="ml-7 mt-1 p-2 rounded bg-red-950/30 border border-red-900/40 text-[11px] text-red-300 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>{step.criticalWarning}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What NOT to Do */}
          <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/50 space-y-3">
            <h3 className="text-sm font-bold text-red-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>🚫 What NOT to Do</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-red-200/90">
              {result.doNotDo.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-950/40">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Matched Scam Patterns */}
      {(activeTab === 'patterns' || typeof window !== 'undefined') && (
        <div className={`space-y-4 ${activeTab !== 'patterns' ? 'hidden print:block' : ''}`}>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Recruitment Fraud Pattern Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Comparing your opportunity against the JobGuard scam taxonomy.
            </p>
          </div>

          {result.matchedScamPatterns.length === 0 ? (
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span>No known recruitment scam patterns were strongly matched.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {result.matchedScamPatterns.map((pat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-100">{pat.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      {pat.severity} MATCH
                    </span>
                  </div>

                  <p className="text-slate-400">{pat.description}</p>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-amber-300/90 leading-relaxed text-[11px]">
                    <strong className="text-amber-200">Relevance to this opportunity: </strong>
                    {pat.relevanceExplanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA to verify another */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3 print:hidden">
        <h4 className="text-sm font-semibold text-slate-200">
          Have another offer or recruiter conversation to verify?
        </h4>
        <button
          onClick={onCheckAnother}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md cursor-pointer"
        >
          Check Another Job Opportunity
        </button>
      </div>
    </div>
  );
};
