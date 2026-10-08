import React from 'react';
import {
  Shield,
  ShieldAlert,
  ArrowRight,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  UserCheck,
  Globe,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { DEMO_PRESETS, DemoPreset } from '../data/demos';

interface LandingViewProps {
  onStartCheck: () => void;
  onSelectPreset: (preset: DemoPreset) => void;
  onNavigate: (view: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartCheck,
  onSelectPreset,
  onNavigate,
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 text-center max-w-4xl mx-auto px-4">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Quiet Kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Evidence-Based Recruitment Scam & Risk Analyzer</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Is This Job Real?
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Check suspicious job offers, recruiters, interview messages, and offer letters before you trust them.
        </p>

        {/* Tagline */}
        <p className="mt-2 text-sm font-semibold text-emerald-400">
          “Before you trust a job offer, verify it.”
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartCheck}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Check a Job Opportunity</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('about')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition-colors cursor-pointer"
          >
            See How It Works
          </button>
        </div>

        {/* Privacy Promise Banner */}
        <div className="mt-8 max-w-lg mx-auto p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            We analyze the information you provide. Never share passwords, OTPs, bank PINs, or other sensitive credentials.
          </span>
        </div>
      </section>

      {/* Interactive 1-Click Demo Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Try Instant Demo Case Studies</h2>
            <p className="text-xs text-slate-400">
              Test how JobGuard AI differentiates high-risk fee scams from authentic enterprise hiring.
            </p>
          </div>
          <span className="text-xs text-slate-400">Click any card to inspect and run</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_PRESETS.map((preset) => {
            const isHigh = preset.expectedRiskLevel === 'HIGH';
            const isLow = preset.expectedRiskLevel === 'LOW';

            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isHigh
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : isLow
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {isHigh ? '🚩 High Risk Pattern' : isLow ? '✅ Legitimate Pattern' : '🟡 Low-Evidence Outreach'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">1-click test</span>
                  </div>

                  <h3 className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {preset.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Load scenario</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The 7 Risk Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Comprehensive 7-Pillar Risk Engine
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Recruitment scams rarely fail in just one place. JobGuard systematically evaluates your evidence across key operational dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">1. Payment & Fee Solicitation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Highest risk weight. Flags registration fees, interview slot bookings, training costs, security deposits, and crypto demands.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">2. Recruiter Authenticity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examines email domain (corporate vs. free webmail), verifiable role, LinkedIn presence, and contact professionalism.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">3. Job Description Risk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects inflated compensation for entry tasks, vague "2-3 hours/day" promises, guaranteed jobs, and conflicting expectations.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">4. Company Authenticity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Checks name consistency, corporate web domain, registered presence, and flags lookalike enterprise impersonation.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">5. Communication Risk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flags high-pressure deadlines, instant selections, threats of slot cancellation, and moving exclusively to private messaging apps.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">6. Offer & Link Risk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes shortened URLs, lookalike domains, unverified questionnaire-only offers, and premature requests for personal banking info.
            </p>
          </div>
        </div>
      </section>

      {/* Decision Workflow Showcase */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 bg-gradient-to-b from-slate-900/60 to-slate-950 p-8 rounded-3xl border border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            How JobGuard Guides Your Decision
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Not a generic chatbot. A structured decision-support system built for job seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold text-sm">01</span>
            <p className="font-semibold text-slate-200 mt-1">Submit Evidence</p>
            <p className="text-slate-400 text-[11px] mt-1">Paste JD, recruiter message, offer letter, or upload screenshot.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold text-sm">02</span>
            <p className="font-semibold text-slate-200 mt-1">Safety Filter</p>
            <p className="text-slate-400 text-[11px] mt-1">Automatic redaction of OTPs, cards, and personal passwords.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold text-sm">03</span>
            <p className="font-semibold text-slate-200 mt-1">Indicator Score</p>
            <p className="text-slate-400 text-[11px] mt-1">Transparent 0-100 score based on weighted evidence.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold text-sm">04</span>
            <p className="font-semibold text-slate-200 mt-1">Fact Citations</p>
            <p className="text-slate-400 text-[11px] mt-1">Direct quotes of what was said and why it matters.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold text-sm">05</span>
            <p className="font-semibold text-slate-200 mt-1">Safe Decision</p>
            <p className="text-slate-400 text-[11px] mt-1">Prioritized checklist of how to verify before paying anything.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onStartCheck}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors shadow-md cursor-pointer"
          >
            Start Your Job Assessment Now
          </button>
        </div>
      </section>
    </div>
  );
};
