import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  Bookmark,
  Check,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Share2,
  Calendar,
  Building2,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import api from '../services/api';
import storage from '../services/storage';
import MatchBadge from '../components/common/MatchBadge';
import RiskBadge from '../components/common/RiskBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    setLoading(true);
    try {
      // 1. Check if we already have this job in cached last_matches with computed semantic scores
      const lastMatches = storage.getLastMatches();
      let matchedJob = null;
      if (lastMatches && lastMatches.results) {
        matchedJob = lastMatches.results.find((j) => (j.id || j.job_id) === Number(id));
      }

      if (matchedJob) {
        setJob(matchedJob);
      } else {
        // Fetch from backend
        const jobData = await api.getJobById(Number(id));
        // Also run a quick match if active resume is present
        const activeResume = storage.getActiveResume();
        if (activeResume) {
          const matchResult = await api.matchJobs(activeResume, 50);
          const found = matchResult.results.find((j) => (j.id || j.job_id) === Number(id));
          if (found) {
            setJob(found);
          } else {
            setJob(jobData);
          }
        } else {
          setJob(jobData);
        }
      }

      setIsSaved(storage.isJobSaved(Number(id)));
      setIsApplied(storage.isJobApplied(Number(id)));
    } catch (err) {
      console.error('Error loading job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = () => {
    if (!job) return;
    const jobId = job.id || job.job_id;
    if (isSaved) {
      storage.removeSavedJob(jobId);
      setIsSaved(false);
    } else {
      storage.saveJob({ ...job, id: jobId });
      setIsSaved(true);
    }
  };

  const handleApply = () => {
    if (!job) return;
    const jobId = job.id || job.job_id;
    storage.applyForJob({ ...job, id: jobId });
    setIsApplied(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving job specifics and calculating semantic vectors..." />;
  }

  if (!job) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Job Listing Not Found</h2>
        <p className="text-xs text-slate-500">The requested job ID {id} does not exist in the dataset.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Job Discovery</span>
        </Link>
      </div>
    );
  }

  const risk = job.risk;
  const matchScore = job.match_score;
  const matchedSkills = job.matched_skills || [];
  const missingSkills = job.missing_skills || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top back button & breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Search</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                {job.department || 'Engineering'}
              </span>
              <RiskBadge risk={risk} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>{job.company || 'Confidential Listing'}</span>
            </div>
          </div>

          {matchScore !== undefined && matchScore !== null && (
            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 mb-1">
                AI Semantic Match
              </span>
              <MatchBadge score={matchScore} level={job.match_level} size="lg" />
            </div>
          )}
        </div>

        {/* Quick Facts Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Location</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {job.location || 'Undisclosed'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Salary Package</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
              {job.salary || 'Negotiable'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Experience</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              {job.experience || 'Flexible'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Posted Date</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {job.postedDate || 'Recent'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleApply}
            disabled={isApplied}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              isApplied
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{isApplied ? 'Application Submitted' : 'Apply Now'}</span>
          </button>

          <button
            onClick={handleSaveToggle}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
              isSaved
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
            <span>{isSaved ? 'Saved to List' : 'Save Job'}</span>
          </button>

          <Link
            to={`/cover-letter?jobId=${job.id || job.job_id}`}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-purple-600" />
            <span>Generate Cover Letter</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: AI Match Breakdown & Fake Job Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Semantic AI Match Analysis */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Match Analysis (MiniLM)</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Sentence Transformers calculated a cosine similarity score of{' '}
            <strong className="text-slate-900">{job.similarity || (matchScore ? (matchScore / 100).toFixed(2) : '0.00')}</strong>{' '}
            between your candidate profile and this listing.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-xs font-bold text-emerald-800 block mb-1.5 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Matched Competencies ({matchedSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100"
                    >
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No direct skill matches detected</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1.5">
                Missing / Desired Skills ({missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.length > 0 ? (
                  missingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">All listed skills matched!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Prototype Fake Job Risk Analysis */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Prototype Fake Job Risk Analysis</span>
            </div>
            <RiskBadge risk={risk} />
          </div>

          <p className="text-xs text-slate-500">
            Rule-based heuristic analysis evaluates transparency, payment safety, and recruiter patterns.
          </p>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Calculated Risk Index:</span>
              <span className={risk?.risk_score >= 60 ? 'text-rose-600' : 'text-emerald-700'}>
                {risk?.risk_score || 5} / 100 ({risk?.risk_level || 'Low'})
              </span>
            </div>

            {risk?.reasons && risk.reasons.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-rose-700 block">Flagged Signals:</span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {risk.reasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No scam or high-risk heuristic triggers identified in this listing.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Job Description & Requirements */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Job Description &amp; Responsibilities</h2>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Required Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(job.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
