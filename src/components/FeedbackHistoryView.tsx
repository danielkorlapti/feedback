import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Download,
  Database,
  RefreshCw,
  Award,
  BookOpen,
  GraduationCap,
  Smile,
  Frown,
  Meh,
  Tag,
  Building,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { FeedbackItem, SentimentType, FeedbackPatternType } from '../types';
import { INDIAN_BRANCHES } from '../data/mockData';
import { PatternFollowUpCard } from './PatternFollowUpCard';

interface FeedbackHistoryViewProps {
  feedbackList: FeedbackItem[];
  onDeleteFeedback: (id: string) => void;
  onClearAll: () => void;
  onResetSamples: () => void;
}

const ALL_PATTERNS: FeedbackPatternType[] = [
  'Pedagogical & Boardwork Delivery',
  'Lab Hardware & Compiler Environment',
  'Classroom ICT & AV Infrastructure',
  'Curricular Pacing & Syllabus Rush',
  'Administrative & Examination Notice',
  'Mixed Duality (Teaching vs Facility)',
];

export const FeedbackHistoryView: React.FC<FeedbackHistoryViewProps> = ({
  feedbackList,
  onDeleteFeedback,
  onClearAll,
  onResetSamples,
}) => {
  const [filterSentiment, setFilterSentiment] = useState<'All' | SentimentType>('All');
  const [filterBranch, setFilterBranch] = useState<string>('All');
  const [filterPattern, setFilterPattern] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);

  // Filter & Search logic
  const filteredList = feedbackList.filter((item) => {
    const matchesSentiment = filterSentiment === 'All' || item.sentiment === filterSentiment;
    const matchesBranch = filterBranch === 'All' || item.department === filterBranch;
    const matchesPattern =
      filterPattern === 'All' ||
      item.detectedPattern === filterPattern ||
      item.followUpPlan?.patternType === filterPattern;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.text.toLowerCase().includes(q) ||
      (item.department && item.department.toLowerCase().includes(q)) ||
      (item.facultyOrSubject && item.facultyOrSubject.toLowerCase().includes(q)) ||
      (item.detectedPattern && item.detectedPattern.toLowerCase().includes(q)) ||
      item.keyTopics.some((t) => t.toLowerCase().includes(q));

    return matchesSentiment && matchesBranch && matchesPattern && matchesSearch;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (feedbackList.length === 0) return;

    const headers = [
      'ID',
      'Sentiment',
      'IsMixed',
      'PatternCategory',
      'Branch',
      'Subject_Faculty',
      'Semester',
      'NAAC_Criterion',
      'Topics',
      'Timestamp',
      'FeedbackText',
      'AI_Explanation',
      'Faculty_Immediate_Action',
      'ATR_Institutional_Action',
    ];
    const rows = feedbackList.map((f) => [
      f.id,
      f.sentiment,
      f.isMixed ? 'Yes' : 'No',
      `"${f.detectedPattern || f.followUpPlan?.patternType || 'Pedagogical'}"`,
      `"${(f.department || '').replace(/"/g, '""')}"`,
      `"${(f.facultyOrSubject || '').replace(/"/g, '""')}"`,
      `"${(f.semester || '').replace(/"/g, '""')}"`,
      `"${(f.naacCriteria || '').replace(/"/g, '""')}"`,
      `"${f.keyTopics.join('; ')}"`,
      `"${f.timestamp}"`,
      `"${f.text.replace(/"/g, '""')}"`,
      `"${f.explanation.replace(/"/g, '""')}"`,
      `"${(f.followUpPlan?.immediateIntervention || f.facultyActionRecommendation || '').replace(/"/g, '""')}"`,
      `"${(f.followUpPlan?.institutionalFollowUp || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `indian_college_feedback_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Academic Feedback Audit Log</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Feedback History &amp; Pattern Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Student submissions across Indian engineering branches with closed-loop Action Taken Reports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            disabled={feedbackList.length === 0}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export IQAC CSV</span>
          </button>
          <button
            onClick={onResetSamples}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Samples</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, teacher, topic..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Sentiment Filter */}
          <div>
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>

          {/* Pattern Filter */}
          <div>
            <select
              value={filterPattern}
              onChange={(e) => setFilterPattern(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Academic Patterns</option>
              {ALL_PATTERNS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Engineering Branches</option>
              {INDIAN_BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter count status */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-900">{filteredList.length}</strong> of{' '}
            <strong className="text-slate-900">{feedbackList.length}</strong> student records
          </span>
          {feedbackList.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-rose-600 hover:text-rose-800 text-xs font-medium cursor-pointer"
            >
              Clear All Records
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">No Matching Feedback Records</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Try adjusting your search filters or reset to the Indian college demo dataset.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Feedback Remark</th>
                  <th className="py-3 px-3 w-32">Sentiment</th>
                  <th className="py-3 px-3 w-40">Identified Pattern</th>
                  <th className="py-3 px-3 w-40">Branch &amp; Subject</th>
                  <th className="py-3 px-3 w-32">Date &amp; Time</th>
                  <th className="py-3 px-3 w-16 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-start space-x-2">
                        {item.isSample && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Demo
                          </span>
                        )}
                        <div>
                          <p className="text-slate-800 font-normal line-clamp-2 leading-relaxed">
                            &ldquo;{item.text}&rdquo;
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[11px] text-slate-400 line-clamp-1">
                              {item.explanation}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.sentiment === 'Positive'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.sentiment === 'Negative'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-slate-200 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {item.sentiment}
                        </span>
                        {item.isMixed && (
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 rounded">
                            Mixed
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 truncate max-w-[150px]">
                        {item.detectedPattern || item.followUpPlan?.patternType || 'Pedagogical'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium truncate max-w-[160px]">
                        {item.department ? item.department.split(' ')[0] : 'General'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {item.facultyOrSubject || 'Coursework'}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                      {item.timestamp}
                    </td>

                    <td
                      className="py-3 px-3 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onDeleteFeedback(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Comprehensive Detail & ATR Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedItem.sentiment === 'Positive'
                      ? 'bg-emerald-600 text-white'
                      : selectedItem.sentiment === 'Negative'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {selectedItem.sentiment}
                </span>
                {selectedItem.isMixed && (
                  <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    Mixed Opinion
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">{selectedItem.timestamp}</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Student Feedback Statement
                </span>
                <p className="mt-1 p-3 bg-slate-50 rounded-xl text-slate-900 italic font-serif text-sm leading-relaxed border-l-4 border-indigo-600">
                  &ldquo;{selectedItem.text}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Branch
                  </span>
                  <span className="font-semibold text-slate-800">{selectedItem.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Subject / Faculty
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedItem.facultyOrSubject || 'Coursework'}
                  </span>
                </div>
              </div>

              {/* Render Full Pattern & Follow-Up Plan if available */}
              {selectedItem.followUpPlan ? (
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                    Closed-Loop Follow-Up Plan (ATR)
                  </span>
                  <PatternFollowUpCard plan={selectedItem.followUpPlan} compact />
                </div>
              ) : (
                selectedItem.facultyActionRecommendation && (
                  <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-950 uppercase tracking-wider text-[10px] block mb-0.5">
                      Suggested Action:
                    </span>
                    <p className="text-indigo-900 text-[11px] leading-relaxed">
                      {selectedItem.facultyActionRecommendation}
                    </p>
                  </div>
                )
              )}

              {selectedItem.naacCriteria && (
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    NAAC Accreditation Criterion
                  </span>
                  <div className="mt-1 flex items-center space-x-1.5 text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selectedItem.naacCriteria}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
