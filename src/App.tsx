import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AnalyzeFeedbackView } from './components/AnalyzeFeedbackView';
import { FeedbackHistoryView } from './components/FeedbackHistoryView';
import { SummaryView } from './components/SummaryView';
import { EvaluationView } from './components/EvaluationView';
import { DocumentationView } from './components/DocumentationView';
import { FullStackConnectionModal } from './components/FullStackConnectionModal';
import { FeedbackItem, ServerHealthInfo } from './types';
import { INITIAL_SAMPLE_FEEDBACK } from './data/mockData';
import { GraduationCap, Server, Activity, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'indian_college_student_feedback_sentiment_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(INITIAL_SAMPLE_FEEDBACK);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [serverHealth, setServerHealth] = useState<ServerHealthInfo | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);

  // Check health and ping server
  const checkServerHealth = useCallback(async () => {
    try {
      const start = performance.now();
      const res = await fetch('/api/health');
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setServerHealth({
          ...data,
          latencyMs: latency,
        });
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
      }
    } catch {
      setIsBackendConnected(false);
    }
  }, []);

  // Initial Load from Backend REST API (with localStorage fallback)
  useEffect(() => {
    async function loadData() {
      setIsSyncing(true);
      await checkServerHealth();

      try {
        const response = await fetch('/api/feedbacks');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.feedbacks) && data.feedbacks.length > 0) {
            setFeedbackList(data.feedbacks);
            setIsBackendConnected(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.feedbacks));
            } catch (e) {
              console.warn(e);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Backend fetch failed, falling back to localStorage:', err);
        setIsBackendConnected(false);
      } finally {
        setIsSyncing(false);
      }

      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFeedbackList(parsed);
          }
        }
      } catch (e) {
        console.warn('LocalStorage parse error:', e);
      }
    }

    loadData();
  }, [checkServerHealth]);

  // Save to backend and local storage
  const handleFeedbackAnalyzed = async (newItem: FeedbackItem) => {
    // Optimistic UI update
    setFeedbackList((prev) => [newItem, ...prev]);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newItem, ...feedbackList]));
    } catch (e) {
      console.warn(e);
    }

    // Persist to Express backend
    try {
      const resp = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (resp.ok) {
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.error('Failed to save to backend REST API:', err);
      setIsBackendConnected(false);
    }
  };

  // Delete from backend and local storage
  const handleDeleteFeedback = async (id: string) => {
    setFeedbackList((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/feedbacks/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete on backend failed:', err);
    }
  };

  // Clear all
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all student feedback records?')) {
      setFeedbackList([]);
      try {
        await fetch('/api/feedbacks/clear', { method: 'POST' });
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('Clear backend failed:', err);
      }
    }
  };

  // Reset to Indian College Samples
  const handleResetSamples = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/feedbacks/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data.feedbacks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.feedbacks));
        setIsBackendConnected(true);
        return;
      }
    } catch (err) {
      console.warn('Reset backend failed, resetting locally:', err);
    } finally {
      setIsSyncing(false);
    }

    setFeedbackList(INITIAL_SAMPLE_FEEDBACK);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_FEEDBACK));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Full-Stack Status Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          ></span>
          <span className="font-semibold text-white">Indian Engineering College AI Portal</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-300">NAAC &amp; NBA Accreditation Quality Ready</span>
        </div>

        <div className="flex items-center space-x-3 text-slate-400">
          <button
            onClick={() => setIsDiagnosticsOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Server
              className={`w-3.5 h-3.5 ${isBackendConnected ? 'text-emerald-400' : 'text-amber-400'}`}
            />
            <span>
              Full-Stack REST:{' '}
              <strong className="text-white">
                {isBackendConnected
                  ? `Active (Port ${serverHealth?.port || 3000}${
                      serverHealth?.latencyMs ? `, ${serverHealth.latencyMs}ms` : ''
                    })`
                  : 'Client Local Fallback'}
              </strong>
            </span>
          </button>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-300">
            Engine:{' '}
            <strong className="text-indigo-300">
              {serverHealth?.activeModel || 'Gemini 3.1 / Rule Fallback'}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalFeedbackCount={feedbackList.length}
        isBackendConnected={isBackendConnected}
        serverHealth={serverHealth}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            feedbackList={feedbackList}
            setActiveTab={setActiveTab}
            onResetSamples={handleResetSamples}
            onClearAll={handleClearAll}
            onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
            isBackendConnected={isBackendConnected}
          />
        )}

        {activeTab === 'analyze' && (
          <AnalyzeFeedbackView onFeedbackAnalyzed={handleFeedbackAnalyzed} />
        )}

        {activeTab === 'history' && (
          <FeedbackHistoryView
            feedbackList={feedbackList}
            onDeleteFeedback={handleDeleteFeedback}
            onClearAll={handleClearAll}
            onResetSamples={handleResetSamples}
          />
        )}

        {activeTab === 'summary' && <SummaryView feedbackList={feedbackList} />}

        {activeTab === 'evaluation' && <EvaluationView />}

        {activeTab === 'docs' && <DocumentationView />}
      </main>

      {/* Diagnostics Modal */}
      <FullStackConnectionModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        serverHealth={serverHealth}
        isBackendConnected={isBackendConnected}
        onRefreshHealth={checkServerHealth}
      />

      {/* Clean Academic Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">
              Student Feedback Sentiment Analysis
            </span>
            <span>&bull;</span>
            <span>B.Tech AI Mini-Capstone Project &bull; Indian Classroom Evaluation</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 underline font-medium cursor-pointer"
            >
              Full-Stack Architecture Diagnostics
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('docs')}
              className="text-indigo-600 hover:text-indigo-800 underline font-medium cursor-pointer"
            >
              Academic Documentation &amp; Viva Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
