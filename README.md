# Skill2Career — AI-Powered Skill Gap Analysis & Career Opportunity Management Platform

Skill2Career is a full-stack platform designed to bridge the gap between academic preparation and industry expectations. It enables students to analyze their skills against live job descriptions, receive AI-generated skill gap evaluations and personalized learning roadmaps, and connect directly with verified recruiters.

---

## 🌟 Key Features

### 🎓 Student Features
- **Interactive Landing Page**: Modern, responsive introduction with feature overviews and calls to action.
- **Authentication & Role System**: Secure JWT-based registration and login with role-specific navigation.
- **Student Dashboard**: Real-time profile completion score, application tracker, recommended opportunities, and quick action shortcuts.
- **Student Profile & Skills**: Manage education, career objectives, technical skills with competency levels (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
- **Resume Management**: Secure multi-resume upload (PDF/DOCX, 5MB limit), set primary resume, stream download, and delete.
- **Job Search & Filters**: Search opportunities by title, location, and employment type (`Full-time`, `Part-time`, `Contract`, `Remote`, `Internship`).
- **Job Detail & 1-Click Apply**: View detailed responsibilities and competencies, attach selected resume, and include a personal pitch.
- **AI Skill-Gap Analysis**: Evaluate skills against any job opening or custom job description. Displays quantitative match score (0–100%), matched badges, missing competencies, and actionable Google Gemini AI insights.
- **Personalized Learning Roadmap**: Milestone checklist with progress tracking (`Not Started`, `In Progress`, `Completed`) and progress bar.
- **My Applications**: Comprehensive tracking of submitted applications with status badges (`Applied`, `Screening`, `Interview`, `Selected`, `Rejected`, `Withdrawn`).

### 🏢 Recruiter Features
- **Recruiter Dashboard**: Overview of posted jobs, live vs. draft counts, and company account verification badge.
- **Company Profile**: Manage company name, recruitment email, website, and organizational bio.
- **Job Management**: Create, edit, publish, close, and delete job postings with required skills and salary ranges.
- **Candidate Pipeline Tracker**: Inspect applicants per job, review cover notes, download student resumes, and transition candidate status (`Applied` → `Screening` → `Interview` → `Selected`).

### 🛡️ Admin Features
- **System Overview**: Summary metric cards for total users, students, recruiters, and job listings.
- **User Management**: Inspect registered users with safe deletion and cascade cleanup.
- **Recruiter Verification**: Verify or revoke recruiter credentials to ensure high trust.
- **Job Moderation**: Inspect and remove invalid job postings across the platform.

### ⚡ Resilient Demo Mode
- If MongoDB or external AI services are not configured or temporarily unreachable, all pages automatically transition into a **clearly labeled Demo Mode** for UI inspection and preview. Actions that cannot be completed in demo mode are gracefully flagged.

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)
- (Optional) MongoDB Atlas database connection string
- (Optional) Google Gemini API Key from Google AI Studio

### Terminal 1 — Backend API Server
```bash
cd backend
npm install
node src/index.js
```
The backend starts at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

### Terminal 2 — Frontend Application (Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend starts at: `http://localhost:5173`

---

## 🌐 Available Routes & Navigation

| Route | Role / Access | Purpose |
|---|---|---|
| `/` | Public | Platform Landing Page & Feature Showcase |
| `/login` | Public | User Authentication with demo fill helpers |
| `/register` | Public | Student & Recruiter Account Registration |
| `/student/dashboard` | Student | Student Dashboard, Metrics & Recommendations |
| `/student/profile` | Student | Profile, Competency Skills & Resume Manager |
| `/student/jobs` | Student | Job Search, Multi-Filter & Gap Trigger |
| `/student/jobs/:id` | Student | Job Details & Resume Attachment Submission |
| `/student/analysis` | Student | AI Gap Analysis with Match Score & Gemini Insights |
| `/student/roadmap` | Student | Milestones Checklist & Progress Tracker |
| `/student/applications` | Student | Student Application Status Pipeline |
| `/recruiter/dashboard` | Recruiter | Recruiter Workspace & Job Postings |
| `/recruiter/profile` | Recruiter | Company Profile & Verification Status |
| `/recruiter/jobs/:jobId/applicants` | Recruiter | Candidate Review & Status Progression |
| `/admin/dashboard` | Admin | Administration Control Panel & Moderation |

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/skill2career?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
GEMINI_MODEL=gemini-2.0-flash
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Configuration (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

## 🏗️ Production Build Verification

To verify that the frontend compiles cleanly for production:
```bash
cd frontend
npm run build
```
Build output is saved to `frontend/dist/`.

---

## 🚢 Deployment Guide

### Deploying the Frontend (Netlify)
1. Link your repository to Netlify.
2. In the Netlify build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Environment variables in Netlify:
   - `VITE_API_URL`: Your deployed backend API URL (e.g., `https://skill2career-api.onrender.com`)
4. The included `netlify.toml` and `frontend/public/_redirects` automatically route SPA requests to `/index.html`.

### Deploying the Backend (Render / Railway)
1. Create a **Web Service** pointing to the repository.
2. Build & Start Settings:
   - **Root directory**: `backend`
   - **Build command**: `npm install`
   - **Start command**: `node src/index.js`
3. Configure Environment Variables:
   - `PORT`: `5000` (or leave default for provider)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: MongoDB Atlas connection string (allow IP `0.0.0.0/0` in Atlas Network Access)
   - `JWT_SECRET`: Random 32+ character string
   - `GEMINI_API_KEY`: Google Gemini API key
   - `FRONTEND_URL`: URL of your deployed frontend (e.g., `https://skill2career.netlify.app`)
