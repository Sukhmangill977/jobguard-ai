/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingSteps } from './components/LoadingSteps';
import { LandingView } from './views/LandingView';
import { CheckView } from './views/CheckView';
import { ResultsView } from './views/ResultsView';
import { PatternsView } from './views/PatternsView';
import { HistoryView } from './views/HistoryView';
import { AboutView } from './views/AboutView';
import { JobSubmission, RiskAnalysisResult } from './types/jobguard';
import { DemoPreset } from './data/demos';
import {
  getSavedAnalyses,
  saveAnalysis,
  removeAnalysis,
  clearAllAnalyses,
} from './utils/storage';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'check' | 'loading' | 'results' | 'patterns' | 'history' | 'about'
  >('home');

  const [prefilledSubmission, setPrefilledSubmission] = useState<JobSubmission | undefined>();
  const [currentResult, setCurrentResult] = useState<RiskAnalysisResult | null>(null);
  const [history, setHistory] = useState<RiskAnalysisResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load history on initial mount
  useEffect(() => {
    setHistory(getSavedAnalyses());
  }, []);

  const handleNavigate = (view: string) => {
    setErrorMessage(null);
    if (view === 'check') {
      setCurrentView('check');
    } else if (view === 'patterns') {
      setCurrentView('patterns');
    } else if (view === 'history') {
      setCurrentView('history');
    } else if (view === 'about') {
      setCurrentView('about');
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCheck = () => {
    setPrefilledSubmission(undefined);
    handleNavigate('check');
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    setPrefilledSubmission(preset.submission);
    handleNavigate('check');
  };

  const handleSubmitAnalysis = async (submission: JobSubmission) => {
    setErrorMessage(null);
    setCurrentView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server responded with status ${response.status}.`
        );
      }

      const resultData: RiskAnalysisResult = await response.json();

      // Persist to local storage
      saveAnalysis(resultData);
      setHistory(getSavedAnalyses());

      setCurrentResult(resultData);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis submission failed:', err);
      setErrorMessage(
        err.message ||
          'Failed to complete risk assessment. Please check your submission and try again.'
      );
      setCurrentView('check');
    }
  };

  const handleSelectHistoryItem = (item: RiskAnalysisResult) => {
    setCurrentResult(item);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    removeAnalysis(id);
    setHistory(getSavedAnalyses());
  };

  const handleClearAllHistory = () => {
    if (confirm('Are you sure you want to clear all saved recruitment analysis records?')) {
      clearAllAnalyses();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        savedCount={history.length}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded hover:bg-red-900/40 text-red-400 hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <LandingView
            onStartCheck={handleStartCheck}
            onSelectPreset={handleSelectPreset}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'check' && (
          <CheckView
            initialSubmission={prefilledSubmission}
            onSubmit={handleSubmitAnalysis}
            isLoading={false}
          />
        )}

        {currentView === 'loading' && <LoadingSteps />}

        {currentView === 'results' && currentResult && (
          <ResultsView
            result={currentResult}
            onCheckAnother={handleStartCheck}
          />
        )}

        {currentView === 'patterns' && <PatternsView />}

        {currentView === 'history' && (
          <HistoryView
            history={history}
            onSelect={handleSelectHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onNewCheck={handleStartCheck}
          />
        )}

        {currentView === 'about' && (
          <AboutView onStartCheck={handleStartCheck} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
