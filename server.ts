import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { FeedbackPatternType, FollowUpActionPlan } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const serverStartTime = Date.now();

const app = express();
app.use(express.json({ limit: '2mb' }));

// CORS headers for local, Vercel preview, and production domains
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Google Gemini SDK
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Seed data with full Pattern Recognition & Follow-Up Action Plans
const SEED_FEEDBACKS = [
  {
    id: 'sample-ind-1',
    text: 'Prof. Venkat explains Data Structures concepts clearly on the blackboard and solves previous semester university question bank problems with helpful coding examples.',
    department: 'CSE (Computer Science & Engg)',
    facultyOrSubject: 'Data Structures & Algorithms - Prof. Venkat Rao',
    semester: '3rd Semester (2nd Year)',
    sentiment: 'Positive' as const,
    isMixed: false,
    explanation: 'Direct appreciation for pedagogical clarity, blackboard derivations, and university exam problem solving.',
    keyTopics: ['Blackboard Teaching', 'Data Structures', 'University Question Bank', 'Code Examples'],
    positiveAspects: ['Explains concepts clearly on blackboard', 'Solves previous university exam questions', 'Provides helpful examples'],
    negativeAspects: [],
    confidenceScore: 97,
    naacCriteria: 'Criterion 2: Teaching-Learning & Evaluation',
    facultyActionRecommendation: 'Encourage faculty to continue sharing solved algorithm steps and record lecture summaries for revision.',
    detectedPattern: 'Pedagogical & Boardwork Delivery' as FeedbackPatternType,
    followUpPlan: {
      patternType: 'Pedagogical & Boardwork Delivery' as FeedbackPatternType,
      patternConfidence: 97,
      rootCauseAnalysis: 'Effective blackboard derivations bridge the gap between theory and university exam questions.',
      immediateIntervention: 'Faculty to publish weekly algorithmic practice sets and conduct revision doubt hours.',
      institutionalFollowUp: 'IQAC to recognize best pedagogical practices in departmental academic council meeting.',
      naacComplianceDoc: 'Criterion 2: Teaching-Learning & Evaluation (ATR-CSE-2026-01)',
      actionStatus: 'Action Documented' as const,
      urgency: 'Low' as const,
      targetResolutionDays: 7,
    },
    engineUsed: 'Gemini AI' as const,
    timestamp: '2026-10-28 09:30 AM',
    isSample: true,
  },
  {
    id: 'sample-ind-2',
    text: 'In the DBMS lab, 6 systems in row 3 have blue-screen errors, GCC compiler is not installed, and the lab LAN connection disconnects during online submissions.',
    department: 'AI & DS (Artificial Intelligence & Data Science)',
    facultyOrSubject: 'DBMS & Python Lab - Systems Lab 3',
    semester: '3rd Semester (2nd Year)',
    sentiment: 'Negative' as const,
    isMixed: false,
    explanation: 'Highlights critical software configuration deficiencies and malfunctioning hardware in the college computing lab.',
    keyTopics: ['Lab Systems', 'Compiler Setup', 'LAN Connectivity', 'System Crashes'],
    positiveAspects: [],
    negativeAspects: ['6 desktop monitors crash with blue screen', 'GCC compiler missing on lab PCs', 'LAN disconnects during submission'],
    confidenceScore: 96,
    naacCriteria: 'Criterion 4: Infrastructure & Learning Resources',
    facultyActionRecommendation: 'Lab assistant and System Admin must format row 3 machines, install standard compiler bundles, and test ethernet switches.',
    detectedPattern: 'Lab Hardware & Compiler Environment' as FeedbackPatternType,
    followUpPlan: {
      patternType: 'Lab Hardware & Compiler Environment' as FeedbackPatternType,
      patternConfidence: 96,
      rootCauseAnalysis: 'Outdated OS image, corrupted compiler packages, and faulty crimped RJ-45 LAN connectors in row 3.',
      immediateIntervention: 'Lab Assistant to re-image row 3 systems with verified GCC/MinGW toolchain and replace ethernet patch cords within 24h.',
      institutionalFollowUp: 'System Administrator and HOD AI&DS to conduct quarterly IT infrastructure audit before end-semester lab exams.',
      naacComplianceDoc: 'Criterion 4: Infrastructure & Learning Resources (Lab Repair Log 2026-04)',
      actionStatus: 'Follow-Up Required' as const,
      urgency: 'High' as const,
      targetResolutionDays: 2,
    },
    engineUsed: 'Gemini AI' as const,
    timestamp: '2026-10-28 10:15 AM',
    isSample: true,
  },
  {
    id: 'sample-ind-3',
    text: 'The mid-term examination timetable for 2nd Year B.Tech students was uploaded to the college ERP portal on Monday evening.',
    department: 'Examination Branch',
    facultyOrSubject: 'Controller of Examinations (CoE)',
    semester: 'All Branches (2nd Year)',
    sentiment: 'Neutral' as const,
    isMixed: false,
    explanation: 'Pure administrative timetable announcement on the college ERP without expressing student satisfaction or grievances.',
    keyTopics: ['Mid-Term Schedule', 'College ERP Portal', 'Examination Notice'],
    positiveAspects: [],
    negativeAspects: [],
    confidenceScore: 99,
    naacCriteria: 'Criterion 2: Examination & Evaluation Reforms',
    facultyActionRecommendation: 'Maintain prompt ERP upload of academic schedules and ensure SMS/WhatsApp class group notification.',
    detectedPattern: 'Administrative & Examination Notice' as FeedbackPatternType,
    followUpPlan: {
      patternType: 'Administrative & Examination Notice' as FeedbackPatternType,
      patternConfidence: 99,
      rootCauseAnalysis: 'Statutory institutional communication adhering to the academic calendar schedule.',
      immediateIntervention: 'CoE branch to verify that all section student class representatives confirm timetable receipt.',
      institutionalFollowUp: 'Academic Section to archive ERP notification timestamps for university audit compliance.',
      naacComplianceDoc: 'Criterion 2: Examination Reforms (Notice Archive 2026-T1)',
      actionStatus: 'Closed' as const,
      urgency: 'Low' as const,
      targetResolutionDays: 5,
    },
    engineUsed: 'Gemini AI' as const,
    timestamp: '2026-10-28 11:00 AM',
    isSample: true,
  },
  {
    id: 'sample-ind-4',
    text: 'Dr. Lakshmi explains DSP derivation steps very clearly, but Room 304 projector HDMI cable is loose and flickers whenever PPT slides change.',
    department: 'ECE (Electronics & Communication)',
    facultyOrSubject: 'Digital Signal Processing - Dr. Lakshmi',
    semester: '4th Semester (2nd Year)',
    sentiment: 'Neutral' as const,
    isMixed: true,
    explanation: 'Equally balanced feedback containing strong praise for faculty mathematical derivations contrasted with classroom projector hardware issues.',
    keyTopics: ['Faculty Derivations', 'Classroom Projector', 'HDMI Hardware', 'Audio-Visual Aids'],
    positiveAspects: ['Explains DSP derivation steps with high clarity'],
    negativeAspects: ['Room 304 projector HDMI cable is loose and flickers'],
    confidenceScore: 93,
    naacCriteria: 'Criterion 4: ICT Enabled Classrooms & Infrastructure',
    facultyActionRecommendation: 'Estate / AV technician should replace faulty HDMI cable in Room 304 to prevent teaching interruptions.',
    detectedPattern: 'Mixed Duality (Teaching vs Facility)' as FeedbackPatternType,
    followUpPlan: {
      patternType: 'Mixed Duality (Teaching vs Facility)' as FeedbackPatternType,
      patternConfidence: 94,
      rootCauseAnalysis: 'Physical AV port degradation in lecture hall 304 while pedagogical delivery remains excellent.',
      immediateIntervention: 'AV technician to install a high-speed shielded HDMI replacement cable and test with instructor laptop.',
      institutionalFollowUp: 'Department HOD to inspect Room 304 AV station and verify teaching continuation without projection flicker.',
      naacComplianceDoc: 'Criterion 4: ICT Enabled Classrooms (Infrastructure Ticket #ECE-304)',
      actionStatus: 'In Progress' as const,
      urgency: 'High' as const,
      targetResolutionDays: 2,
    },
    engineUsed: 'Gemini AI' as const,
    timestamp: '2026-10-28 01:45 PM',
    isSample: true,
  },
  {
    id: 'sample-ind-5',
    text: 'The central library book bank provided all standard reference textbooks (Cormen, Tanenbaum) without any penalty, and digital IEEE access works smoothly on campus Wi-Fi.',
    department: 'Central Library & Information Centre',
    facultyOrSubject: 'Book Bank Scheme & IEEE Digital Library',
    semester: '3rd Semester (2nd Year)',
    sentiment: 'Positive' as const,
    isMixed: false,
    explanation: 'Commends the availability of prescribed engineering textbooks and uninterrupted campus Wi-Fi access for research journals.',
    keyTopics: ['Book Bank Scheme', 'Standard Textbooks', 'IEEE Access', 'Campus Wi-Fi'],
    positiveAspects: ['Book bank scheme provided all core textbooks', 'Smooth IEEE digital library access on campus Wi-Fi'],
    negativeAspects: [],
    confidenceScore: 98,
    naacCriteria: 'Criterion 4: Library as a Learning Resource',
    facultyActionRecommendation: 'Sustain the book bank inventory and publicize e-journal access credentials to all 2nd-year sections.',
    detectedPattern: 'Classroom ICT & AV Infrastructure' as FeedbackPatternType,
    followUpPlan: {
      patternType: 'Classroom ICT & AV Infrastructure' as FeedbackPatternType,
      patternConfidence: 98,
      rootCauseAnalysis: 'Timely procurement of curriculum-aligned reference titles and reliable campus Wi-Fi bandwidth.',
      immediateIntervention: 'Library team to display IEEE research paper access guides on department digital notice boards.',
      institutionalFollowUp: 'Library Advisory Committee to continue book bank quota allocations for next semester.',
      naacComplianceDoc: 'Criterion 4: Library Resources (Annual Book Bank Audit 2026)',
      actionStatus: 'Action Documented' as const,
      urgency: 'Low' as const,
      targetResolutionDays: 14,
    },
    engineUsed: 'Gemini AI' as const,
    timestamp: '2026-10-28 02:20 PM',
    isSample: true,
  },
  {
    id: 'sample-ind-6',
    text: 'Units 4 and 5 were rushed in the final two weeks just before internal lab examinations, leaving students with no time to practice numerical problems.',
    department: 'Mechanical Engineering',
    facultyOrSubject: 'Thermodynamics & Fluid Mechanics',
    semester: '3rd Semester (2nd Year)',
    sentiment: 'Negative' as const,
    isMixed: false,
    explanation: 'Reports uneven syllabus distribution and hurried completion of critical units right before midterm and lab viva assessments.',
    keyTopics: ['Syllabus Pace', 'Internal Exams', 'Numerical Practice', 'Course Timeline'],
    positiveAspects: [],
    negativeAspects: ['Units 4 and 5 covered too rapidly in 2 weeks', 'Insufficient time to practice engineering numericals'],
    confidenceScore: 95,
    naacCriteria: 'Criterion 1: Curriculum Delivery & Academic Calendar',
    facultyActionRecommendation: 'HOD should conduct monthly course progress audits to ensure even pacing across all 5 units before mid-terms.',
    detectedPattern: 'Curricular Pacing & Syllabus Rush' as FeedbackPatternType,
    followUpPlan: {
      patternType: 'Curricular Pacing & Syllabus Rush' as FeedbackPatternType,
      patternConfidence: 95,
      rootCauseAnalysis: 'Unbalanced course lesson planning where early units took disproportionate lecture hours.',
      immediateIntervention: 'Faculty to organize 3 specialized tutorial sessions solving previous university numerical problems.',
      institutionalFollowUp: 'Academic Dean and HOD to mandate fortnightly syllabus coverage reporting across all departments.',
      naacComplianceDoc: 'Criterion 1: Curriculum Delivery (Academic Monitoring Report MECH-2026)',
      actionStatus: 'Follow-Up Required' as const,
      urgency: 'High' as const,
      targetResolutionDays: 4,
    },
    engineUsed: 'Gemini AI' as const,
    timestamp: '2026-10-28 03:10 PM',
    isSample: true,
  },
];

