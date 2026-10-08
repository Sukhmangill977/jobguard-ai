import React, { useState, useMemo } from 'react';
import { SCAM_PATTERN_LIBRARY, ScamPatternDefinition } from '../data/patterns';
import { Search, AlertTriangle, ShieldCheck, CheckCircle2, BookOpen, Filter } from 'lucide-react';

export const PatternsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(SCAM_PATTERN_LIBRARY[0].id);

  const filteredPatterns = useMemo(() => {
    return SCAM_PATTERN_LIBRARY.filter((pattern) => {
      const matchesSearch =
        pattern.name.toLowerCase().includes(search.toLowerCase()) ||
        pattern.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        pattern.modusOperandi.toLowerCase().includes(search.toLowerCase());

      const matchesSeverity = severityFilter === 'ALL' || pattern.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [search, severityFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge & Defense Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Recruitment Scam Pattern Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Explore the 12 most prevalent fraud patterns targeting job seekers, freshers, and remote professionals—including their modus operandi, common red flags, and legitimate industry standards.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scam types (e.g. registration, equipment, telegram, training)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Severity Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 self-stretch sm:self-auto text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                severityFilter === sev
                  ? 'bg-slate-800 text-slate-100 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev === 'ALL' ? 'All' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Patterns Grid / Accordion */}
      <div className="space-y-4">
        {filteredPatterns.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No scam patterns match your search query. Try searching for "fee" or "telegram".
          </div>
        ) : (
          filteredPatterns.map((pattern) => {
            const isExpanded = expandedId === pattern.id;
            const isCrit = pattern.severity === 'CRITICAL';
            const isHigh = pattern.severity === 'HIGH';

            return (
              <div
                key={pattern.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-all hover:border-slate-700"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : pattern.id)}
                  className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isCrit
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : isHigh
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                        }`}
                      >
                        {pattern.severity} RISK
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-100">
                        {pattern.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{pattern.shortDescription}</p>
                  </div>

                  <span className="text-xs font-semibold text-emerald-400 shrink-0">
                    {isExpanded ? 'Hide Details' : 'View Breakdown'}
                  </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-800/80 space-y-5 text-xs animate-in fade-in">
                    {/* Modus Operandi */}
                    <div className="space-y-1.5 pt-4">
                      <h4 className="font-semibold text-slate-200">How This Scam Operates (Modus Operandi):</h4>
                      <p className="text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        {pattern.modusOperandi}
                      </p>
                    </div>

                    {/* Common Indicators List */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Common Warning Indicators:</span>
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {pattern.commonIndicators.map((ind, i) => (
                          <li
                            key={i}
                            className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-slate-300 flex items-start gap-2"
                          >
                            <span className="text-amber-400 font-bold shrink-0">▪</span>
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contrast with Real Practice */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1 text-emerald-200">
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>What Legitimate Companies Do:</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {pattern.whatLegitimateCompaniesDo}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 space-y-1 text-red-200">
                        <div className="flex items-center gap-1.5 font-semibold text-red-300">
                          <ShieldCheck className="w-4 h-4 text-red-400" />
                          <span>Your Safe Action Rule:</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {pattern.safeAction}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
