import React, { useState } from 'react';
import { AlertCircle, RefreshCw, X, ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';

interface ClearErrorBannerProps {
  error: string;
  code?: string;
  suggestion?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  onUseSample?: () => void;
  technicalDetails?: string;
}

export const ClearErrorBanner: React.FC<ClearErrorBannerProps> = ({
  error,
  code,
  suggestion,
  onRetry,
  onDismiss,
  onUseSample,
  technicalDetails,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Derive user-friendly suggestions based on error content if not provided
  let friendlySuggestion = suggestion;
  if (!friendlySuggestion) {
    if (error.toLowerCase().includes('api_key') || error.toLowerCase().includes('gemini')) {
      friendlySuggestion =
        'The server is ready. You can add your GEMINI_API_KEY into the .env file, or rely on our built-in Academic Rule-Based Engine which works 100% offline without any API key.';
    } else if (error.toLowerCase().includes('short')) {
      friendlySuggestion =
        'Please enter at least a few words describing the classroom experience, blackboard teaching, lab equipment, or syllabus pacing.';
    } else if (error.toLowerCase().includes('failed to fetch') || error.toLowerCase().includes('network')) {
      friendlySuggestion =
        'Unable to reach Express backend on port 3000. Ensure the full-stack server is running (`npm run dev`).';
    } else {
      friendlySuggestion =
        'Try submitting again, or use one of the demonstration preset samples to test the analysis workflow immediately.';
    }
  }

  return (
    <div className="rounded-2xl border border-rose-300 bg-rose-50/90 p-4 shadow-sm text-slate-800 space-y-3 transition-all animate-fadeIn">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-rose-900 text-sm">Action Notice / Error Detected</span>
              {code && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-rose-200/80 text-rose-800">
                  {code}
                </span>
              )}
            </div>
            <p className="text-xs text-rose-800 mt-1 font-medium leading-relaxed">{error}</p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Clear Guidance / How to resolve */}
      <div className="bg-white/80 rounded-xl p-3 border border-rose-200/60 text-xs text-slate-700 flex items-start space-x-2">
        <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-slate-900 block mb-0.5">Recommended Resolution:</span>
          <p className="text-slate-600 leading-normal">{friendlySuggestion}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Request</span>
          </button>
        )}

        {onUseSample && (
          <button
            onClick={onUseSample}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-medium text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Quick Demo Sample</span>
          </button>
        )}

        {technicalDetails && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 text-[11px] underline ml-auto cursor-pointer"
          >
            <span>{showDetails ? 'Hide Diagnostics' : 'View Diagnostics'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Collapsible Technical Details */}
      {showDetails && technicalDetails && (
        <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36 border border-slate-800">
          {technicalDetails}
        </pre>
      )}
    </div>
  );
};