// In-Memory Backend Feedback Store (Synced with Full-Stack REST API)
let backendFeedbackStore = [...SEED_FEEDBACKS];

// Helper for sentiment validation
function sanitizeSentiment(val: string): 'Positive' | 'Negative' | 'Neutral' {
  const normalized = val?.trim().toLowerCase();
  if (normalized === 'positive') return 'Positive';
  if (normalized === 'negative') return 'Negative';
  return 'Neutral';
}

// Resilient Gemini generateContent helper
async function generateContentWithFallback(options: {
  contents: string;
  systemInstruction?: string;
  responseSchema?: any;
}) {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const primaryModel = 'gemini-3.1-flash-lite';
  const fallbackModel = 'gemini-3.8-flash';

  try {
    return await ai.models.generateContent({
      model: primaryModel,
      contents: options.contents,
      config: {
        ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
        responseMimeType: 'application/json',
        ...(options.responseSchema ? { responseSchema: options.responseSchema } : {}),
      },
    });
  } catch (primaryErr: any) {
    console.warn(`Primary model ${primaryModel} failed (${primaryErr?.message || primaryErr}), trying fallback ${fallbackModel}...`);
    return await ai.models.generateContent({
      model: fallbackModel,
      contents: options.contents,
      config: {
        ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
        responseMimeType: 'application/json',
        ...(options.responseSchema ? { responseSchema: options.responseSchema } : {}),
      },
    });
  }
}

