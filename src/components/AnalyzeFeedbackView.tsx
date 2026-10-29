import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Tag,
  Building,
  Check,
  X,
  FileQuestion,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  ShieldCheck,
  Copy,
} from 'lucide-react';
import { FeedbackItem, SentimentType, FeedbackPatternType } from '../types';
import { PRESET_INPUT_SAMPLES, INDIAN_BRANCHES } from '../data/mockData';
import { ClearErrorBanner } from './ClearErrorBanner';
import { PatternFollowUpCard } from './PatternFollowUpCard';

interface AnalyzeFeedbackViewProps {
  onFeedbackAnalyzed: (item: FeedbackItem) => void;
}

export const AnalyzeFeedbackView: React.FC<AnalyzeFeedbackViewProps> = ({
  onFeedbackAnalyzed,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [department, setDepartment] = useState('CSE (Computer Science & Engg)');
  const [facultyOrSubject, setFacultyOrSubject] = useState('');
  const [semester, setSemester] = useState('3rd Semester (2nd Year)');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [errorSuggestion, setErrorSuggestion] = useState<string | undefined>(undefined);
  const [currentResult, setCurrentResult] = useState<FeedbackItem | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Character count & validation hints
  const textLength = feedbackText.trim().length;
  const isInputValid = textLength >= 3 && textLength <= 3000;

  // Handle Preset Click
  const handleSelectPreset = (sample: (typeof PRESET_INPUT_SAMPLES)[0]) => {
    setFeedbackText(sample.text);
    setDepartment(sample.department);
    setFacultyOrSubject(sample.facultyOrSubject);
    setSemester(sample.semester);
    setErrorMessage(null);
    setErrorCode(undefined);
  };

  // Submit Feedback to Backend
  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = feedbackText.trim();
    if (!trimmed) {
      setErrorMessage('Please enter student feedback text before analyzing.');
      setErrorCode('ERR_EMPTY_INPUT');
      setErrorSuggestion('Type or select a realistic classroom experience review from the demonstration samples above.');
      return;
    }
    if (trimmed.length < 3) {
      setErrorMessage('Feedback text is too short. Please provide at least 3 characters.');
      setErrorCode('ERR_TOO_SHORT');
      setErrorSuggestion('Add details about the subject, instructor teaching style, lab equipment, or syllabus pacing.');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Validating student feedback input...');
    setErrorMessage(null);
    setErrorCode(undefined);
    setErrorSuggestion(undefined);
    setSavedSuccess(false);

    try {
      setLoadingStep('Connecting to Full-Stack REST API (/api/analyze-sentiment)...');
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          department: department.trim() || undefined,
          facultyOrSubject: facultyOrSubject.trim() || undefined,
          semester: semester.trim() || undefined,
        }),
      });

      setLoadingStep('Synthesizing Sentiment, Academic Pattern & ATR Roadmap...');
      const data = await response.json();

      if (!response.ok) {
        setErrorCode(data.code || 'ERR_API_FAILURE');
        setErrorSuggestion(data.suggestion);
        throw new Error(data.error || 'Server error while analyzing feedback.');
      }

      const newItem: FeedbackItem = {
        id: 'fb-' + Date.now(),
        text: trimmed,
        department: department.trim() || 'CSE (Computer Science & Engg)',
        facultyOrSubject: facultyOrSubject.trim() || 'Theory / Practical Session',
        semester: semester.trim() || '2nd Year B.Tech',
        sentiment: data.sentiment as SentimentType,
        isMixed: Boolean(data.isMixed),
        explanation: data.explanation,
        keyTopics: data.keyTopics || ['General Academics'],
        positiveAspects: data.positiveAspects || [],
        negativeAspects: data.negativeAspects || [],
        confidenceScore: data.confidenceScore || 95,
        naacCriteria: data.naacCriteria || 'Criterion 2: Teaching-Learning & Evaluation',
        facultyActionRecommendation:
          data.facultyActionRecommendation ||
          'Review student feedback for continuous classroom improvement.',
        detectedPattern: data.detectedPattern as FeedbackPatternType,
        followUpPlan: data.followUpPlan,
        engineUsed: data.engineUsed || 'Gemini AI',
        processingTimeMs: data.processingTimeMs,
        timestamp: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        isSample: false,
      };

      setCurrentResult(newItem);
      onFeedbackAnalyzed(newItem);
      setSavedSuccess(true);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Failed to communicate with AI analysis server.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Copy full report
  const handleCopyReport = () => {
    if (!currentResult) return;
    const report = `=== ACADEMIC FEEDBACK EVALUATION REPORT ===
Timestamp: ${currentResult.timestamp}
Department: ${currentResult.department}
Subject / Faculty: ${currentResult.facultyOrSubject || 'N/A'}
Semester: ${currentResult.semester || 'N/A'}
Sentiment Classification: ${currentResult.sentiment}${currentResult.isMixed ? ' (Mixed Opinion)' : ''}
Confidence Score: ${currentResult.confidenceScore}%
Inference Engine: ${currentResult.engineUsed || 'Gemini AI'}
Student Remark: "${currentResult.text}"

AI Justification:
${currentResult.explanation}

Identified Academic Pattern:
${currentResult.detectedPattern || 'Pedagogical & Boardwork Delivery'}

NAAC Accreditation Alignment:
${currentResult.naacCriteria}

Action Taken Report (ATR) Follow-Up:
- Immediate Intervention (48h): ${currentResult.followUpPlan?.immediateIntervention || currentResult.facultyActionRecommendation}
- Institutional Review (HOD): ${currentResult.followUpPlan?.institutionalFollowUp || 'HOD monthly audit'}
- Compliance Filing: ${currentResult.followUpPlan?.naacComplianceDoc || 'NAAC Criterion File'}
- Urgency: ${currentResult.followUpPlan?.urgency || 'Medium'} (${currentResult.followUpPlan?.targetResolutionDays || 4} Days SLA)
===========================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Clear form
  const handleClear = () => {
    setFeedbackText('');
    setFacultyOrSubject('');
    setErrorMessage(null);
    setErrorCode(undefined);
    setErrorSuggestion(undefined);
    setCurrentResult(null);
    setSavedSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Indian Classroom Feedback Analysis</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Analyze Student Feedback
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Input student reviews regarding blackboard teaching, derivation pace, programming labs,
          mid-term question banks, or college amenities.
        </p>
      </div>

      {/* Preset Quick Load Samples */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Demonstration Presets (Realistic Indian Engineering Scenarios):</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click to auto-populate form
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {PRESET_INPUT_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(sample)}
              className="text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-300 transition-all text-xs group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-indigo-900 line-clamp-1">
                  {sample.label}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    sample.type === 'Positive'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sample.type === 'Negative'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {sample.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-serif italic">
                &ldquo;{sample.text}&rdquo;
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on Left, Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Branch and Semester Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dept" className="block text-xs font-bold text-slate-800 mb-1.5">
                  Department / Engineering Branch
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    id="dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                  >
                    {INDIAN_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="sem" className="block text-xs font-bold text-slate-800 mb-1.5">
                  Academic Year / Semester
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    id="sem"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                  >
                    <option value="1st Semester (1st Year)">1st Semester (1st Year)</option>
                    <option value="2nd Semester (1st Year)">2nd Semester (1st Year)</option>
                    <option value="3rd Semester (2nd Year)">3rd Semester (2nd Year)</option>
                    <option value="4th Semester (2nd Year)">4th Semester (2nd Year)</option>
                    <option value="5th Semester (3rd Year)">5th Semester (3rd Year)</option>
                    <option value="6th Semester (3rd Year)">6th Semester (3rd Year)</option>
                    <option value="7th/8th Semester (4th Year)">Final Year B.Tech</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subject / Faculty Field */}
            <div>
              <label htmlFor="fac" className="block text-xs font-bold text-slate-800 mb-1.5">
                Subject or Faculty In-Charge{' '}
                <span className="text-slate-500 font-normal">(Optional context)</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="fac"
                  type="text"
                  value={facultyOrSubject}
                  onChange={(e) => setFacultyOrSubject(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms, Operating Systems, DBMS Lab, Prof. Sharma"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Feedback text area with Live Validation status */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="feedback-text" className="text-xs font-bold text-slate-800">
                  Student Feedback Remarks <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center space-x-2 text-[11px]">
                  {textLength > 0 && (
                    <span
                      className={`font-semibold ${
                        textLength < 3
                          ? 'text-rose-600'
                          : textLength < 10
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {textLength < 3 ? 'Too Short' : textLength < 10 ? 'Brief' : 'Optimal Length'}
                    </span>
                  )}
                  <span className="text-slate-500 font-mono">{feedbackText.length} / 3000 chars</span>
                </div>
              </div>
              <textarea
                id="feedback-text"
                rows={5}
                value={feedbackText}
                onChange={(e) => {
                  setFeedbackText(e.target.value);
                  if (errorMessage) {
                    setErrorMessage(null);
                    setErrorCode(undefined);
                  }
                }}
                placeholder="Enter feedback in natural language... (e.g. 'Prof. Venkat explains concepts clearly on the blackboard, but classroom projector HDMI cable is loose.')"
                className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all font-sans ${
                  errorMessage
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-indigo-500'
                }`}
                disabled={isLoading}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Completely anonymous: no roll numbers or personal credentials required.
              </p>
            </div>

            {/* Clear Error Banner if error occurs */}
            {errorMessage && (
              <ClearErrorBanner
                error={errorMessage}
                code={errorCode}
                suggestion={errorSuggestion}
                onRetry={handleAnalyze}
                onDismiss={() => {
                  setErrorMessage(null);
                  setErrorCode(undefined);
                }}
                onUseSample={() => handleSelectPreset(PRESET_INPUT_SAMPLES[0])}
              />
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading || (!feedbackText && !facultyOrSubject)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isLoading || !feedbackText.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Feedback...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Analyze Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Card Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>AI Classification Verdict</span>
            {currentResult && (
              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                  {currentResult.engineUsed || 'Gemini AI'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Confidence: <strong className="text-slate-800">{currentResult.confidenceScore}%</strong>
                </span>
              </div>
            )}
          </div>

          {!currentResult && !isLoading && (
            <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileQuestion className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">No Feedback Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Type student feedback on the left or select a preset Indian classroom scenario above
                to run real-time sentiment and pattern extraction.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl p-8 border border-indigo-200 text-center space-y-4 shadow-xs">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Evaluating Classroom Feedback</h3>
                <p className="text-xs text-indigo-600 font-medium mt-1">
                  {loadingStep || 'Processing student opinion text through full-stack pipeline...'}
                </p>
              </div>
              <div className="w-48 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {currentResult && !isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
              {/* Header with Sentiment Badge */}
              <div
                className={`p-4 border-b ${
                  currentResult.sentiment === 'Positive'
                    ? 'bg-emerald-50 border-emerald-200'
                    : currentResult.sentiment === 'Negative'
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide flex items-center space-x-1.5 ${
                        currentResult.sentiment === 'Positive'
                          ? 'bg-emerald-600 text-white'
                          : currentResult.sentiment === 'Negative'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      <span>Sentiment:</span>
                      <span>{currentResult.sentiment}</span>
                    </span>

                    {currentResult.isMixed && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                        Mixed Opinion
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyReport}
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-700 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-lg border border-slate-200 cursor-pointer"
                      title="Copy complete analysis report"
                    >
                      {copiedReport ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Report</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] font-medium text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                      {currentResult.semester || '2nd Year'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Branch & Subject Info */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <div className="text-slate-600 truncate max-w-[200px]">
                    Branch: <strong className="text-slate-900">{currentResult.department}</strong>
                  </div>
                  {currentResult.facultyOrSubject && (
                    <div className="text-slate-600 truncate max-w-[180px]">
                      Subject: <strong className="text-slate-900">{currentResult.facultyOrSubject}</strong>
                    </div>
                  )}
                </div>

                {/* Original Feedback Quote */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Student Remark
                  </div>
                  <blockquote className="p-3 bg-slate-50 rounded-xl border-l-4 border-indigo-600 text-xs text-slate-800 font-serif italic leading-relaxed">
                    &ldquo;{currentResult.text}&rdquo;
                  </blockquote>
                </div>

                {/* Explanation */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    AI Sentiment Justification
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                    {currentResult.explanation}
                  </p>
                </div>

                {/* Mixed Aspects (if any) */}
                {(currentResult.positiveAspects && currentResult.positiveAspects.length > 0) ||
                (currentResult.negativeAspects && currentResult.negativeAspects.length > 0) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {currentResult.positiveAspects && currentResult.positiveAspects.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                        <div className="font-bold text-emerald-900 flex items-center space-x-1 mb-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Praise Aspects:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-emerald-800 text-[11px]">
                          {currentResult.positiveAspects.map((pos, i) => (
                            <li key={i}>{pos}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentResult.negativeAspects && currentResult.negativeAspects.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                        <div className="font-bold text-rose-900 flex items-center space-x-1 mb-1">
                          <X className="w-3.5 h-3.5 text-rose-600" />
                          <span>Grievance Aspects:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-rose-800 text-[11px]">
                          {currentResult.negativeAspects.map((neg, i) => (
                            <li key={i}>{neg}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* NAAC Accreditation Criteria & Key Topics */}
                <div className="space-y-2 pt-1">
                  {currentResult.naacCriteria && (
                    <div className="flex items-center space-x-2 text-xs">
                      <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-[11px] text-slate-500">NAAC Alignment:</span>
                      <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {currentResult.naacCriteria}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>Identified Classroom Topics</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentResult.keyTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* The Part That Follows Up the Pattern: Pattern & Closed-Loop Follow-Up Plan Card */}
                {currentResult.followUpPlan && (
                  <div className="pt-2">
                    <PatternFollowUpCard plan={currentResult.followUpPlan} />
                  </div>
                )}

                {/* Saved toast */}
                {savedSuccess && (
                  <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Saved to Full-Stack Backend Store &amp; Local Analytics Dashboard!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
