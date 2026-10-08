import React from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export const AboutView: React.FC<{ onStartCheck: () => void }> = ({ onStartCheck }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 text-slate-300 text-xs sm:text-sm">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Product Architecture & Philosophy</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          How JobGuard AI Works
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base leading-relaxed">
          JobGuard AI is an evidence-based recruitment risk assessment system designed to protect students, freshers, and professionals from job fraud, impersonation, and fee solicitation.
        </p>
      </div>

      {/* Core Mission */}
      <section className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-slate-100">
          The Core Problem & User Promise
        </h2>
        <p className="leading-relaxed text-slate-300">
          Job seekers are inundated with sophisticated Telegram recruitment rings, lookalike recruiter domains, fake offer letters, and demands for "refundable registration fees" or "security deposits".
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
          <p className="font-semibold text-emerald-400 text-xs uppercase tracking-wider mb-1">
            Our Central Promise
          </p>
          <p className="italic">
            “Does this job opportunity appear legitimate, suspicious, or high-risk based on the evidence I provided?”
          </p>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          JobGuard does NOT say “This is definitely a scam.” It calculates a calibrated <strong>Risk Indicator Score</strong> (0–100) based on weighted evidence, cites user text verbatim, and generates an independent verification checklist.
        </p>
      </section>

      {/* The 7 Risk Pillars */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>The 7 Assessment Pillars</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-slate-100 block">1. Company Authenticity</strong>
            <p className="text-slate-400">
              Evaluates corporate name consistency, web domain presence, corporate registry indicators, and lookalike domains.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-slate-100 block">2. Recruiter Authenticity</strong>
            <p className="text-slate-400">
              Analyzes recruiter email domain (corporate @company.com vs. consumer webmail), contact channels, and verifiable LinkedIn presence.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-slate-100 block">3. Job Description Risk</strong>
            <p className="text-slate-400">
              Checks for unrealistic compensation claims (e.g., ₹100,000/month for 2 hours daily), vague duties, and guaranteed hiring.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-slate-100 block">4. Payment & Fee Risk (Highest Weight)</strong>
            <p className="text-slate-400">
              Scrutinizes any demand for candidate money: registration fees, training packages, interview slot bookings, or hardware deposits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-slate-100 block">5. Communication Risk</strong>
            <p className="text-slate-400">
              Flags artificial urgency ("pay before 5 PM"), pressure tactics, and isolating candidates strictly onto encrypted messaging apps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-slate-100 block">6. Offer Letter Integrity</strong>
            <p className="text-slate-400">
              Inspects formal letter clauses, reporting managers, pre-joining monetary stipulations, and contractual inconsistencies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 sm:col-span-2">
            <strong className="text-slate-100 block">7. Link & Web Safety</strong>
            <p className="text-slate-400">
              Safely analyzes URL structure, obfuscated or shortened links (bit.ly, tinyurl), typosquatting, and unverified form portals without running malicious scripts.
            </p>
          </div>
        </div>
      </section>

      {/* The 20 AI Guardrails */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Evidence Integrity Rules & Anti-Bias Guardrails</span>
        </h2>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
          <p className="text-slate-400">
            Our AI analysis engine adheres strictly to ethical cyber-intelligence constraints:
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Never invents or hallucinates evidence.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Never assumes a small or young company is fraudulent.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Never treats informal writing or grammar errors alone as fraud.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Never claims external verification if an external check wasn't performed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Distinguishes confirmed evidence from inferences and unknowns.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Avoids racial, geographic, or linguistic bias.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Warns users against submitting credentials, OTPs, or passwords.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Prioritizes independent verification through official corporate channels.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Verification Rule */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-800/40 space-y-3">
        <h3 className="font-bold text-slate-100 text-sm">
          Golden Rule: Independent Verification
        </h3>
        <p className="text-slate-300 text-xs leading-relaxed">
          Never use the contact information provided in a suspicious email, SMS, or WhatsApp chat to "verify" their own authenticity. Always open a fresh browser tab, search for the company independently, locate their registered switchboard or official careers inbox, and ask if the requisition is genuine.
        </p>
        <button
          onClick={onStartCheck}
          className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
        >
          Check a Job Opportunity
        </button>
      </section>
    </div>
  );
};