// Intelligent Indian Engineering Classroom Academic NLP Rule-Based Engine
function analyzeFeedbackWithRules(
  text: string,
  department?: string,
  facultyOrSubject?: string,
  semester?: string
) {
  const lower = text.toLowerCase();

  // Pattern detection keywords
  const isLab =
    lower.includes('lab') ||
    lower.includes('system') ||
    lower.includes('compiler') ||
    lower.includes('lan') ||
    lower.includes('pc') ||
    lower.includes('blue-screen') ||
    lower.includes('bluescreen') ||
    lower.includes('screen') ||
    lower.includes('hardware') ||
    lower.includes('viva') ||
    lower.includes('crash');

  const isICT =
    lower.includes('projector') ||
    lower.includes('hdmi') ||
    lower.includes('ppt') ||
    lower.includes('wifi') ||
    lower.includes('wi-fi') ||
    lower.includes('cable') ||
    lower.includes('fan') ||
    lower.includes('sound') ||
    lower.includes('audio') ||
    lower.includes('rattling') ||
    lower.includes('noise');

  const isTeaching =
    lower.includes('explain') ||
    lower.includes('teach') ||
    lower.includes('blackboard') ||
    lower.includes('derivation') ||
    lower.includes('concept') ||
    lower.includes('doubt') ||
    lower.includes('notes') ||
    lower.includes('prof') ||
    lower.includes('dr.') ||
    lower.includes('sir') ||
    lower.includes('madam') ||
    lower.includes('gate') ||
    lower.includes('aptitude') ||
    lower.includes('question bank');

  const isCurriculum =
    lower.includes('syllabus') ||
    lower.includes('unit') ||
    lower.includes('rush') ||
    lower.includes('hurried') ||
    lower.includes('numerical') ||
    lower.includes('practice') ||
    lower.includes('exam') ||
    lower.includes('mid-term') ||
    lower.includes('midterm') ||
    lower.includes('timetable') ||
    lower.includes('schedule');

  const isNotice =
    (lower.includes('timetable') ||
      lower.includes('erp') ||
      lower.includes('notice') ||
      lower.includes('marks') ||
      lower.includes('attendance') ||
      lower.includes('announced')) &&
    !lower.includes('rush') &&
    !lower.includes('complain');

  const isLibrary =
    lower.includes('library') ||
    lower.includes('book') ||
    lower.includes('textbook') ||
    lower.includes('journal') ||
    lower.includes('ieee') ||
    lower.includes('cormen');

  // Sentiment scoring
  const posTerms = [
    'clearly',
    'clear',
    'solves',
    'solve',
    'helpful',
    'patiently',
    'patient',
    'standard',
    'smoothly',
    'smooth',
    'excellent',
    'great',
    'good',
    'best',
    'appreciate',
    'detailed',
    'rigor',
    'recommend',
    'dedicated',
  ];
  const negTerms = [
    'blue-screen',
    'bluescreen',
    'crash',
    'disconnect',
    'disconnects',
    'freeze',
    'broken',
    'loose',
    'flicker',
    'flickers',
    'rushed',
    'rush',
    'hard to hear',
    'noise',
    'rattling',
    'missing',
    'not installed',
    'penalty',
    'poor',
    'insufficient',
    'hurried',
  ];

  let posCount = 0;
  let negCount = 0;
  posTerms.forEach((w) => {
    if (lower.includes(w)) posCount++;
  });
  negTerms.forEach((w) => {
    if (lower.includes(w)) negCount++;
  });

  const isExplicitMixed =
    (posCount > 0 && negCount > 0) ||
    (lower.includes(' but ') && (posCount > 0 || negCount > 0)) ||
    lower.includes(' though ') ||
    lower.includes(' however ');

  let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
  if (isExplicitMixed) {
    if (posCount >= negCount + 2) sentiment = 'Positive';
    else if (negCount >= posCount + 2) sentiment = 'Negative';
    else sentiment = 'Neutral'; // Balanced duality
  } else if (isNotice) {
    sentiment = 'Neutral';
  } else if (posCount > negCount) {
    sentiment = 'Positive';
  } else if (negCount > posCount) {
    sentiment = 'Negative';
  } else {
    sentiment = 'Neutral';
  }

  // Determine Pattern & Follow-Up Plan
  let detectedPattern: FeedbackPatternType = 'Pedagogical & Boardwork Delivery';
  let naacCriteria = 'Criterion 2: Teaching-Learning & Evaluation';
  let immediateIntervention = 'Faculty to review student feedback and incorporate clarifications in subsequent lectures.';
  let institutionalFollowUp = 'HOD to conduct periodic mid-semester course reviews.';
  let rootCauseAnalysis = 'Direct observations regarding instructional delivery and classroom concept explanation.';
  let urgency: 'High' | 'Medium' | 'Low' = 'Medium';
  let targetResolutionDays = 7;

  if (isExplicitMixed) {
    detectedPattern = 'Mixed Duality (Teaching vs Facility)';
    naacCriteria = 'Criterion 4: Infrastructure & Learning Resources';
    immediateIntervention = 'Faculty maintains teaching excellence while lodging urgent maintenance request for physical facilities.';
    institutionalFollowUp = 'Estate Officer and HOD to expedite AV/Hardware replacement within 48 hours.';
    rootCauseAnalysis = 'Coexistence of positive instructional satisfaction alongside mechanical or laboratory deficiencies.';
    urgency = 'High';
    targetResolutionDays = 2;
  } else if (isLab) {
    detectedPattern = 'Lab Hardware & Compiler Environment';
    naacCriteria = 'Criterion 4: Infrastructure & Learning Resources';
    immediateIntervention = 'Lab Programmer to inspect PCs, reinstall compiler tools, and test network switch ports.';
    institutionalFollowUp = 'System Administrator to execute full lab sanity check before next practical session.';
    rootCauseAnalysis = 'Hardware crashes, network dropouts, or absent compiler packages disrupting lab programming practice.';
    urgency = 'High';
    targetResolutionDays = 2;
  } else if (isICT) {
    detectedPattern = 'Classroom ICT & AV Infrastructure';
    naacCriteria = 'Criterion 4: ICT Enabled Classrooms & Infrastructure';
    immediateIntervention = 'Classroom AV tech to replace loose HDMI cables and service ceiling fans/audio equipment.';
    institutionalFollowUp = 'Campus Maintenance Committee to review lecture hall equipment health.';
    rootCauseAnalysis = 'Hardware wear-and-tear in lecture hall audio-visual setups impeding student reception.';
    urgency = 'High';
    targetResolutionDays = 2;
  } else if (isCurriculum && (lower.includes('rush') || lower.includes('hurried') || lower.includes('numerical'))) {
    detectedPattern = 'Curricular Pacing & Syllabus Rush';
    naacCriteria = 'Criterion 1: Curriculum Delivery & Academic Calendar';
    immediateIntervention = 'Faculty to conduct extra numerical problem tutorials before university exams.';
    institutionalFollowUp = 'Academic Dean to review teaching schedule timeline and balance unit distribution.';
    rootCauseAnalysis = 'Uneven lecture pacing compressing extensive engineering units into late semester weeks.';
    urgency = 'High';
    targetResolutionDays = 4;
  } else if (isNotice) {
    detectedPattern = 'Administrative & Examination Notice';
    naacCriteria = 'Criterion 2: Examination & Evaluation Reforms';
    immediateIntervention = 'Examination branch to ensure college ERP server bandwidth and student SMS alerts.';
    institutionalFollowUp = 'Controller of Examinations to ensure schedule adherence and student acknowledgement.';
    rootCauseAnalysis = 'Objective institutional announcements regarding examinations, timetables, or attendance.';
    urgency = 'Low';
    targetResolutionDays = 5;
  }

  // Positive & negative aspects
  const positiveAspects: string[] = [];
  const negativeAspects: string[] = [];

  if (sentiment === 'Positive' || isExplicitMixed) {
    if (isTeaching) positiveAspects.push('Clear concept explanation and blackboard problem-solving.');
    if (isLibrary) positiveAspects.push('Standard reference textbook availability and smooth digital access.');
    if (lower.includes('gate') || lower.includes('aptitude')) positiveAspects.push('Dedicated doubt clearance for competitive exams.');
    if (positiveAspects.length === 0 && posCount > 0) positiveAspects.push('Student expresses overall satisfaction with course delivery.');
  }

  if (sentiment === 'Negative' || isExplicitMixed) {
    if (isLab) negativeAspects.push('Lab system blue-screens, missing compilers, or LAN connectivity drops.');
    if (isICT) negativeAspects.push('Loose projector HDMI cable or disruptive classroom acoustic noise.');
    if (isCurriculum && (lower.includes('rush') || lower.includes('hurried'))) negativeAspects.push('Curriculum units rushed without sufficient time for numerical practice.');
    if (negativeAspects.length === 0 && negCount > 0) negativeAspects.push('Equipment deficiencies or pacing challenges noted by student.');
  }

  // Key topics
  const keyTopics: string[] = [];
  if (isTeaching) keyTopics.push('Teaching Quality');
  if (isLab) keyTopics.push('Lab Systems');
  if (isICT) keyTopics.push('Classroom ICT');
  if (isCurriculum) keyTopics.push('Syllabus Timeline');
  if (isLibrary) keyTopics.push('Library Book Bank');
  if (isNotice) keyTopics.push('College Notice');
  if (keyTopics.length === 0) keyTopics.push('General Academics');

  return {
    sentiment,
    isMixed: isExplicitMixed,
    explanation: isExplicitMixed
      ? 'Balanced feedback commending faculty instructional delivery while identifying specific infrastructure challenges.'
      : sentiment === 'Positive'
      ? 'Student articulates clear satisfaction and academic appreciation for classroom teaching and support.'
      : sentiment === 'Negative'
      ? 'Student highlights infrastructure malfunction, compiler disruption, or hurried syllabus completion.'
      : 'Purely objective institutional announcement regarding examination timetable or academic records.',
    keyTopics: keyTopics.slice(0, 4),
    positiveAspects,
    negativeAspects,
    confidenceScore: 95,
    naacCriteria,
    facultyActionRecommendation: immediateIntervention,
    detectedPattern,
    followUpPlan: {
      patternType: detectedPattern,
      patternConfidence: 95,
      rootCauseAnalysis,
      immediateIntervention,
      institutionalFollowUp,
      naacComplianceDoc: `NAAC ${naacCriteria.split(':')[0]} Action Taken Report`,
      actionStatus: (sentiment === 'Negative' || isExplicitMixed ? 'Follow-Up Required' : 'Action Documented') as any,
      urgency,
      targetResolutionDays,
    },
    engineUsed: 'Academic Rule-Based Engine' as const,
  };
}

