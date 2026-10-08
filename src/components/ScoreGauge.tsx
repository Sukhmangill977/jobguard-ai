import React from 'react';
import { RiskLevel, RiskVerdict } from '../types/jobguard';
import { ShieldCheck, AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  verdict: RiskVerdict;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, riskLevel, verdict, confidence }) => {
  const isInsufficient = riskLevel === 'INSUFFICIENT_EVIDENCE';

  // Determine color scheme
  let colorClass = 'text-emerald-400 stroke-emerald-400';
  let bgClass = 'bg-emerald-950/30 border-emerald-800/40';
  let badgeColor = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  let statusIcon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;

  if (isInsufficient) {
    colorClass = 'text-slate-400 stroke-slate-400';
    bgClass = 'bg-slate-900 border-slate-800';
    badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
    statusIcon = <HelpCircle className="w-5 h-5 text-slate-400" />;
  } else if (score >= 80) {
    colorClass = 'text-red-500 stroke-red-500';
    bgClass = 'bg-red-950/20 border-red-800/40';
    badgeColor = 'bg-red-500/10 text-red-400 border-red-500/30';
    statusIcon = <AlertTriangle className="w-5 h-5 text-red-400" />;
  } else if (score >= 60) {
    colorClass = 'text-amber-500 stroke-amber-500';
    bgClass = 'bg-amber-950/20 border-amber-800/40';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    statusIcon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
  } else if (score >= 40) {
    colorClass = 'text-yellow-400 stroke-yellow-400';
    bgClass = 'bg-yellow-950/20 border-yellow-800/40';
    badgeColor = 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
    statusIcon = <AlertCircle className="w-5 h-5 text-yellow-400" />;
  }

  // SVG circular arc calculation
  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Semi-circle or 75% arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = isInsufficient
    ? arcLength
    : arcLength - (score / 100) * arcLength;

  return (
    <div className={`p-6 rounded-2xl border ${bgClass} backdrop-blur-sm relative overflow-hidden`}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Gauge SVG */}
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="rotate-[135deg] transform">
            {/* Background track */}
            <circle
              stroke="rgba(255, 255, 255, 0.08)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeLinecap="round"
            />
            {/* Progress Arc */}
            {!isInsufficient && (
              <circle
                className={`${colorClass} transition-all duration-1000 ease-out`}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Centered Number Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {isInsufficient ? (
              <>
                <span className="text-2xl font-bold text-slate-300">N/A</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Sparse Data
                </span>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-center">
                  <span className={`text-4xl font-extrabold tracking-tight ${colorClass}`}>
                    {score}
                  </span>
                  <span className="text-slate-400 text-sm font-semibold ml-0.5">/100</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Indicator Score
                </span>
              </>
            )}
          </div>
        </div>

        {/* Verdict Details */}
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${badgeColor}`}>
              {statusIcon}
              <span>{verdict.toUpperCase()}</span>
            </span>

            <span className="text-xs text-slate-400">
              Evidence Confidence: <strong className="text-slate-200">{confidence}</strong>
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-100 tracking-tight">
              {isInsufficient ? 'Insufficient Evidence to Conclude' : `Risk Indicator Score: ${score}/100`}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              This score quantifies the volume and severity of risk indicators detected in your submitted recruitment materials. It represents a structured indicator analysis, not a definitive legal determination of fraud.
            </p>
          </div>

          {/* Risk Range Meter Legend */}
          <div className="pt-2">
            <div className="grid grid-cols-5 gap-1 text-[9px] font-medium text-slate-400">
              <span className={score < 20 && !isInsufficient ? 'text-emerald-400 font-bold' : ''}>0-19 Low</span>
              <span className={score >= 20 && score < 40 && !isInsufficient ? 'text-emerald-400 font-bold' : ''}>20-39 Gen Low</span>
              <span className={score >= 40 && score < 60 && !isInsufficient ? 'text-yellow-400 font-bold' : ''}>40-59 Caution</span>
              <span className={score >= 60 && score < 80 && !isInsufficient ? 'text-amber-400 font-bold' : ''}>60-79 High</span>
              <span className={score >= 80 && !isInsufficient ? 'text-red-400 font-bold' : ''}>80-100 Critical</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full mt-1 overflow-hidden flex">
              <div className="w-1/5 bg-emerald-500/80"></div>
              <div className="w-1/5 bg-teal-500/80"></div>
              <div className="w-1/5 bg-yellow-500/80"></div>
              <div className="w-1/5 bg-amber-500/80"></div>
              <div className="w-1/5 bg-red-500/80"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
