import React from 'react';
import { Shield, Lock, EyeOff, AlertTriangle } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>JobGuard AI — Evidence-Based Recruitment Risk Analyzer</span>
            </div>
            <p className="text-slate-500 max-w-xl">
              "Before you trust a job offer, verify it." Protecting students, freshers, and professionals from recruitment fraud, impersonation, and fee solicitation.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onNavigate('check')} className="hover:text-slate-200 transition-colors">
              Check Job
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('patterns')} className="hover:text-slate-200 transition-colors">
              Scam Library
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-200 transition-colors">
              Methodology
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('history')} className="hover:text-slate-200 transition-colors">
              Saved Reports
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 flex items-start gap-3">
          <Lock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <p className="text-slate-300 font-medium">Privacy & Evidence Standard</p>
            <p className="text-slate-400 leading-relaxed">
              JobGuard analyzes user-provided evidence to produce indicator risk ratings. The system never claims absolute certainty of fraud or safety.
              Never upload passwords, OTPs, bank PINs, or national IDs. We do not sell or harvest applicant data.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 pt-2 border-t border-slate-900">
          <p>© {new Date().getFullYear()} JobGuard AI. Built for ethical career safety.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Client-side credential redaction active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