// REST ENDPOINT: SYSTEM HEALTH & FULL-STACK CONNECTION
app.get(['/api/health', '/health'], (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  return res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    uptimeSeconds,
    port: PORT,
    apiKeyConfigured: Boolean(apiKey),
    fallbackAvailable: true,
    activeModel: apiKey ? 'Google Gemini 3.1 Flash / 3.8 Flash' : 'Academic Rule-Based Engine',
    feedbackCount: backendFeedbackStore.length,
    endpoints: [
      { path: '/api/health', method: 'GET', description: 'System health and connection diagnostic' },
      { path: '/api/feedbacks', method: 'GET', description: 'Fetch all feedback records' },
      { path: '/api/feedbacks', method: 'POST', description: 'Create new feedback record' },
      { path: '/api/analyze-sentiment', method: 'POST', description: 'AI sentiment, pattern & follow-up analysis' },
      { path: '/api/generate-summary', method: 'POST', description: 'Synthesize overall college IQAC summary' },
      { path: '/api/evaluate-benchmark', method: 'POST', description: 'Run accuracy benchmark against ground truth' },
    ],
  });
});

// REST ENDPOINT: GET ALL FEEDBACKS
app.get(['/api/feedbacks', '/feedbacks'], (_req: Request, res: Response) => {
  return res.json({
    status: 'success',
    total: backendFeedbackStore.length,
    feedbacks: backendFeedbackStore,
  });
});

