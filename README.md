# Student Feedback Sentiment & Pattern Analysis System (Indian Engineering Classrooms)

A full-stack, AI-powered **Student Feedback Sentiment & Pattern Analysis System** tailored for Indian Engineering Colleges (AICTE / NAAC / NBA accredited).

---

## ⚡ Live Vercel Deployment & Criteria

This repository is fully configured to meet all **Vercel Deployment Criteria**:

- **Vercel Config**: `vercel.json` configured with Vite framework settings, rewrites (`/api/(.*)` &rarr; `/api`), and HTTP security headers.
- **Serverless API Bridge**: `api/index.ts` automatically runs Express REST API endpoints serverlessly on Vercel without requiring background VMs.
- **Zero-Crash Resilience**: If network is interrupted, Vercel cold starts occur, or `GEMINI_API_KEY` is not added, the built-in **Client-Side Academic Rule-Based Engine** seamlessly takes over in the browser so that users never experience broken UI or crashes.
- **Build Output**: `dist` (Vite SPA Production Bundle).
- **Node Engine**: `>=18.0.0` defined in `package.json`.

### Deploying to Vercel in 2 Minutes:
1. Push this repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com/new), select this repository.
3. Keep default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. *(Optional)* In **Environment Variables**, add:
   - `GEMINI_API_KEY`: `your_gemini_api_key`
5. Click **Deploy**. Your fullstack feedback sentiment analysis app is live!

---

## 🚀 Quick Start (Localhost Port 3000)

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack development server (Express + Vite)
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🛠️ Key Architectural Enhancements

### 1. 🔍 Error Clarity & Resilient Inference
- **Clear Error Banners (`ClearErrorBanner`)**: Informative, user-friendly error dialogs showing error codes (e.g., `ERR_INPUT_EMPTY`, `ERR_INPUT_TOO_SHORT`, `ERR_API_FAILURE`), plain-English explanations, and step-by-step resolution advice.
- **Zero-Crash Dual-Layer Inference Engine**:
  - Automatically utilizes **Google Gemini** (`gemini-3.1-flash-lite` / `gemini-3.8-flash`) when `GEMINI_API_KEY` is configured.
  - Automatically falls back to our built-in **Academic Rule-Based Engine** both on the server and in the browser if the API key is missing or network is unavailable, ensuring 100% uptime during live examinations and NAAC peer team visits.
- **Real-Time Input Validation**: Inline character counter with visual status and guidance tips.

### 2. 📋 The Pattern & Follow-Up Protocol (Action Taken Report / ATR)
- **Thematic Pattern Identification (`detectedPattern`)**:
  - `Pedagogical & Boardwork Delivery` (teaching quality, blackboard problem-solving)
  - `Lab Hardware & Compiler Environment` (crashes, missing compilers, LAN dropouts)
  - `Classroom ICT & AV Infrastructure` (loose HDMI cables, projector flickers, acoustic fan noise)
  - `Curricular Pacing & Syllabus Rush` (hurried units before internal exams)
  - `Administrative & Examination Notice` (timetables, internal marks)
  - `Mixed Duality (Teaching vs Facility)` (decoupling instructor praise from physical defects)
- **Closed-Loop 3-Stage Follow-Up Plan (`PatternFollowUpCard`)**:
  - **Stage 1 (Immediate / 48h)**: Faculty / Lab Assistant direct intervention.
  - **Stage 2 (Department HOD & IQAC)**: Monthly academic review and resource allocation.
  - **Stage 3 (NAAC Audit Archive)**: Compliance evidence filing under Criterion 1, 2, 4, or 5.
  - **Interactive Workflow Status**: Track actions from `Follow-Up Required` to `Action Documented` or `Closed`.
  - **One-Click ATR Copy**: Export the formatted Action Taken Report directly for academic compliance files.

### 3. 🌐 Full-Stack REST Connection Hub
- **Express REST Endpoints** (Support both `/api/*` and direct route equivalents):
  - `GET /api/health`: Live server health probe with uptime and latency monitoring.
  - `GET /api/feedbacks`: Retrieve feedback audit log.
  - `POST /api/feedbacks`: Persist feedback entries.
  - `POST /api/analyze-sentiment`: AI sentiment, pattern classification, and follow-up plan generation.
  - `POST /api/generate-summary`: Campus-wide IQAC quality synthesis.
  - `POST /api/evaluate-benchmark`: Ground-truth benchmark accuracy evaluation.
- **Interactive Full-Stack Diagnostics Modal (`FullStackConnectionModal`)**:
  - Live connection status in the navbar and dashboard.
  - Interactive "Test Ping REST API" probe displaying roundtrip latency in milliseconds.
  - Vercel Serverless Function architecture verification.
  - Transparent route catalog for examiner viva questions.

---

## ⚙️ Configuration (Optional)
To use live Google Gemini AI calls, add your API key to `.env` (locally) or Vercel Environment Variables:
```env
GEMINI_API_KEY="your_api_key_here"
PORT=3000
```
*(If left unset, the system seamlessly operates via the Academic Rule-Based Engine).*
