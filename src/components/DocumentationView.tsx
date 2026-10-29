import React, { useState } from 'react';
import {
  BookOpen,
  GitFork,
  ArrowRight,
  CheckCircle2,
  Copy,
  Printer,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { DOCUMENTATION_SECTIONS } from '../data/mockData';

export const DocumentationView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(DOCUMENTATION_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const workflowSteps = [
    { step: 1, title: 'Student Input', desc: 'Accepts natural language text, department, subject & semester' },
    { step: 2, title: 'Clear Input Validation', desc: 'Real-time length checks with actionable error guidance' },
    { step: 3, title: 'Full-Stack REST Proxy', desc: 'Express /api/analyze-sentiment manages API key & health' },
    { step: 4, title: 'Zero-Shot Prompting', desc: 'Injection-proof schema prompts with academic auditor persona' },
    { step: 5, title: 'Hybrid AI Inference', desc: 'Google Gemini LLM with instant Academic Rule-Based fallback' },
    { step: 6, title: 'Pattern Recognition', desc: 'Identifies pedagogical, lab hardware, ICT, or curriculum patterns' },
    { step: 7, title: 'Follow-Up ATR Plan', desc: 'Generates 3-stage Action Taken Report (48h, HOD, NAAC filing)' },
    { step: 8, title: 'Full-Stack Sync', desc: 'Persists to backend REST store with local client caching' },
    { step: 9, title: 'Quality Dashboard', desc: 'Aggregates branch metrics, pattern ratios & urgent alerts' },
    { step: 10, title: 'IQAC Synthesis', desc: 'Generates campus quality roadmap & empirical benchmark' },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSections = DOCUMENTATION_SECTIONS.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Academic Capstone Portfolio</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Project Documentation &amp; AI Workflow
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete 16-section technical report and methodology flowchart designed for B.Tech second-year
            faculty review and viva voce defense.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* AI Methodology Flowchart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                10-Step AI System Methodology Flowchart
              </h2>
              <p className="text-xs text-slate-500">
                End-to-end data pipeline from raw user feedback to Gemini inference and analytics
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700">
            Pipeline Architecture
          </span>
        </div>

        {/* Horizontal / Grid Visual Flowchart */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {workflowSteps.map((item, idx) => (
            <div
              key={item.step}
              className="relative p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  {idx < workflowSteps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 hidden sm:block" />
                  )}
                </div>
                <h3 className="font-bold text-xs text-slate-900">{item.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 16-Section Technical Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 sticky top-20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Report Sections (1-16)
            </span>
            <span className="text-[11px] text-slate-400">{DOCUMENTATION_SECTIONS.length} chapters</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in documentation..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  activeSectionId === sec.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className={`w-5 text-[10px] text-center font-mono font-bold ${
                      activeSectionId === sec.id ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    #{sec.number}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Documentation Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {filteredSections
            .filter((sec) => sec.id === activeSectionId || searchQuery.length > 0)
            .map((sec) => (
              <div
                key={sec.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Section {sec.number}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{sec.title}</h3>
                  </div>

                  <button
                    onClick={() => handleCopy(sec.id, sec.content)}
                    className="flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {copiedId === sec.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100/80">
                  {sec.content}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
