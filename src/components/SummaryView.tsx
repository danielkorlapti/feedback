import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Tag,
  Building,
  GraduationCap,
  Calendar,
  Layers,
  ShieldCheck,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { FeedbackItem, FeedbackSummaryResult } from '../types';
import { ClearErrorBanner } from './ClearErrorBanner';

interface SummaryViewProps {
  feedbackList: FeedbackItem[];
}

export const SummaryView: React.FC<SummaryViewProps> = ({ feedbackList }) => {
  const [summary, setSummary] = useState<FeedbackSummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const handleGenerateSummary = async () => {
    if (feedbackList.length === 0) {
      setErrorMessage('No feedback records available. Please analyze or load some feedback entries first.');
      setErrorCode('ERR_EMPTY_DATASET');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setErrorCode(undefined);

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackItems: feedbackList }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorCode(data.code || 'ERR_SUMMARY_FAILED');
        throw new Error(data.error || 'Server error while generating summary.');
      }

      setSummary(data);
    } catch (err: any) {
      console.error('Summary error:', err);
      setErrorMessage(err.message || 'Failed to generate AI summary.');
    } finally {
      setIsLoading(false);
    }
  };

  const copySummaryReport = () => {
    if (!summary) return;
    const text = `=== COLLEGE IQAC ACADEMIC QUALITY SUMMARY ===
Generated: ${new Date(summary.generatedAt).toLocaleString()}
Total Feedback Analyzed: ${summary.totalAnalyzed}

EXECUTIVE SUMMARY:
${summary.executiveSummary}

RECURRING POSITIVE OPINIONS:
${summary.commonPositiveOpinions.map((o) => `• ${o}`).join('\n')}

COMMON COMPLAINTS & GRIEVANCES:
${summary.commonComplaints.map((c) => `• ${c}`).join('\n')}

FREQUENTLY MENTIONED TOPICS:
${summary.frequentlyMentionedTopics.join(', ')}

CAMPUS & LAB IMPROVEMENTS:
${summary.suggestionsForImprovement.map((s) => `• ${s}`).join('\n')}

FACULTY & HOD ACTION ITEMS:
${summary.facultyActionItems.map((a) => `• ${a}`).join('\n')}
=============================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Academic IQAC Quality Reporting</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Overall AI Feedback Summary &amp; Pattern Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Synthesizes all current feedback into recurring strengths, complaints, pattern roadmaps,
            and actionable faculty recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {summary && (
            <button
              onClick={copySummaryReport}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Report</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy IQAC Report</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleGenerateSummary}
            disabled={isLoading || feedbackList.length === 0}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Records...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Feedback Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dataset Context Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>
            Active Pool: <strong className="text-slate-900">{feedbackList.length} feedback entries</strong> available for synthesis
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          * Strictly grounded in actual feedback entries without hallucinating fake opinions.
        </span>
      </div>

      {/* Clear Error banner */}
      {errorMessage && (
        <ClearErrorBanner
          error={errorMessage}
          code={errorCode}
          onRetry={handleGenerateSummary}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* Empty State */}
      {!summary && !isLoading && (
        <div className="bg-white rounded-2xl p-12 border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-slate-800 text-base">No Summary Generated Yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click the &quot;Generate Feedback Summary&quot; button above. The system will synthesize
              the {feedbackList.length} student feedback items currently stored in the system and extract common strengths,
              complaints, recurring patterns, and faculty action items.
            </p>
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={feedbackList.length === 0}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Now ({feedbackList.length} Records)</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4 shadow-xs">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <div>
            <h3 className="font-bold text-slate-800 text-base">Synthesizing Student Opinions</h3>
            <p className="text-xs text-slate-500 mt-1">
              Analyzing thematic patterns across {feedbackList.length} qualitative entries...
            </p>
          </div>
        </div>
      )}

      {/* Summary Content Cards */}
      {summary && !isLoading && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <h2 className="font-bold text-slate-900 text-base">Executive Quality Summary</h2>
              </div>
              <span className="text-[11px] text-slate-400">
                Generated: {new Date(summary.generatedAt).toLocaleString()} &bull; {summary.totalAnalyzed} entries
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              {summary.executiveSummary}
            </p>
          </div>

          {/* Recurring Patterns & Follow-up Roadmap */}
          {summary.recurringPatterns && summary.recurringPatterns.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-base pb-3 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Campus-Wide Recurring Patterns &amp; Follow-Up Roadmap (ATR)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {summary.recurringPatterns.map((pat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{pat.patternType}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {pat.prevalence}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      {pat.followUpRoadmap}
                    </p>
                    <div className="pt-1 text-[10px] text-indigo-700 font-semibold border-t border-slate-200">
                      Responsible: {pat.responsibleParty}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2-Column Strengths vs Complaints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-base pb-3 border-b border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Common Positive Opinions</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {summary.commonPositiveOpinions.map((op, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{op}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Complaints */}
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-base pb-3 border-b border-rose-100">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Common Complaints &amp; Pain Points</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {summary.commonComplaints.map((comp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 p-2.5 rounded-lg bg-rose-50/60 border border-rose-100/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{comp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Frequently Mentioned Topics */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
              <Tag className="w-5 h-5 text-indigo-600" />
              <span>Frequently Mentioned Academic Topics</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {summary.frequentlyMentionedTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center space-x-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Suggestions & Faculty Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* College Improvements */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-base pb-3 border-b border-slate-100">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>Suggestions for Campus &amp; Lab Improvement</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {summary.suggestionsForImprovement.map((sug, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 p-2.5 rounded-lg bg-amber-50/40 border border-amber-100/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Faculty Action Items */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-base pb-3 border-b border-slate-100">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>Action Items for Faculty &amp; HODs</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {summary.facultyActionItems.map((act, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
