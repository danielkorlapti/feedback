import React from 'react';
import {
  Smile,
  Frown,
  Meh,
  BarChart3,
  Sparkles,
  ArrowRight,
  Server,
  RefreshCw,
  TrendingUp,
  Tag,
  Building2,
  Award,
  BookOpen,
  AlertTriangle,
  GraduationCap,
  Clock,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { FeedbackItem, FeedbackPatternType } from '../types';
import { TabType } from './Navbar';

interface DashboardViewProps {
  feedbackList: FeedbackItem[];
  setActiveTab: (tab: TabType) => void;
  onResetSamples: () => void;
  onClearAll: () => void;
  onOpenDiagnostics?: () => void;
  isBackendConnected?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  feedbackList,
  setActiveTab,
  onResetSamples,
  onClearAll,
  onOpenDiagnostics,
  isBackendConnected = true,
}) => {
  const total = feedbackList.length;
  const positiveCount = feedbackList.filter((f) => f.sentiment === 'Positive').length;
  const negativeCount = feedbackList.filter((f) => f.sentiment === 'Negative').length;
  const neutralCount = feedbackList.filter((f) => f.sentiment === 'Neutral').length;
  const mixedCount = feedbackList.filter((f) => f.isMixed).length;

  const positivePercent = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((negativeCount / total) * 100) : 0;
  const neutralPercent = total > 0 ? 100 - positivePercent - negativePercent : 0;

  // Department / Branch distribution
  const departmentCounts: Record<string, number> = {};
  feedbackList.forEach((item) => {
    const dept = item.department?.trim() || 'General Academics';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  // NAAC Criteria distribution
  const naacCounts: Record<string, number> = {};
  feedbackList.forEach((item) => {
    if (item.naacCriteria) {
      naacCounts[item.naacCriteria] = (naacCounts[item.naacCriteria] || 0) + 1;
    }
  });

  // Academic Patterns Breakdown
  const patternCounts: Record<string, number> = {};
  feedbackList.forEach((item) => {
    const p = item.detectedPattern || item.followUpPlan?.patternType || 'Pedagogical & Boardwork Delivery';
    patternCounts[p] = (patternCounts[p] || 0) + 1;
  });

  // High Urgency Follow-Up Items
  const urgentItems = feedbackList.filter(
    (item) =>
      item.followUpPlan?.urgency === 'High' ||
      item.sentiment === 'Negative' ||
      item.isMixed
  );

  // Recent feedback entries (top 4)
  const recentFeedback = [...feedbackList].slice(0, 4);

  return (
    <div className="space-y-6">
      {/* College Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-white/10 text-indigo-200 text-xs font-semibold mb-2 backdrop-blur-xs border border-white/10">
            <span>B.Tech AI Capstone &bull; Indian Engineering Classrooms</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Feedback Sentiment Dashboard</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            Automated qualitative AI analysis for college faculty, laboratory in-charges, and Internal
            Quality Assurance Cells (IQAC). Evaluates blackboard teaching, lab compilers, projectors, and syllabus pacing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('analyze')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-sm hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Analyze Classroom Feedback</span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-medium text-sm transition-colors border border-indigo-600/50 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>IQAC AI Summary</span>
          </button>
        </div>
      </div>

      {/* Full-Stack Architecture & Sync Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <Server className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Full-Stack Architecture:</span>{' '}
            Express server REST API (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-indigo-700">/api/feedbacks</code>) synced with client storage.
            Accreditation ready for NAAC &amp; NBA evaluation.
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {onOpenDiagnostics && (
            <button
              onClick={onOpenDiagnostics}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold transition-colors cursor-pointer text-xs"
            >
              <Activity className="w-3 h-3 text-indigo-600" />
              <span>Fullstack Diagnostics</span>
            </button>
          )}
          <button
            onClick={onResetSamples}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 font-medium transition-colors cursor-pointer shadow-2xs"
            title="Reset to Indian college samples"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset College Samples</span>
          </button>
          <button
            onClick={onClearAll}
            className="text-slate-500 hover:text-rose-600 underline cursor-pointer text-[11px]"
          >
            Clear Records
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Feedback</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{total}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Analyzed entries</span>
            {mixedCount > 0 && (
              <span className="text-purple-600 font-semibold">({mixedCount} mixed opinions)</span>
            )}
          </div>
        </div>

        {/* Positive Card */}
        <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Positive Sentiment
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-extrabold text-emerald-600">{positiveCount}</div>
            <div className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              {positivePercent}%
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">Teaching clarity &amp; lab assistance</div>
        </div>

        {/* Negative Card */}
        <div className="bg-white rounded-xl p-5 border border-rose-200 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Negative Sentiment
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Frown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-extrabold text-rose-600">{negativeCount}</div>
            <div className="text-sm font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
              {negativePercent}%
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">Lab PC crashes &amp; projector faults</div>
        </div>

        {/* Neutral Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400"></div>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Neutral Sentiment
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Meh className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-extrabold text-slate-700">{neutralCount}</div>
            <div className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              {neutralPercent}%
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">ERP timetable &amp; balanced views</div>
        </div>
      </div>

      {/* The Part That Follows Up the Pattern: Identified Pattern Distribution & Follow-Up Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Pattern Analysis &amp; Action Taken Report (ATR) Tracking</span>
            </div>
            <h2 className="font-bold text-slate-900 text-base">
              Identified Academic Patterns &amp; Institutional Follow-Up Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Classifies student opinions into actionable patterns and maps them to follow-up intervention SLAs.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('summary')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <span>View Full Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pattern Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(patternCounts).map(([pattern, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isHigh =
              pattern.includes('Lab') || pattern.includes('Pacing') || pattern.includes('ICT');
            return (
              <div
                key={pattern}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs line-clamp-1">{pattern}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isHigh ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {count} records ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${isHigh ? 'bg-amber-500' : 'bg-indigo-600'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>SLA: {isHigh ? '2-4 Days' : '7-14 Days'}</span>
                  <span className="text-indigo-600 font-semibold">Follow-Up Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Urgent Action Taken Items Banner */}
        {urgentItems.length > 0 && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-bold text-amber-950 block">
                {urgentItems.length} Urgent Follow-Up Action Items Flagged:
              </span>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Lab systems experiencing crashes, loose HDMI lecture hall cables, and rushed syllabus pacing require faculty/HOD resolution within 48h to prevent academic disruption.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              Review Actions
            </button>
          </div>
        )}
      </div>

      {/* Distribution Chart & Branch Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Classroom Sentiment Distribution</h2>
              <p className="text-xs text-slate-500">
                Proportional breakdown of classified student feedback
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700">
              3-Class Model
            </span>
          </div>

          {/* Stacked Bar Distribution */}
          <div className="space-y-3">
            <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${positivePercent}%` }}
                className="bg-emerald-500 transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                title={`Positive: ${positivePercent}%`}
              >
                {positivePercent > 8 ? `${positivePercent}%` : ''}
              </div>
              <div
                style={{ width: `${negativePercent}%` }}
                className="bg-rose-500 transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                title={`Negative: ${negativePercent}%`}
              >
                {negativePercent > 8 ? `${negativePercent}%` : ''}
              </div>
              <div
                style={{ width: `${neutralPercent}%` }}
                className="bg-slate-400 transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                title={`Neutral: ${neutralPercent}%`}
              >
                {neutralPercent > 8 ? `${neutralPercent}%` : ''}
              </div>
            </div>

            {/* Legend with counts */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800">Positive ({positivePercent}%)</div>
                  <div className="text-slate-500">{positiveCount} student entries</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800">Negative ({negativePercent}%)</div>
                  <div className="text-slate-500">{negativeCount} student entries</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-400 shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800">Neutral ({neutralPercent}%)</div>
                  <div className="text-slate-500">{neutralCount} student entries</div>
                </div>
              </div>
            </div>
          </div>

          {/* NAAC Criteria Alignment Breakdown */}
          {Object.keys(naacCounts).length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>NAAC Accreditation Quality Distribution:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(naacCounts).map(([crit, cnt]) => (
                  <div
                    key={crit}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">{crit}</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {cnt} logs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Branch / Department Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base mb-1">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Feedback by B.Tech Branch</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Departmental distribution</p>

            <div className="space-y-3">
              {Object.entries(departmentCounts).map(([dept, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-800 truncate max-w-[170px]" title={dept}>
                        {dept}
                      </span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('history')}
              className="w-full flex items-center justify-center space-x-1 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <span>View Full Feedback Records Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Feedback Stream */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Recently Analyzed Classroom Feedback</h2>
            <p className="text-xs text-slate-500">Live feed from Indian engineering classes</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>View All ({total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentFeedback.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No feedback entries found. Click &quot;Analyze Classroom Feedback&quot; to begin!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentFeedback.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        item.sentiment === 'Positive'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.sentiment === 'Negative'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-200 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {item.sentiment}
                      {item.isMixed && (
                        <span className="ml-1 text-[10px] font-normal text-purple-700 bg-purple-100 px-1 rounded">
                          Mixed
                        </span>
                      )}
                    </span>

                    <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-800 line-clamp-2 italic font-serif leading-relaxed">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 truncate max-w-[170px] font-medium">
                    {item.department ? item.department.split(' ')[0] : 'CSE'} &bull; {item.facultyOrSubject || 'Academics'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span className="text-indigo-600 font-semibold truncate max-w-[110px]">
                      {item.detectedPattern || item.keyTopics[0] || 'General'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