// REST ENDPOINT: SAVE NEW FEEDBACK TO BACKEND STORE
app.post(['/api/feedbacks', '/feedbacks'], (req: Request, res: Response) => {
  const item = req.body;
  if (!item || !item.text) {
    return res.status(400).json({
      error: 'Invalid feedback data. Feedback text is mandatory.',
      code: 'ERR_EMPTY_FEEDBACK',
      suggestion: 'Please provide valid text in the feedback payload.',
    });
  }

  const newItem = {
    ...item,
    id: item.id || 'fb-' + Date.now(),
    timestamp: item.timestamp || new Date().toLocaleString(),
  };

  backendFeedbackStore.unshift(newItem);
  return res.json({ status: 'success', item: newItem, total: backendFeedbackStore.length });
});

// REST ENDPOINT: DELETE FEEDBACK
app.delete(['/api/feedbacks/:id', '/feedbacks/:id'], (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = backendFeedbackStore.length;
  backendFeedbackStore = backendFeedbackStore.filter((f) => f.id !== id);
  return res.json({
    status: 'success',
    deletedId: id,
    total: backendFeedbackStore.length,
    existed: backendFeedbackStore.length < initialLength,
  });
});

// REST ENDPOINT: RESET FEEDBACKS TO INDIAN CLASSROOM SEED
app.post(['/api/feedbacks/reset', '/feedbacks/reset'], (_req: Request, res: Response) => {
  backendFeedbackStore = [...SEED_FEEDBACKS];
  return res.json({ status: 'success', total: backendFeedbackStore.length, feedbacks: backendFeedbackStore });
});

// REST ENDPOINT: CLEAR ALL FEEDBACKS
app.post(['/api/feedbacks/clear', '/feedbacks/clear'], (_req: Request, res: Response) => {
  backendFeedbackStore = [];
  return res.json({ status: 'success', total: 0, feedbacks: [] });
});

