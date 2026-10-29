import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  History,
  FileText,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Server,
  Activity,
} from 'lucide-react';
import { ServerHealthInfo } from '../types';

export type TabType = 'dashboard' | 'analyze' | 'history' | 'summary' | 'evaluation' | 'docs';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalFeedbackCount: number;
  isBackendConnected: boolean;
  serverHealth: ServerHealthInfo | null;
  onOpenDiagnostics: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalFeedbackCount,
  isBackendConnected,
  serverHealth,
  onOpenDiagnostics,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analyze', label: 'Analyze Feedback', icon: <Sparkles className="w-4 h-4" /> },
    {
      id: 'history',
      label: 'Feedback History',
      icon: <History className="w-4 h-4" />,
      badge: totalFeedbackCount,
    },
    { id: 'summary', label: 'AI Summary & Roadmap', icon: <FileText className="w-4 h-4" /> },
    { id: 'evaluation', label: 'Model Evaluation', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'docs', label: 'Academic Docs & Flow', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-lg leading-tight">
                  Student Feedback Sentiment Analysis
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  AI Mini-Capstone
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Indian Engineering Classrooms &bull; NAAC / NBA Quality Ready
              </p>
            </div>
          </div>

          {/* Full-Stack Live REST & AI Connection Diagnostics Pill */}
          <div className="flex items-center space-x-2.5 text-xs">
            <button
              onClick={onOpenDiagnostics}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click to open Full-Stack Architecture Diagnostics"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              ></span>
              <Server className="w-3.5 h-3.5" />
              <span>
                REST API: <strong className="font-semibold">{isBackendConnected ? 'Connected (Port 3000)' : 'Client Local'}</strong>
              </span>
              <Activity className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 -mx-2 px-2 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {typeof item.badge === 'number' && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
