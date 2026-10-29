import {
  FeedbackItem,
  FeedbackSummaryResult,
  EvaluationItem,
  EvaluationSummary,
  ServerHealthInfo,
  SentimentType,
  FeedbackPatternType,
} from '../types';
import {
  analyzeFeedbackWithRules,
  generateSummaryWithRules,
  evaluateBenchmarkWithRules,
  AnalysisResult,
} from './academicNlpEngine';
import { INITIAL_SAMPLE_FEEDBACK } from '../data/mockData';

const STORAGE_KEY = 'indian_college_student_feedback_sentiment_v2';

export interface ApiClientError {
  error: string;
  code: string;
  suggestion: string;
  isRecoveredWithFallback: boolean;
  technicalDetails?: string;
}

/**
 * Helper to safely extract JSON or handle HTML/Text error responses
 */
async function safeParseResponse(response: Response): Promise<{ ok: boolean; data: any; rawText?: string }> {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (contentType.includes('application/json')) {
    try {
      const data = JSON.parse(text);
      return { ok: response.ok, data };
    } catch {
      return { ok: false, data: null, rawText: text };
    }
  }

  // Not JSON (e.g. HTML 404 / 502 / Vercel error page)
  return {
    ok: false,
    data: {
      error: `Server responded with ${response.status} ${response.statusText}`,
      code: `ERR_HTTP_${response.status}`,
      suggestion:
        response.status === 404
          ? 'The requested endpoint was not found. Seamless client-side engine has been activated.'
          : 'The server encountered an error. Seamless client-side engine has been activated.',
    },
    rawText: text.slice(0, 300),
  };
}