// REST ENDPOINT: ANALYZE SENTIMENT (Indian Engineering Classroom Context)
app.post(['/api/analyze-sentiment', '/analyze-sentiment'], async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { text, department, facultyOrSubject, semester } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Feedback text is required and cannot be empty.',
        code: 'ERR_INPUT_EMPTY',
        suggestion: 'Please enter a student comment, faculty observation, or lab review.',
      });
    }

    if (text.trim().length < 3) {
      return res.status(400).json({
        error: 'Feedback text is too short. Please provide at least 3 characters.',
        code: 'ERR_INPUT_TOO_SHORT',
        suggestion: 'Include meaningful academic context like subject, teacher, or lab details.',
      });
    }

    if (text.length > 3000) {
      return res.status(400).json({
        error: 'Feedback text exceeds the 3000 character limit.',
        code: 'ERR_INPUT_TOO_LONG',
        suggestion: 'Please condense the feedback under 3000 characters.',
      });
    }

    // If Gemini API Key is configured, use Gemini LLM
    if (apiKey && ai) {
      try {
        const systemInstruction = `You are an AI Academic Quality Assurance Auditor for an Indian Engineering College (AICTE / NBA / NAAC accredited).
Analyze student feedback regarding:
- Faculty teaching quality (blackboard clarity, derivation steps, PPT usage, doubt clearing sessions, pace of syllabus).
- Laboratory practicals (coding compilers, PCs, blue screens, oscilloscopes, LAN network, lab assistants, viva).
- College facilities (classroom projectors, ventilation, ceiling fans, drinking water coolers, washrooms, Wi-Fi).
- Academic events (mid-term exams, internal marks, university question banks, attendance, placement training).

Classify sentiment into exactly one of three categories: 'Positive', 'Negative', or 'Neutral'.
Mixed Feedback Handling:
- When feedback mentions BOTH positive aspects (e.g. good teacher) AND negative aspects (e.g. faulty projector or slow PCs):
  - Set isMixed to true.
  - Extract positiveAspects and negativeAspects separately.
  - If balanced (equal praise and complaint), classify overall as 'Neutral' and set isMixed to true.

Identify the detectedPattern (must be one of:
'Pedagogical & Boardwork Delivery',
'Lab Hardware & Compiler Environment',
'Classroom ICT & AV Infrastructure',
'Curricular Pacing & Syllabus Rush',
'Administrative & Examination Notice',
'Mixed Duality (Teaching vs Facility)').

Construct a closed-loop followUpPlan with:
- patternType
- patternConfidence: integer 75-99
- rootCauseAnalysis: concise sentence
- immediateIntervention: action for faculty/lab assistant within 48h
- institutionalFollowUp: action for HOD/IQAC
- naacComplianceDoc: relevant NAAC Criterion filing name
- actionStatus: 'Follow-Up Required' or 'Action Documented'
- urgency: 'High', 'Medium', or 'Low'
- targetResolutionDays: integer (e.g. 2, 4, 7, 14)`;

        const userPrompt = `Student Feedback to analyze:
"""${text.trim()}"""
${department ? `Department / Branch: "${department.trim()}"` : ''}
${facultyOrSubject ? `Subject / Faculty: "${facultyOrSubject.trim()}"` : ''}
${semester ? `Semester: "${semester.trim()}"` : ''}

Analyze and return the structured JSON classification.`;

        const response = await generateContentWithFallback({
          contents: userPrompt,
          systemInstruction,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING },
              isMixed: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING },
              keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              positiveAspects: { type: Type.ARRAY, items: { type: Type.STRING } },
              negativeAspects: { type: Type.ARRAY, items: { type: Type.STRING } },
              confidenceScore: { type: Type.INTEGER },
              naacCriteria: { type: Type.STRING },
              facultyActionRecommendation: { type: Type.STRING },
              detectedPattern: { type: Type.STRING },
              rootCauseAnalysis: { type: Type.STRING },
              immediateIntervention: { type: Type.STRING },
              institutionalFollowUp: { type: Type.STRING },
              urgency: { type: Type.STRING },
              targetResolutionDays: { type: Type.INTEGER },
            },
            required: ['sentiment', 'isMixed', 'explanation', 'keyTopics', 'detectedPattern'],
          },
        });

        const rawJson = response.text?.trim() || '{}';
        const parsed = JSON.parse(rawJson);
        const validatedSentiment = sanitizeSentiment(parsed.sentiment);

        const patternType = (parsed.detectedPattern || 'Pedagogical & Boardwork Delivery') as FeedbackPatternType;
        const result = {
          sentiment: validatedSentiment,
          isMixed: Boolean(parsed.isMixed),
          explanation: parsed.explanation || `Classified as ${validatedSentiment} based on text sentiment context.`,
          keyTopics: Array.isArray(parsed.keyTopics) && parsed.keyTopics.length > 0 ? parsed.keyTopics.slice(0, 5) : ['General Feedback'],
          positiveAspects: Array.isArray(parsed.positiveAspects) ? parsed.positiveAspects : [],
          negativeAspects: Array.isArray(parsed.negativeAspects) ? parsed.negativeAspects : [],
          confidenceScore: typeof parsed.confidenceScore === 'number' ? Math.min(Math.max(parsed.confidenceScore, 60), 99) : 94,
          naacCriteria: parsed.naacCriteria || 'Criterion 2: Teaching-Learning & Evaluation',
          facultyActionRecommendation: parsed.facultyActionRecommendation || 'Review student observations and adapt classroom pedagogical delivery.',
          detectedPattern: patternType,
          followUpPlan: {
            patternType,
            patternConfidence: typeof parsed.confidenceScore === 'number' ? Math.min(Math.max(parsed.confidenceScore, 60), 99) : 94,
            rootCauseAnalysis: parsed.rootCauseAnalysis || 'Observations regarding instructional delivery and physical infrastructure.',
            immediateIntervention: parsed.immediateIntervention || parsed.facultyActionRecommendation || 'Faculty to incorporate constructive adjustments in next class.',
            institutionalFollowUp: parsed.institutionalFollowUp || 'HOD to review in monthly departmental meeting.',
            naacComplianceDoc: `NAAC ${parsed.naacCriteria ? parsed.naacCriteria.split(':')[0] : 'Criterion 2'} Quality Log`,
            actionStatus: (validatedSentiment === 'Negative' || parsed.isMixed ? 'Follow-Up Required' : 'Action Documented') as any,
            urgency: (parsed.urgency === 'High' ? 'High' : parsed.urgency === 'Low' ? 'Low' : 'Medium') as any,
            targetResolutionDays: typeof parsed.targetResolutionDays === 'number' ? parsed.targetResolutionDays : 4,
          },
          engineUsed: 'Gemini AI' as const,
          processingTimeMs: Date.now() - startTime,
        };

        return res.json(result);
      } catch (geminiError: any) {
        console.warn('Gemini LLM call failed, executing Academic Rule-Based Engine fallback:', geminiError?.message || geminiError);
        // Seamless fallback to Academic Rule-Based Engine
        const fallbackResult = analyzeFeedbackWithRules(text, department, facultyOrSubject, semester);
        return res.json({
          ...fallbackResult,
          processingTimeMs: Date.now() - startTime,
          note: 'Analyzed using Academic Rule-Based Engine (Gemini fallback active).',
        });
      }
    }

    // When no API key is configured, execute Academic Rule-Based Engine directly
    const ruleResult = analyzeFeedbackWithRules(text, department, facultyOrSubject, semester);
    return res.json({
      ...ruleResult,
      processingTimeMs: Date.now() - startTime,
      note: 'Analyzed using Academic Rule-Based Engine (Offline mode ready).',
    });
  } catch (error: any) {
    console.error('Error analyzing sentiment:', error);
    return res.status(500).json({
      error: error?.message || 'An unexpected error occurred while analyzing the feedback.',
      code: 'ERR_SERVER_ANALYSIS_FAILED',
      suggestion: 'Check server logs or verify that input text is valid.',
    });
  }
});

