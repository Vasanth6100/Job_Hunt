# JobHunt Agent – Intelligent Agentic AI for Automated Job Discovery and Filtering
**Academic Research MVP (50% Implementation)**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Sentence Transformers](https://img.shields.io/badge/all--MiniLM--L6--v2-Sentence%20Transformers-orange?style=flat-square)](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## Project Overview

**JobHunt Agent** is an academic research project that proposes an Intelligent Agentic AI system for automated job discovery and filtering. Unlike traditional job portals that rely on keyword matching, JobHunt Agent leverages **semantic vector representations** via `all-MiniLM-L6-v2` (Sentence Transformers) to compute **cosine similarity** between a candidate's resume and job descriptions.

> **IEEE Research Paper**: "JobHunt Agent – An Intelligent Agentic AI for Automated Job Discovery and Filtering"

---

## Architecture

```
React Frontend (Vite)
       │
       │ REST API / JSON
       ▼
FastAPI Backend (Python)
       │
       ├── Resume Processing (rule-based entity extraction)
       │
       ├── Sentence Transformers (all-MiniLM-L6-v2)
       │       └── 384-dimensional dense embeddings
       │
       ├── Cosine Similarity Matrix (scikit-learn)
       │       └── Resume ↔ Job semantic match scores
       │
       ├── Job Ranking (sorted by similarity score)
       │
       ├── Fake Job Heuristic Engine (rule-based)
       │
       └── JSON Job Dataset (32 realistic records)
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 19 | UI Framework |
| Vite | 8 | Build Tool & Dev Server |
| Tailwind CSS | v4 | Styling |
| React Router | 7 | Client-side Routing |
| Lucide React | latest | Icon Library |
| Axios | 1.x | HTTP Client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Backend Language |
| FastAPI | 0.110+ | REST API Framework |
| Uvicorn | 0.28+ | ASGI Server |
| Pydantic | v2 | Data Validation |
| python-multipart | 0.0.9+ | File Upload |

### AI / Machine Learning (LOCAL - No External Paid APIs)
| Technology | Purpose |
|-----------|---------|
| `sentence-transformers>=2.5.0` | Pre-trained MiniLM model loading |
| `all-MiniLM-L6-v2` (HuggingFace) | 384-d semantic text embeddings |
| `scikit-learn>=1.4.0` | `cosine_similarity()` computation |
| `numpy` | Dense matrix operations |
| `pypdf` | PDF resume text extraction |
| `python-docx` | DOCX resume text extraction |

### Data Storage (MVP)
- `backend/data/jobs.json` — 32 realistic job records (all categories)
- `localStorage` — Frontend user state (auth, saved jobs, applications, preferences)

---

## Semantic Matching Algorithm

The core AI pipeline:

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Model loaded ONCE at FastAPI startup
model = SentenceTransformer("all-MiniLM-L6-v2")

# 2. Job embeddings pre-computed and cached in RAM
job_embeddings = model.encode(job_texts, convert_to_numpy=True)

# 3. At matching time - only resume encoded
resume_embedding = model.encode([resume_text], convert_to_numpy=True)

# 4. Cosine similarity between all job vectors and resume vector
similarities = cosine_similarity(resume_embedding, job_embeddings)[0]

# 5. Map to percentage score
match_score = round(max(0.0, similarity) * 100, 1)  # e.g., 80.0%
```

> **IMPORTANT**: Match scores are **100% real** — derived from MiniLM cosine similarity. No random numbers or hardcoded values.

---

## Fake Job Risk Detection

A transparent rule-based heuristic engine (`backend/services/fake_job_detector.py`) checks for:

1. Scam keywords (Telegram, wire transfer, registration fee, crypto, gift cards)
2. Missing or anonymous company information
3. Missing job location
4. Suspiciously short/vague job descriptions (< 120 chars)
5. Unrealistic salary claims for zero experience
6. Very few or no skill requirements
7. Urgency bait in job titles

Returns a `risk_score` (0–100), `risk_level` (Low / Moderate / High), and detailed flagged reasons.

> Labeled as **"Prototype Fake Job Risk Analysis"** in all UI components.

---

## Project Folder Structure

```
job_hunt/
├── backend/
│   ├── ai/
│   │   ├── __init__.py
│   │   └── matching.py              # SemanticMatchingEngine (MiniLM singleton + cosine similarity)
│   ├── data/
│   │   ├── jobs.json                # 32 realistic job records (30 clean + 2 scam test cases)
│   │   └── users.json               # Demo user seed
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py               # Pydantic models
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── jobs.py                  # GET /api/jobs, GET /api/jobs/{id}
│   │   ├── matching.py              # POST /api/match-jobs
│   │   ├── resume.py                # POST /api/analyze-resume, POST /api/upload-resume
│   │   ├── fake_detector.py         # POST /api/fake-job-check
│   │   └── stats.py                 # GET /api/stats
│   ├── services/
│   │   ├── __init__.py
│   │   ├── fake_job_detector.py     # Heuristic scam detection rules
│   │   └── resume_parser.py         # PDF/DOCX/TXT extraction + entity parsing
│   ├── venv/                        # Python virtual environment (not committed)
│   ├── main.py                      # FastAPI app with lifespan (model init at startup)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── MatchBadge.jsx
│   │   │   │   └── RiskBadge.jsx
│   │   │   └── jobs/
│   │   │       └── JobCard.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── FindJobsPage.jsx
│   │   │   ├── JobDetailsPage.jsx
│   │   │   ├── ResumeAnalysisPage.jsx
│   │   │   ├── SavedJobsPage.jsx
│   │   │   ├── ApplicationsPage.jsx
│   │   │   ├── CoverLetterPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── PreferencesPage.jsx
│   │   │   ├── AcademicMappingPage.jsx
│   │   │   └── AboutPage.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Axios client for FastAPI endpoints
│   │   │   └── storage.js           # localStorage helpers
│   │   ├── App.jsx                  # React Router setup
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm 10+
- Internet connection (first run — downloads `all-MiniLM-L6-v2` model ~91MB from HuggingFace)

---

### Backend Setup

```bash
cd backend

# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install all Python dependencies
pip install -r requirements.txt

# 4. Start FastAPI server (model downloads automatically on first run)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**On first run**, the terminal will show:
```
[*] Initializing SemanticMatchingEngine with all-MiniLM-L6-v2...
Loading weights: 100%|##########| 103/103
[*] Encoding 32 job listings in memory...
[OK] MiniLM model and 32 job embeddings successfully cached in 11.57s!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## How to Run (Both Servers)

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd job_hunt/backend
.\venv\Scripts\activate        # Windows
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd job_hunt/frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health, model load status |
| `GET` | `/api/jobs` | All jobs with search/filter params |
| `GET` | `/api/jobs/{id}` | Single job with risk assessment |
| `POST` | `/api/match-jobs` | **Real MiniLM semantic matching** (core endpoint) |
| `POST` | `/api/analyze-resume` | Parse resume text for skills/education |
| `POST` | `/api/upload-resume` | Upload PDF/DOCX/TXT and analyze |
| `POST` | `/api/fake-job-check` | Heuristic scam/fraud risk assessment |
| `GET` | `/api/stats` | Dataset and corpus statistics |

### Example: Match Jobs

**Request:**
```json
POST /api/match-jobs
{
    "resume_text": "Python developer with FastAPI, PostgreSQL, Docker, REST APIs"
}
```

**Response:**
```json
{
    "total_jobs_evaluated": 32,
    "matches_returned": 30,
    "execution_time_ms": 23.05,
    "model_used": "all-MiniLM-L6-v2",
    "results": [
        {
            "job_id": 1,
            "title": "Python Backend Developer",
            "company": "TechNova Solutions",
            "match_score": 80.0,
            "similarity": 0.8001,
            "match_level": "High Match",
            "matched_skills": ["Python", "FastAPI", "Docker"],
            "missing_skills": ["SQL", "Git"],
            "risk": {
                "risk_score": 5,
                "risk_level": "Low",
                "reasons": []
            }
        }
    ]
}
```

---

## Demo Login Credentials

For academic evaluation:
| Field | Value |
|-------|-------|
| Email | `demo@jobhunt.com` |
| Password | `123456` |

---

## Evaluator Demo Walkthrough

1. Open **http://localhost:5173** → Landing page with architecture diagram
2. Click **"Demo Login"** → Fill defaults → Submit
3. **Dashboard** → View 6 metric cards + Real MiniLM top 5 matches
4. **Resume Analysis** → Click any "Test Preset" → Parse & Extract → Match with 32 Jobs
5. **Find Jobs** → All 32 jobs ranked by semantic score, filterable
6. **Job Details** → View Match breakdown, Risk reasons, Cover letter CTA
7. **Saved Jobs** / **Applications** → Save and track jobs
8. **Cover Letter** → Generate personalized letter
9. **Analytics** → See skill demand, location distribution, funnel stats
10. **Academic Mapping** → SDG 8/9/16, PO2-12, PSO1-3 tables

---

## Implemented Features (50% Real MVP)

| Feature | Status | Technology |
|---------|--------|-----------|
| Semantic job matching | ✅ Real | all-MiniLM-L6-v2 + cosine_similarity |
| 32 realistic job listings | ✅ Real | jobs.json with embedding cache |
| Resume text parsing (skills, education) | ✅ Real | Rule/regex-based heuristic parser |
| PDF / DOCX / TXT resume upload | ✅ Real | pypdf + python-docx |
| Fake job heuristic detection | ✅ Real | Custom pattern-matching rules |
| Job search & multi-filter | ✅ Real | Client-side filtering + API |
| Saved jobs (localStorage) | ✅ Real | Browser localStorage |
| Application status tracker | ✅ Real | localStorage state machine |
| Cover letter generator | ✅ Prototype | Deterministic template engine |
| Analytics dashboard | ✅ Real | Real dataset aggregations |
| User preferences | ✅ Real | localStorage |
| SDG / PO / PSO academic mapping | ✅ Documented | Static page |

## Future Scope (Phase 2)

| Feature | Technology |
|---------|-----------|
| Live job scraping | LinkedIn / Indeed APIs / Playwright |
| Database persistence | MongoDB Atlas |
| Job alert notifications | Telegram Bot API |
| Browser integration | Chrome Extension |
| Adaptive personalization | Reinforcement learning |
| Cloud deployment | AWS / GCP / Railway |

---

## Academic Compliance Note

This project honestly distinguishes between:

- **REAL AI**: Sentence Transformers + cosine similarity = **no fake match scores**
- **PROTOTYPE**: Resume entity extraction, Cover letter template engine
- **FUTURE**: MongoDB, live scraping, Telegram, Chrome extension, advanced RL personalization

All components are clearly labeled in the UI.

---

*JobHunt Agent | Academic Research MVP | IEEE Reference Project*
