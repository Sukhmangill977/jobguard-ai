import React from 'react';
import { AlertTriangle, ShieldCheck, Eraser } from 'lucide-react';
import { SensitiveScanResult } from '../utils/privacyGuard';

interface SensitiveDataBannerProps {
  scanResult: SensitiveScanResult;
  onRedact: () => void;
}

export const SensitiveDataBanner: React.FC<SensitiveDataBannerProps> = ({ scanResult, onRedact }) => {
  if (!scanResult.hasSensitiveData) {
    return (
      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Safety Check Clean:</strong> No passwords, OTPs, or financial secrets detected in your draft.
          </span>
        </div>
        <span className="text-[11px] text-emerald-400/80 hidden sm:inline">Protected</span>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs space-y-2 animate-in fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-300">
              ⚠️ Sensitive Credential Detected in Text ({scanResult.matches.length} items)
            </p>
            <ul className="mt-1 list-disc list-inside space-y-0.5 text-amber-200/90 text-[11px]">
              {scanResult.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
            <p className="mt-1.5 text-amber-300/80 text-[11px]">
              Never submit passwords, OTPs, bank PINs, or confidential tokens. Please redact them before analysis.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRedact}
          className="shrink-0 px-2.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Auto-Redact</span>
        </button>
      </div>
    </div>
  );
};
