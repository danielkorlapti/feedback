import React, { useState } from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Key,
  Database,
  ExternalLink,
  X,
  Code2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ServerHealthInfo } from '../types';

interface FullStackConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverHealth: ServerHealthInfo | null;
  isBackendConnected: boolean;
  onRefreshHealth: () => Promise<void>;
}

export const FullStackConnectionModal: React.FC<FullStackConnectionModalProps> = ({
  isOpen,
  onClose,
  serverHealth,
  isBackendConnected,
  onRefreshHealth,
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    latencyMs: number;
    timestamp: string;
    payload: any;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      const resp = await fetch('/api/health');
      const latency = Math.round(performance.now() - start);
      const data = await resp.json();
      setPingResult({
        latencyMs: latency,
        timestamp: new Date().toLocaleTimeString(),
        payload: data,
      });
      await onRefreshHealth();
    } catch (err: any) {
      setPingResult({
        latencyMs: Math.round(performance.now() - start),
        timestamp: new Date().toLocaleTimeString(),
        payload: { error: err.message || 'Connection failed' },
      });
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Full-Stack Connection &amp; Architecture Hub
              </h2>
              <p className="text-xs text-slate-500">
                Live link status between React 19 Client and Node.js Express REST Backend
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Express REST API Status */}
          <div
            className={`p-4 rounded-2xl border ${
              isBackendConnected
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider">Express REST API</span>
              {isBackendConnected ? (
                <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ONLINE (Port 3000)</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-xs font-bold text-rose-700">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>OFFLINE</span>
                </span>
              )}
            </div>
            <div className="mt-2 text-xs font-medium space-y-0.5">
              <div>
                Base URL: <code className="bg-white/80 px-1 py-0.5 rounded font-mono">http://localhost:3000</code>
              </div>
              <div>
                Uptime: <strong className="font-semibold">{serverHealth?.uptimeSeconds ? `${serverHealth.uptimeSeconds}s` : 'Active'}</strong>
              </div>
            </div>
          </div>

          {/* Card 2: AI Engine / Gemini Status */}
          <div className="p-4 rounded-2xl border bg-indigo-50/80 border-indigo-200 text-indigo-950">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider">AI Inference Engine</span>
              <span className="flex items-center space-x-1 text-xs font-bold text-indigo-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{serverHealth?.apiKeyConfigured ? 'GEMINI LIVE' : 'RULE HYBRID'}</span>
              </span>
            </div>
            <div className="mt-2 text-xs font-medium space-y-0.5">
              <div>
                Active Model:{' '}
                <strong className="text-indigo-800">
                  {serverHealth?.activeModel || 'Google Gemini 3.1 / Rule Fallback'}
                </strong>
              </div>
              <div>
                API Key:{' '}
                <span className={serverHealth?.apiKeyConfigured ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                  {serverHealth?.apiKeyConfigured ? 'Configured in Environment' : 'Using Academic Rule Engine (Offline Ready)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Ping REST API Tester */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Live REST API Ping &amp; Health Probe:
              </span>
              <span className="text-[11px] text-slate-500">
                Sends an HTTP GET request to <code className="font-mono text-indigo-600">/api/health</code> to measure roundtrip latency.
              </span>
            </div>

            <button
              onClick={handleTestPing}
              disabled={isPinging}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Test Ping REST API'}</span>
            </button>
          </div>

          {pingResult && (
            <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">
                  Probe at {pingResult.timestamp}:
                </span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                    pingResult.latencyMs < 100
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Roundtrip Latency: {pingResult.latencyMs}ms
                </span>
              </div>
              <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-[10px] font-mono overflow-x-auto max-h-28">
                {JSON.stringify(pingResult.payload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Active REST Endpoints List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
            Wired REST API Endpoints:
          </span>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="divide-y divide-slate-100 font-mono text-[11px]">
              <div className="p-2.5 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    GET
                  </span>
                  <span className="text-slate-800 font-semibold">/api/health</span>
                </div>
                <span className="text-slate-500 font-sans text-[11px]">Connection &amp; System Health</span>
              </div>

              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    GET
                  </span>
                  <span className="text-slate-800 font-semibold">/api/feedbacks</span>
                </div>
                <span className="text-slate-500 font-sans text-[11px]">Fetch all feedback audit records</span>
              </div>

              <div className="p-2.5 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                    POST
                  </span>
                  <span className="text-slate-800 font-semibold">/api/analyze-sentiment</span>
                </div>
                <span className="text-slate-500 font-sans text-[11px]">Sentiment, Pattern &amp; ATR Follow-Up</span>
              </div>

              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                    POST
                  </span>
                  <span className="text-slate-800 font-semibold">/api/generate-summary</span>
                </div>
                <span className="text-slate-500 font-sans text-[11px]">Campus-wide IQAC Quality Synthesis</span>
              </div>

              <div className="p-2.5 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                    POST
                  </span>
                  <span className="text-slate-800 font-semibold">/api/evaluate-benchmark</span>
                </div>
                <span className="text-slate-500 font-sans text-[11px]">Model Ground-Truth Accuracy Benchmark</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini API Key Configuration Tip */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center space-x-2 font-bold text-amber-950">
            <Key className="w-4 h-4 text-amber-700" />
            <span>How to Configure Gemini API Key:</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            To run live with Google Gemini, create or edit the <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">.env</code> file in the project folder with:
          </p>
          <pre className="bg-slate-900 text-amber-300 p-2 rounded-lg font-mono text-[10px]">
            GEMINI_API_KEY=&quot;your_google_ai_studio_api_key_here&quot;
          </pre>
          <p className="text-[11px] text-amber-800">
            * Even without an API key, our built-in <strong>Academic Rule-Based Engine</strong> seamlessly runs offline, ensuring zero crashes during live presentations or examinations!
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