export const apiClient = {
  /**
   * Health Probe
   */
  async checkHealth(): Promise<{ isConnected: boolean; health: ServerHealthInfo; latencyMs: number }> {
    const start = performance.now();
    try {
      const response = await fetch('/api/health');
      const latencyMs = Math.round(performance.now() - start);
      const parsed = await safeParseResponse(response);

      if (parsed.ok && parsed.data && parsed.data.status === 'ok') {
        return {
          isConnected: true,
          health: {
            ...parsed.data,
            latencyMs,
          },
          latencyMs,
        };
      }

      // Offline / Serverless cold start fallback
      return {
        isConnected: false,
        health: {
          status: 'degraded',
          serverTime: new Date().toISOString(),
          uptimeSeconds: 0,
          port: 3000,
          apiKeyConfigured: false,
          fallbackAvailable: true,
          activeModel: 'Academic Rule-Based Engine (Browser Client Mode)',
          feedbackCount: 0,
          latencyMs,
        },
        latencyMs,
      };
    } catch {
      const latencyMs = Math.round(performance.now() - start);
      return {
        isConnected: false,
        health: {
          status: 'degraded',
          serverTime: new Date().toISOString(),
          uptimeSeconds: 0,
          port: 3000,
          apiKeyConfigured: false,
          fallbackAvailable: true,
          activeModel: 'Academic Rule-Based Engine (Offline Client Mode)',
          feedbackCount: 0,
          latencyMs,
        },
        latencyMs,
      };
    }
  },

  /**
   * Fetch All Feedbacks (with graceful fallback to localStorage)
   */
  async fetchFeedbacks(): Promise<{ items: FeedbackItem[]; source: 'backend' | 'localStorage' | 'seed' }> {
    try {
      const response = await fetch('/api/feedbacks');
      const parsed = await safeParseResponse(response);

      if (parsed.ok && parsed.data && Array.isArray(parsed.data.feedbacks) && parsed.data.feedbacks.length > 0) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data.feedbacks));
        } catch {}
        return { items: parsed.data.feedbacks, source: 'backend' };
      }
    } catch {
      // Backend unavailable, fallback to local storage
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedLocal = JSON.parse(stored);
        if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
          return { items: parsedLocal, source: 'localStorage' };
        }
      }
    } catch {}

    return { items: INITIAL_SAMPLE_FEEDBACK, source: 'seed' };
  },

  /**
   * Save a single feedback item
   */
  async saveFeedback(item: FeedbackItem): Promise<boolean> {
    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Delete feedback item by ID
   */
  async deleteFeedback(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/feedbacks/${id}`, { method: 'DELETE' });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Reset feedback items to seed
   */
  async resetFeedbacks(): Promise<FeedbackItem[]> {
    try {
      const response = await fetch('/api/feedbacks/reset', { method: 'POST' });
      const parsed = await safeParseResponse(response);
      if (parsed.ok && parsed.data && Array.isArray(parsed.data.feedbacks)) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data.feedbacks));
        } catch {}
        return parsed.data.feedbacks;
      }
    } catch {}

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_FEEDBACK));
    } catch {}
    return INITIAL_SAMPLE_FEEDBACK;
  },

  /**
   * Clear all feedback records
   */
  async clearFeedbacks(): Promise<boolean> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      await fetch('/api/feedbacks/clear', { method: 'POST' });
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Analyze Sentiment & Generate Pattern & Follow-Up Plan
   * Guaranteed Zero-Crash: Seamlessly uses backend REST or instant browser Academic Rule Engine
   */
  async analyzeFeedback(
    text: string,
    department?: string,
    facultyOrSubject?: string,
    semester?: string
  ): Promise<AnalysisResult> {
    const trimmed = text.trim();
    const startTime = performance.now();

    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          department: department?.trim() || undefined,
          facultyOrSubject: facultyOrSubject?.trim() || undefined,
          semester: semester?.trim() || undefined,
        }),
      });

      const parsed = await safeParseResponse(response);
      if (parsed.ok && parsed.data) {
        return {
          sentiment: parsed.data.sentiment as SentimentType,
          isMixed: Boolean(parsed.data.isMixed),
          explanation: parsed.data.explanation,
          keyTopics: parsed.data.keyTopics || ['General Academics'],
          positiveAspects: parsed.data.positiveAspects || [],
          negativeAspects: parsed.data.negativeAspects || [],
          confidenceScore: parsed.data.confidenceScore || 95,
          naacCriteria: parsed.data.naacCriteria || 'Criterion 2: Teaching-Learning & Evaluation',
          facultyActionRecommendation:
            parsed.data.facultyActionRecommendation ||
            'Review student feedback for continuous classroom improvement.',
          detectedPattern: parsed.data.detectedPattern as FeedbackPatternType,
          followUpPlan: parsed.data.followUpPlan,
          engineUsed: parsed.data.engineUsed || 'Gemini AI',
          processingTimeMs: Math.round(performance.now() - startTime),
          note: parsed.data.note,
        };
      }
    } catch (err) {
      console.warn('Backend /api/analyze-sentiment unreachable, activating Client-Side Academic Rule Engine:', err);
    }

    // Client-Side Academic Rule-Based Engine Fallback
    const localResult = analyzeFeedbackWithRules(trimmed, department, facultyOrSubject, semester);
    return {
      ...localResult,
      processingTimeMs: Math.round(performance.now() - startTime),
      note: 'Analyzed using Academic Rule-Based Engine (Client-Side Fallback Active).',
    };
  },

  /**
   * Generate Summary for IQAC Quality Assurance
   */
  async generateSummary(items: FeedbackItem[]): Promise<FeedbackSummaryResult> {
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackItems: items }),
      });

      const parsed = await safeParseResponse(response);
      if (parsed.ok && parsed.data && parsed.data.executiveSummary) {
        return parsed.data;
      }
    } catch (err) {
      console.warn('Backend /api/generate-summary unreachable, synthesizing via Client-Side Engine:', err);
    }

    return generateSummaryWithRules(items);
  },

  /**
   * Evaluate Accuracy Benchmark
   */
  async evaluateBenchmark(testEntries: EvaluationItem[]): Promise<{
    total: number;
    correct: number;
    incorrect: number;
    accuracy: number;
    testedAt: string;
    items: EvaluationItem[];
  }> {
    try {
      const response = await fetch('/api/evaluate-benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEntries }),
      });

      const parsed = await safeParseResponse(response);
      if (parsed.ok && parsed.data && typeof parsed.data.accuracy === 'number') {
        return parsed.data;
      }
    } catch (err) {
      console.warn('Backend /api/evaluate-benchmark unreachable, running Client-Side Benchmark:', err);
    }

    return evaluateBenchmarkWithRules(testEntries);
  },
};
