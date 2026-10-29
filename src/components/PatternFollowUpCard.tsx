import React, { useState } from 'react';
import {
  GitCommit,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  Building,
  GraduationCap,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FeedbackPatternType, FollowUpActionPlan } from '../types';

interface PatternFollowUpCardProps {
  plan: FollowUpActionPlan;
  onStatusChange?: (newStatus: FollowUpActionPlan['actionStatus']) => void;
  compact?: boolean;
}

export const PatternFollowUpCard: React.FC<PatternFollowUpCardProps> = ({
  plan,
  onStatusChange,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(plan.actionStatus);

  const handleStatusUpdate = (status: FollowUpActionPlan['actionStatus']) => {
    setCurrentStatus(status);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  const copyATRText = () => {
    const text = `=== ACADEMIC ACTION TAKEN REPORT (ATR) ===
Pattern Category: ${plan.patternType} (Confidence: ${plan.patternConfidence}%)
Urgency Level: ${plan.urgency} | Target Resolution: ${plan.targetResolutionDays} Days
Root Cause: ${plan.rootCauseAnalysis}
Stage 1 (Immediate / 48h): ${plan.immediateIntervention}
Stage 2 (Department HOD / IQAC): ${plan.institutionalFollowUp}
Stage 3 (NAAC Audit Filing): ${plan.naacComplianceDoc}
Status: ${currentStatus}
==========================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color & Badge based on Pattern Type
  const getPatternMeta = (type: FeedbackPatternType) => {
    switch (type) {
      case 'Pedagogical & Boardwork Delivery':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: GraduationCap,
          color: 'text-emerald-600',
        };
      case 'Lab Hardware & Compiler Environment':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: AlertTriangle,
          color: 'text-rose-600',
        };
      case 'Classroom ICT & AV Infrastructure':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Building,
          color: 'text-amber-600',
        };
      case 'Curricular Pacing & Syllabus Rush':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Clock,
          color: 'text-purple-600',
        };
      case 'Mixed Duality (Teaching vs Facility)':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Sparkles,
          color: 'text-blue-600',
        };
      case 'Administrative & Examination Notice':
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: FileCheck2,
          color: 'text-slate-600',
        };
    }
  };

  const meta = getPatternMeta(plan.patternType);
  const Icon = meta.icon;

  return (
    <div className={`rounded-2xl border ${meta.bg} p-5 space-y-4 shadow-xs transition-all`}>
      {/* Pattern Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-black/5 flex items-center justify-center shrink-0">
            <Icon className={`w-5 h-5 ${meta.color}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Identified Pattern &amp; Follow-Up Protocol
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                Confidence: {plan.patternConfidence}%
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{plan.patternType}</h3>
          </div>
        </div>

        {/* Priority & SLA */}
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              plan.urgency === 'High'
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : plan.urgency === 'Medium'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {plan.urgency} Urgency ({plan.targetResolutionDays}d SLA)
          </span>

          <button
            onClick={copyATRText}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Copy Action Taken Report (ATR) text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied ATR</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy ATR</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div className="bg-white/80 rounded-xl p-3 border border-black/5 text-xs">
        <span className="font-bold text-slate-900 block mb-1">
          Root Cause &amp; Pattern Behavior:
        </span>
        <p className="text-slate-700 leading-relaxed">{plan.rootCauseAnalysis}</p>
      </div>

      {/* 3-Stage Closed Loop Follow-Up Protocol */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
          Action Taken Report (ATR) Follow-Up Roadmap:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Stage 1: Immediate Faculty/Lab Assistant */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-indigo-700 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[10px] shrink-0 font-extrabold">
                1
              </span>
              <span>Immediate Faculty / Lab Action</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              {plan.immediateIntervention}
            </p>
            <div className="text-[10px] text-slate-400 font-medium pt-1">
              Timeline: Within 48 Hours
            </div>
          </div>

          {/* Stage 2: HOD / Department IQAC */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-purple-700 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] shrink-0 font-extrabold">
                2
              </span>
              <span>HOD &amp; Institutional Review</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              {plan.institutionalFollowUp}
            </p>
            <div className="text-[10px] text-slate-400 font-medium pt-1">
              Timeline: Monthly Academic Audit
            </div>
          </div>

          {/* Stage 3: NAAC Accreditation File */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] shrink-0 font-extrabold">
                3
              </span>
              <span>NAAC Compliance Archive</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal font-mono bg-slate-50 p-1 rounded border border-slate-200">
              {plan.naacComplianceDoc}
            </p>
            <div className="text-[10px] text-slate-400 font-medium pt-1">
              Accreditation Evidence File
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Follow-Up Status Selector */}
      <div className="bg-white/90 rounded-xl p-3 border border-black/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-slate-800">Follow-Up Workflow Status:</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {(['Follow-Up Required', 'In Progress', 'Action Documented', 'Closed'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  currentStatus === status
                    ? status === 'Follow-Up Required'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : status === 'In Progress'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : status === 'Action Documented'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
