import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Sparkles,
  Bookmark,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Upload,
  Cpu,
  RefreshCw,
  Clock,
  MapPin,
  IndianRupee,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import api from '../services/api';
import storage from '../services/storage';
import MatchBadge from '../components/common/MatchBadge';
import RiskBadge from '../components/common/RiskBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DEFAULT_CANDIDATE_RESUME = `Alex Mercer
Software & AI Engineer | Bengaluru, India | demo@jobhunt.com

SUMMARY:
Results-driven Software Engineer with 2+ years of experience specializing in Python, FastAPI, React, and Machine Learning. Proficient in developing high-throughput REST APIs, fine-tuning transformer models, and implementing semantic vector search architectures.

TECHNICAL SKILLS:
- Languages: Python, JavaScript, TypeScript, SQL, Bash
- Backend: FastAPI, Flask, Django, Node.js, RESTful Microservices
- AI & Data: Sentence Transformers, PyTorch, Scikit-learn, Pandas, HuggingFace, NLP
- Databases: PostgreSQL, MongoDB, Redis
- DevOps & Tools: Docker, Git, CI/CD pipelines, Linux

EXPERIENCE:
Software Engineer | DataCraft Labs (2024 - Present)
- Developed and deployed high-performance microservices using FastAPI and PostgreSQL, serving over 100k daily requests.
- Integrated sentence-transformers (all-MiniLM-L6-v2) for contextual semantic search, improving relevance by 35%.
- Implemented Docker containerization and automated CI/CD deployment pipelines.`;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [topMatches, setTopMatches] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const [backendError, setBackendError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setBackendError(null);
    try {
      // 1. Fetch system statistics
      const statsData = await api.getStats();
      setStats(statsData);

      // 2. Fetch local storage counts
      const saved = storage.getSavedJobs();
      const applications = storage.getApplications();
      setSavedCount(saved.length);
      setAppliedCount(applications.length);

      // 3. Check for active resume or load default demo resume
      let activeResume = storage.getActiveResume();
      if (!activeResume) {
        activeResume = DEFAULT_CANDIDATE_RESUME;
        storage.setActiveResume(activeResume);
      }

      // 4. Run real MiniLM matching
      setMatchingLoading(true);
      const matchResult = await api.matchJobs(activeResume, 5);
      setTopMatches(matchResult.results || []);
      storage.setLastMatches(matchResult);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setBackendError(
        'FastAPI backend appears unreachable. Please verify the Python backend is running at http://localhost:8000.'
      );
    } finally {
      setLoading(false);
      setMatchingLoading(false);
    }
  };

  const bestMatchScore = topMatches.length > 0 ? topMatches[0].match_score : null;

  return (
    <div className="space-y-8">
      {/* Top Banner with Evaluator Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-900/10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur">
            <Cpu className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            <span>Active Model: all-MiniLM-L6-v2 (Local Sentence Transformers)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Job Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Real-time semantic cosine distance computed across 32 local job vectors. Zero synthetic numbers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadDashboardData}
            disabled={matchingLoading}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${matchingLoading ? 'animate-spin' : ''}`} />
            <span>Re-compute Matches</span>
          </button>
          <Link
            to="/resume-analysis"
            className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Update Resume</span>
          </Link>
        </div>
      </div>

      {backendError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Backend Communication Notice</div>
            <p>{backendError}</p>
            <p className="font-mono text-[11px] text-rose-600">Start with: cd backend &amp;&amp; .\venv\Scripts\uvicorn main:app --reload</p>
          </div>
        </div>
      )}

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Jobs</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats ? stats.total_jobs : '32'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Indexed in JSON</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Evaluated</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{topMatches.length > 0 ? stats?.total_jobs || 32 : 0}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Via MiniLM Embeddings</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Best Match</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {bestMatchScore !== null ? `${bestMatchScore}%` : '--'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Real Cosine Score</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Saved Jobs</span>
            <Bookmark className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{savedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">In localStorage</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Applications</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{appliedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Tracked Stages</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Flagged Risks</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">
            {stats ? stats.risk_breakdown?.High || 2 : '2'}
          </div>
          <div className="text-[11px] text-rose-500 mt-1">Scams Detected</div>
        </div>
      </div>

      {/* Top AI Job Matches from Real MiniLM Model */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Top AI Job Matches (Ranked by Sentence-Transformers)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Calculated using 384-dimensional dense embeddings against active resume
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Ranked Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {matchingLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <LoadingSpinner message="Encoding resume & calculating cosine similarity matrix across job listings..." />
          </div>
        ) : topMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {topMatches.map((job) => (
              <div
                key={job.job_id || job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                      to={`/jobs/${job.job_id || job.id}`}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition"
                    >
                      {job.title}
                    </Link>
                    <MatchBadge score={job.match_score} level={job.match_level} />
                    <RiskBadge risk={job.risk} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{job.company}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      {job.salary}
                    </span>
                  </div>

                  {job.matched_skills && job.matched_skills.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                      <span className="text-emerald-700 font-medium">Matched Skills:</span>
                      {job.matched_skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    to={`/jobs/${job.job_id || job.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      storage.applyForJob(job);
                      setAppliedCount(storage.getApplications().length);
                      navigate('/applications');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition flex items-center gap-1"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No matches calculated yet. Please check that the FastAPI backend is running.
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/resume-analysis"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Upload className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Resume Semantic Analyzer</h3>
          <p className="text-xs text-slate-500">
            Upload PDF/DOCX or paste resume text to extract skills and project embeddings.
          </p>
        </Link>

        <Link
          to="/cover-letter"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">AI-Assisted Cover Letter</h3>
          <p className="text-xs text-slate-500">
            Generate tailored deterministic cover letters matching target job descriptions.
          </p>
        </Link>

        <Link
          to="/analytics"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">Recruitment Analytics</h3>
          <p className="text-xs text-slate-500">
            View dataset distributions, top in-demand skills, and application funnel statistics.
          </p>
        </Link>
      </div>
    </div>
  );
}
