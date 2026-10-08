import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Shield } from 'lucide-react';

const STAGES = [
  'Reading job opportunity details',
  'Analyzing recruiter communication & contact domain',
  'Cross-checking internal consistency & role claims',
  'Detecting financial & fee solicitation indicators',
  'Evaluating evidence strength against fraud patterns',
  'Building independent verification checklist',
  'Formulating safe next-action recommendation',
];

export const LoadingSteps: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
        <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
      </div>

      <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
        Analyzing Recruitment Opportunity
      </h2>
      <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
        Evaluating text, recruiter channels, compensation terms, and payment demands against established hiring standards.
      </p>

      {/* Structured Stages */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-left space-y-3.5 shadow-xl">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStage;
          const isCurrent = idx === activeStage;
          const isPending = idx > activeStage;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 transition-opacity duration-300 text-xs sm:text-sm ${
                isPending ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>

              <span
                className={`font-medium ${
                  isDone
                    ? 'text-slate-300'
                    : isCurrent
                    ? 'text-emerald-300 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 mt-6">
        JobGuard AI analyzes the factual evidence provided. No automated external phone calls or credit checks are performed.
      </p>
    </div>
  );
};