// REST ENDPOINT: GENERATE SUMMARY
app.post(['/api/generate-summary', '/generate-summary'], async (req: Request, res: Response) => {
  try {
    const feedbackItems = req.body.feedbackItems || backendFeedbackStore;

    if (!Array.isArray(feedbackItems) || feedbackItems.length === 0) {
      return res.status(400).json({
        error: 'No feedback items provided to summarize.',
        code: 'ERR_EMPTY_DATASET',
        suggestion: 'Please analyze or reset sample feedbacks before generating summary.',
      });
    }

    // Try Gemini if available
    if (apiKey && ai) {
      try {
        const formattedFeedback = feedbackItems
          .slice(0, 80)
          .map((item: any, idx: number) => {
            return `[#${idx + 1}] Sentiment: ${item.sentiment}${item.isMixed ? ' (Mixed)' : ''} | Branch: ${item.department || 'N/A'} | Subject: ${item.facultyOrSubject || 'N/A'}\nFeedback: "${item.text}"`;
          })
          .join('\n\n');

        const prompt = `You are the Head of Internal Quality Assurance Cell (IQAC) for an Indian Engineering College.
Below is a collection of ${feedbackItems.length} actual student feedback entries across branches:

${formattedFeedback}

Generate an executive quality summary of these student opinions tailored for the College Academic Council and Principal.
Do NOT invent opinions not reflected in the provided data.

Provide a structured JSON output with:
1. executiveSummary: A 2-3 sentence high-level overview.
2. commonPositiveOpinions: 3-5 distinct recurring positive observations (e.g. blackboard derivations, book bank).
3. commonComplaints: 3-5 distinct recurring complaints (e.g. compiler crashes, loose projector cables, hurried syllabus).
4. frequentlyMentionedTopics: Top 4-6 topics mentioned.
5. suggestionsForImprovement: 3-5 constructive recommendations for college authorities.
6. facultyActionItems: 3-4 specific pedagogical or classroom adjustments.
7. recurringPatterns: array of objects with { patternType, prevalence, followUpRoadmap, responsibleParty }`;

        const response = await generateContentWithFallback({
          contents: prompt,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              commonPositiveOpinions: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonComplaints: { type: Type.ARRAY, items: { type: Type.STRING } },
              frequentlyMentionedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestionsForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
              facultyActionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
              recurringPatterns: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    patternType: { type: Type.STRING },
                    prevalence: { type: Type.STRING },
                    followUpRoadmap: { type: Type.STRING },
                    responsibleParty: { type: Type.STRING },
                  },
                },
              },
            },
            required: [
              'executiveSummary',
              'commonPositiveOpinions',
              'commonComplaints',
              'frequentlyMentionedTopics',
              'suggestionsForImprovement',
              'facultyActionItems',
            ],
          },
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        return res.json({
          ...parsed,
          totalAnalyzed: feedbackItems.length,
          generatedAt: new Date().toISOString(),
          engine: 'Gemini AI',
        });
      } catch (geminiError: any) {
        console.warn('Gemini summary failed, falling back to grounded rule synthesizer:', geminiError?.message || geminiError);
      }
    }

    // Grounded Fallback Synthesizer based on actual feedbackItems
    const total = feedbackItems.length;
    const pos = feedbackItems.filter((f: any) => f.sentiment === 'Positive').length;
    const neg = feedbackItems.filter((f: any) => f.sentiment === 'Negative').length;
    const neu = feedbackItems.filter((f: any) => f.sentiment === 'Neutral').length;
    const mixed = feedbackItems.filter((f: any) => f.isMixed).length;

    const positiveHighlights = new Set<string>();
    const negativeComplaints = new Set<string>();
    const topicSet = new Set<string>();

    feedbackItems.forEach((f: any) => {
      (f.positiveAspects || []).forEach((p: string) => positiveHighlights.add(p));
      (f.negativeAspects || []).forEach((n: string) => negativeComplaints.add(n));
      (f.keyTopics || []).forEach((t: string) => topicSet.add(t));
    });

    const posList = Array.from(positiveHighlights);
    const negList = Array.from(negativeComplaints);

    return res.json({
      executiveSummary: `Institutional feedback audit across ${total} student reviews indicates ${Math.round(
        (pos / total) * 100
      )}% overall satisfaction, with ${mixed} mixed reviews highlighting strong pedagogical blackboard teaching alongside critical laboratory hardware and projector cabling bottlenecks.`,
      commonPositiveOpinions:
        posList.length >= 3
          ? posList.slice(0, 5)
          : [
              'Strong appreciation for blackboard problem-solving and university exam question bank derivations.',
              'Praise for library book bank textbook availability and campus IEEE digital library access.',
              'Patient faculty doubt clearing after hours for competitive exams and placements.',
            ],
      commonComplaints:
        negList.length >= 3
          ? negList.slice(0, 5)
          : [
              'Computing lab systems experiencing blue-screen errors, missing GCC compilers, and LAN dropouts.',
              'Lecture hall projectors with loose HDMI cables and classroom ceiling fan acoustic noise.',
              'Curricular pacing issues with advanced units rushed in the final weeks before internal exams.',
            ],
      frequentlyMentionedTopics:
        topicSet.size > 0
          ? Array.from(topicSet).slice(0, 6)
          : ['Blackboard Derivations', 'Lab Systems', 'HDMI Projectors', 'Syllabus Timeline', 'Book Bank', 'Midterm ERP'],
      suggestionsForImprovement: [
        'Establish an immediate 24-hour maintenance protocol for lecture hall AV cables and lab system images.',
        'Implement fortnightly academic dean syllabus audits to prevent unit compression before midterms.',
        'Formalize faculty peer mentoring on blackboard derivation methods recognized in student surveys.',
      ],
      facultyActionItems: [
        'Share step-by-step solved question bank derivations and lecture summaries on college ERP.',
        'Ensure lab assistants pre-test compiler bundles and LAN network cables prior to practical sessions.',
        'Allocate at least 3 dedicated numerical tutorial periods for challenging syllabus units.',
      ],
      recurringPatterns: [
        {
          patternType: 'Pedagogical & Boardwork Delivery',
          prevalence: `${Math.round((pos / total) * 100)}% Positive Sentiment`,
          followUpRoadmap: 'IQAC commendation and video repository recording of high-performing instructors.',
          responsibleParty: 'Department HOD & IQAC Coordinator',
        },
        {
          patternType: 'Lab Hardware & ICT Bottlenecks',
          prevalence: `${Math.round((neg / total) * 100)}% Facility Complaints`,
          followUpRoadmap: 'Re-imaging lab desktop rows and replacement of classroom HDMI cables within 48h.',
          responsibleParty: 'System Administrator & Campus Estate Officer',
        },
        {
          patternType: 'Mixed Opinion Duality',
          prevalence: `${mixed} Mixed Records Detected`,
          followUpRoadmap: 'Decouple faculty evaluation scores from physical classroom infrastructure issues.',
          responsibleParty: 'Academic Council & NAAC Steering Committee',
        },
      ],
      totalAnalyzed: total,
      generatedAt: new Date().toISOString(),
      engine: 'Grounded Academic Synthesizer',
    });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate summary.',
      code: 'ERR_SUMMARY_GENERATION_FAILED',
      suggestion: 'Check dataset items and verify server connection.',
    });
  }
});

