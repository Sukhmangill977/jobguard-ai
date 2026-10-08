import React from 'react';
import { Shield, ShieldAlert, BookOpen, History, Info, PlusCircle, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">JobGuard</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Recruitment Fraud Risk Analyzer</p>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('check')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'check'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Check Job</span>
          </button>

          <button
            onClick={() => onNavigate('patterns')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'patterns'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Scam Patterns</span>
            <span className="md:hidden">Patterns</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'history'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
            {savedCount > 0 && (
              <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'about'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">How It Works</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
