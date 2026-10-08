import React from 'react';
import { RiskAnalysisResult } from '../types/jobguard';
import { History, Trash2, ArrowRight, Shield, ShieldCheck, AlertTriangle, Eye } from 'lucide-react';

interface HistoryViewProps {
  history: RiskAnalysisResult[];
  onSelect: (item: RiskAnalysisResult) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onNewCheck: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  onNewCheck,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Local Device Storage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Past evaluations saved locally on your browser. No data is stored on remote servers.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="px-3 py-1.5 text-xs rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 text-base">No Previous Assessments</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              When you evaluate a job opportunity, the report is saved here so you can review the verification checklist anytime.
            </p>
          </div>
          <button
            onClick={onNewCheck}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
          >
            Check a Job Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const isHigh = item.riskScore >= 60;
            const isCaut = item.riskScore >= 40 && item.riskScore < 60;
            const isLow = item.riskScore < 40 && item.riskLevel !== 'INSUFFICIENT_EVIDENCE';

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div
                  onClick={() => onSelect(item)}
                  className="space-y-1 cursor-pointer flex-1"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isHigh
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : isCaut
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : isLow
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.verdict.toUpperCase()} ({item.riskScore}/100)
                    </span>

                    <span className="text-[11px] text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString()} at{' '}
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-100 hover:text-emerald-400 transition-colors">
                    {item.jobTitle}
                  </h3>
                  <p className="text-xs text-emerald-400/90 font-medium">
                    {item.companyName || 'Unspecified Organization'}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{item.summary}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onSelect(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