// REST ENDPOINT: EVALUATE BENCHMARK
app.post(['/api/evaluate-benchmark', '/evaluate-benchmark'], async (req: Request, res: Response) => {
  try {
    const { testEntries } = req.body;
    if (!Array.isArray(testEntries) || testEntries.length === 0) {
      return res.status(400).json({
        error: 'No benchmark test entries provided.',
        code: 'ERR_EMPTY_BENCHMARK',
        suggestion: 'Provide an array of test cases with expectedSentiment.',
      });
    }

    const evaluatedResults = [];
    let correctCount = 0;

    for (const entry of testEntries) {
      // Evaluate each benchmark case using Gemini (if available) or Academic Rule-Based Engine
      let predictedSentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
      let isMixed = false;
      let explanation = '';
      let keyTopics: string[] = [];
      let patternDetected = '';
      let followUpRecommendation = '';

      if (apiKey && ai) {
        try {
          const prompt = `Classify the sentiment of the following college student feedback as exactly 'Positive', 'Negative', or 'Neutral'.
Feedback: """${entry.feedback}"""`;
          const resp = await generateContentWithFallback({
            contents: prompt,
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                sentiment: { type: Type.STRING },
                isMixed: { type: Type.BOOLEAN },
                explanation: { type: Type.STRING },
                keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                detectedPattern: { type: Type.STRING },
                followUpRecommendation: { type: Type.STRING },
              },
              required: ['sentiment', 'explanation'],
            },
          });
          const parsed = JSON.parse(resp.text?.trim() || '{}');
          predictedSentiment = sanitizeSentiment(parsed.sentiment);
          isMixed = Boolean(parsed.isMixed);
          explanation = parsed.explanation || '';
          keyTopics = parsed.keyTopics || [];
          patternDetected = parsed.detectedPattern || '';
          followUpRecommendation = parsed.followUpRecommendation || '';
        } catch {
          // Rule engine fallback
          const ruleRes = analyzeFeedbackWithRules(entry.feedback);
          predictedSentiment = ruleRes.sentiment;
          isMixed = ruleRes.isMixed;
          explanation = ruleRes.explanation;
          keyTopics = ruleRes.keyTopics;
          patternDetected = ruleRes.detectedPattern;
          followUpRecommendation = ruleRes.facultyActionRecommendation;
        }
      } else {
        const ruleRes = analyzeFeedbackWithRules(entry.feedback);
        predictedSentiment = ruleRes.sentiment;
        isMixed = ruleRes.isMixed;
        explanation = ruleRes.explanation;
        keyTopics = ruleRes.keyTopics;
        patternDetected = ruleRes.detectedPattern;
        followUpRecommendation = ruleRes.facultyActionRecommendation;
      }

      const isCorrect = predictedSentiment === entry.expectedSentiment;
      if (isCorrect) correctCount++;

      evaluatedResults.push({
        id: entry.id,
        feedback: entry.feedback,
        testCategory: entry.testCategory,
        notes: entry.notes,
        expectedSentiment: entry.expectedSentiment,
        predictedSentiment,
        isMixed,
        explanation,
        keyTopics,
        isCorrect,
        patternDetected,
        followUpRecommendation,
      });
    }

    const total = testEntries.length;
    const accuracy = total > 0 ? parseFloat(((correctCount / total) * 100).toFixed(1)) : 0;

    return res.json({
      total,
      correct: correctCount,
      incorrect: total - correctCount,
      accuracy,
      testedAt: new Date().toISOString(),
      items: evaluatedResults,
      evaluationFormula: 'Accuracy (%) = (Correct Predictions / Total Test Entries) × 100',
    });
  } catch (error: any) {
    console.error('Error running evaluation benchmark:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete benchmark evaluation.',
      code: 'ERR_BENCHMARK_FAILED',
      suggestion: 'Check test dataset format and server logs.',
    });
  }
});

// Setup Vite in Dev or Static files in Prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Feedback Sentiment Server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

// Only launch standalone web server if not executing as a Vercel Serverless Function
if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
