import { RiskAnalysisResult } from '../types/jobguard';

const STORAGE_KEY = 'jobguard_analysis_history';

export function getSavedAnalyses(): RiskAnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse analysis history', e);
    return [];
  }
}

export function saveAnalysis(result: RiskAnalysisResult): void {
  try {
    const current = getSavedAnalyses();
    // Prepend and limit to 20 items to conserve storage
    const updated = [result, ...current.filter((item) => item.id !== result.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save analysis', e);
  }
}

export function removeAnalysis(id: string): void {
  try {
    const current = getSavedAnalyses();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove analysis', e);
  }
}

export function clearAllAnalyses(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear analyses', e);
  }
}
