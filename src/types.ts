export type SentimentType = 'Positive' | 'Negative' | 'Neutral';

export type FeedbackPatternType =
  | 'Pedagogical & Boardwork Delivery'
  | 'Lab Hardware & Compiler Environment'
  | 'Classroom ICT & AV Infrastructure'
  | 'Curricular Pacing & Syllabus Rush'
  | 'Administrative & Examination Notice'
  | 'Mixed Duality (Teaching vs Facility)';

export interface FollowUpActionPlan {
  patternType: FeedbackPatternType;
  patternConfidence: number; // 0 - 100 percentage
  rootCauseAnalysis: string; // Explains WHY this pattern is emerging
  immediateIntervention: string; // Action within 48h for faculty/lab assistant
  institutionalFollowUp: string; // Action for HOD / Estate / IQAC
  naacComplianceDoc: string; // Accreditation documentation filing reference
  actionStatus: 'Follow-Up Required' | 'In Progress' | 'Action Documented' | 'Closed';
  urgency: 'High' | 'Medium' | 'Low';
  targetResolutionDays: number;
}

export interface FeedbackItem {
  id: string;
  text: string;
  department?: string; // e.g. "B.Tech CSE - 2nd Year"
  facultyOrSubject?: string; // e.g. "Data Structures - Prof. Venkat"
  semester?: string; // e.g. "3rd Sem"
  sentiment: SentimentType;
  isMixed: boolean;
  explanation: string;
  keyTopics: string[];
  positiveAspects?: string[];
  negativeAspects?: string[];
  confidenceScore?: number; // 0 - 100 percentage
  naacCriteria?: string; // e.g. "Criterion 2: Teaching-Learning Process"
  facultyActionRecommendation?: string; // Action item for faculty or HOD
  timestamp: string;
  isSample?: boolean;
  // Enhanced Pattern & Follow-Up fields
  detectedPattern?: FeedbackPatternType;
  followUpPlan?: FollowUpActionPlan;
  engineUsed?: 'Gemini AI' | 'Academic Rule-Based Engine';
  processingTimeMs?: number;
}

export interface FeedbackSummaryResult {
  commonPositiveOpinions: string[];
  commonComplaints: string[];
  frequentlyMentionedTopics: string[];
  suggestionsForImprovement: string[];
  facultyActionItems: string[];
  executiveSummary: string;
  totalAnalyzed: number;
  generatedAt: string;
  recurringPatterns?: {
    patternType: string;
    prevalence: string;
    followUpRoadmap: string;
    responsibleParty: string;
  }[];
}

export interface EvaluationItem {
  id: string;
  feedback: string;
  expectedSentiment: SentimentType;
  testCategory: 'Teaching' | 'Facilities' | 'Labs' | 'Administration' | 'Mixed Opinion';
  notes: string;
  predictedSentiment?: SentimentType;
  isMixed?: boolean;
  explanation?: string;
  keyTopics?: string[];
  isCorrect?: boolean;
  patternDetected?: string;
  followUpRecommendation?: string;
}

export interface EvaluationSummary {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  testedAt?: string;
}

export interface ServerHealthInfo {
  status: 'ok' | 'degraded' | 'error';
  serverTime: string;
  uptimeSeconds: number;
  port: number;
  apiKeyConfigured: boolean;
  fallbackAvailable: boolean;
  activeModel: string;
  feedbackCount: number;
  latencyMs?: number;
}

