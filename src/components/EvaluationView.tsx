import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
  Award,
  BookOpen,
  Info,
  Scale,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { EvaluationItem, EvaluationSummary } from '../types';
import { BENCHMARK_TEST_DATASET } from '../data/mockData';
import { ClearErrorBanner } from './ClearErrorBanner';
import { apiClient } from '../utils/apiClient';

export const EvaluationView: React.FC = () => {
  const [testDataset, setTestDataset] = useState<EvaluationItem[]>(BENCHMARK_TEST_DATASET);
  const [evaluationSummary, setEvaluationSummary] = useState<EvaluationSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);

  // Run benchmark test suite through backend (or resilient client engine fallback)
  const handleRunEvaluation = async () => {
    setIsRunning(true);
    setErrorMessage(null);
    setErrorCode(undefined);

    try {
      const data = await apiClient.evaluateBenchmark(testDataset);

      setTestDataset(data.items);
      setEvaluationSummary({
        total: data.total,
        correct: data.correct,
        incorrect: data.incorrect,
        accuracy: data.accuracy,
        testedAt: data.testedAt,
      });
    } catch (err: any) {
      console.error('Benchmark error:', err);
      setErrorMessage(err.message || 'Error occurred while running evaluation benchmark.');
      setErrorCode('ERR_BENCHMARK_FAILED');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Model Validation &amp; Metrics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Accuracy &amp; Model Evaluation Benchmark
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Empirical evaluation against a curated ground-truth engineering test dataset
            covering Teaching, Facilities, Labs, and Mixed sentiment patterns.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunning}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs disabled:opacity-50 transition-all cursor-pointer"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluating Test Cases...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Model Evaluation Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* Evaluation Formula Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-indigo-300 tracking-wider">
              Academic Evaluation Metric
            </div>
            <div className="mt-1 font-mono text-base font-semibold text-emerald-400">
              Accuracy (%) = (Number of Correct Predictions / Total Test Entries) &times; 100
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Standard 3-Class classification evaluation (Positive, Negative, Neutral) with consistent
              mixed-opinion grounding rules and pattern identification.
            </p>
          </div>

          {evaluationSummary ? (
            <div className="flex items-center space-x-4 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-xs border border-white/10">
              <div className="text-center">
                <span className="text-xs text-slate-300 block">Total Tested</span>
                <span className="text-xl font-bold text-white">{evaluationSummary.total}</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <span className="text-xs text-emerald-300 block">Correct</span>
                <span className="text-xl font-bold text-emerald-400">{evaluationSummary.correct}</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <span className="text-xs text-rose-300 block">Incorrect</span>
                <span className="text-xl font-bold text-rose-400">{evaluationSummary.incorrect}</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <span className="text-xs text-amber-300 block">Model Accuracy</span>
                <span className="text-2xl font-black text-amber-300">
                  {evaluationSummary.accuracy}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">
              Benchmark not yet executed. Click &quot;Run Model Evaluation Benchmark&quot; to test live.
            </div>
          )}
        </div>
      </div>

      {/* Clear Error Banner */}
      {errorMessage && (
        <ClearErrorBanner
          error={errorMessage}
          code={errorCode}
          onRetry={handleRunEvaluation}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* Summary KPI Cards when evaluated */}
      {evaluationSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold block uppercase">Total Test Entries</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {evaluationSummary.total}
            </span>
            <span className="text-[11px] text-slate-500">Fixed ground truth dataset</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs">
            <span className="text-xs text-emerald-800 font-semibold block uppercase">
              Correct Predictions
            </span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">
              {evaluationSummary.correct}
            </span>
            <span className="text-[11px] text-emerald-700">Matched ground truth label</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-rose-200 shadow-2xs">
            <span className="text-xs text-rose-800 font-semibold block uppercase">
              Incorrect Predictions
            </span>
            <span className="text-2xl font-bold text-rose-600 mt-1 block">
              {evaluationSummary.incorrect}
            </span>
            <span className="text-[11px] text-rose-700">Mismatched classifications</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-indigo-200 shadow-2xs">
            <span className="text-xs text-indigo-800 font-semibold block uppercase">
              Calculated Accuracy
            </span>
            <span className="text-2xl font-black text-indigo-600 mt-1 block">
              {evaluationSummary.accuracy}%
            </span>
            <span className="text-[11px] text-slate-500">Live empirical result</span>
          </div>
        </div>
      )}

      {/* Test Dataset Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Ground-Truth Benchmark Dataset</h2>
            <p className="text-xs text-slate-500">
              Each test case is paired with a verified expected label for direct accuracy calculation
            </p>
          </div>
          {evaluationSummary?.testedAt && (
            <span className="text-[11px] text-slate-400">
              Evaluated: {new Date(evaluationSummary.testedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-3">Test Feedback Sentence</th>
                <th className="py-3 px-3 w-28">Domain</th>
                <th className="py-3 px-3 w-28">Expected Label</th>
                <th className="py-3 px-3 w-28">Model Prediction</th>
                <th className="py-3 px-3 w-24 text-center">Status</th>
                <th className="py-3 px-4 w-52">AI Explanation / Pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testDataset.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-slate-400 font-semibold">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3 text-slate-900 font-medium">
                    <p className="font-serif italic leading-relaxed">&ldquo;{item.feedback}&rdquo;</p>
                    {item.notes && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">{item.notes}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.testCategory}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.expectedSentiment === 'Positive'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.expectedSentiment === 'Negative'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {item.expectedSentiment}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {item.predictedSentiment ? (
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.predictedSentiment === 'Positive'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.predictedSentiment === 'Negative'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {item.predictedSentiment}
                        {item.isMixed && ' (Mixed)'}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Pending run</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.isCorrect !== undefined ? (
                      item.isCorrect ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>PASS</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-rose-600 font-bold text-xs">
                          <XCircle className="w-4 h-4" />
                          <span>FAIL</span>
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400">&bull;&bull;&bull;</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {item.patternDetected && (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px] mb-1">
                        {item.patternDetected}
                      </span>
                    )}
                    <p className="leading-snug">{item.explanation || item.notes}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
