import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  X
} from 'lucide-react';
import api from '../services/api';
import storage from '../services/storage';
import JobCard from '../components/jobs/JobCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ApplyModal from '../components/jobs/ApplyModal';

export default function FindJobsPage() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sortBy, setSortBy] = useState('match_score');
  const [riskFilter, setRiskFilter] = useState('All'); // All, Low, Potential
  const [savedJobIds, setSavedJobIds] = useState(() => storage.getSavedJobs().map((j) => j.id || j.job_id));
  const [appliedJobIds, setAppliedJobIds] = useState(() => storage.getApplications().map((a) => a.jobId || a.id));
  const [applyingJob, setApplyingJob] = useState(null); // job being applied to (modal open)
  const [activeResumeText, setActiveResumeText] = useState(() => storage.getActiveResume());
  const [evalTimeMs, setEvalTimeMs] = useState(null);

  const loadJobsData = useCallback(async (resumeText) => {
    setLoading(true);
    try {
      if (resumeText && resumeText.trim().length >= 10) {
        // Run real MiniLM matching
        const res = await api.matchJobs(resumeText, 50, 0);
        setJobs(res.results || []);
        setEvalTimeMs(res.execution_time_ms);
        storage.setLastMatches(res);
      } else {
        // Fetch raw jobs with risk tags
        const res = await api.getJobs();
        setJobs(res);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      // Fallback to basic jobs API if match fails
      try {
        const res = await api.getJobs();
        setJobs(res);
      } catch (e) {
        console.error('Failed fallback fetch:', e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load: fetch jobs with semantic match if resume exists, else regular jobs
    loadJobsData(activeResumeText);
  }, [loadJobsData, activeResumeText]);

  const handleReRank = async () => {
    if (!activeResumeText || activeResumeText.trim().length < 10) {
      alert('Please set or upload a resume in the Resume Analysis page first to re-rank jobs!');
      return;
    }
    setRecomputing(true);
    try {
      const res = await api.matchJobs(activeResumeText, 50, 0);
      setJobs(res.results || []);
      setEvalTimeMs(res.execution_time_ms);
      storage.setLastMatches(res);
    } catch (err) {
      alert('Semantic matching failed: ' + err.message);
    } finally {
      setRecomputing(false);
    }
  };

  const handleSaveToggle = (job) => {
    const id = job.id || job.job_id;
    if (savedJobIds.includes(id)) {
      storage.removeSavedJob(id);
      setSavedJobIds((prev) => prev.filter((item) => item !== id));
    } else {
      storage.saveJob({ ...job, id });
      setSavedJobIds((prev) => [...prev, id]);
    }
  };

  const handleApply = (job) => {
    const id = job.id || job.job_id;
    // Only open modal if not already applied
    if (!appliedJobIds.includes(id)) {
      setApplyingJob(job);
    }
  };

  const handleApplyConfirmed = (jobId) => {
    setAppliedJobIds((prev) => [...prev, jobId]);
  };

  // Filter & Sort Logic
  const filteredJobs = jobs
    .filter((job) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = job.title.toLowerCase().includes(q);
        const inCompany = (job.company || '').toLowerCase().includes(q);
        const inSkills = (job.skills || []).some((s) => s.toLowerCase().includes(q));
        const inDesc = (job.description || '').toLowerCase().includes(q);
        if (!inTitle && !inCompany && !inSkills && !inDesc) return false;
      }

      // Location
      if (selectedLocation !== 'All') {
        if (!(job.location || '').toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      }

      // Job Type
      if (selectedJobType !== 'All') {
        if (!(job.jobType || '').toLowerCase().includes(selectedJobType.toLowerCase())) return false;
      }

      // Experience
      if (selectedExperience !== 'All') {
        if (!(job.experience || '').toLowerCase().includes(selectedExperience.toLowerCase())) return false;
      }

      // Minimum Match Score
      if (job.match_score !== undefined && job.match_score < minMatchScore) {
        return false;
      }

      // Risk Filter
      if (riskFilter === 'Low' && job.risk?.risk_level !== 'Low') return false;
      if (riskFilter === 'Potential' && job.risk?.risk_level === 'Low') return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'match_score') {
        const scoreA = a.match_score !== undefined ? a.match_score : -1;
        const scoreB = b.match_score !== undefined ? b.match_score : -1;
        return scoreB - scoreA;
      }
      if (sortBy === 'newest') {
        return (b.postedDate || '').localeCompare(a.postedDate || '');
      }
      if (sortBy === 'salary') {
        return (b.salary || '').localeCompare(a.salary || '');
      }
      return 0;
    });

  return (
    <>
    <div className="space-y-6">
      {/* Header & Re-Rank Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">Find & Discover Jobs</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {filteredJobs.length} Results
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {evalTimeMs ? (
              <span>
                Ranked via local SentenceTransformers in <strong className="text-indigo-600">{evalTimeMs} ms</strong>
              </span>
            ) : (
              <span>Semantic matching powered by local all-MiniLM-L6-v2 embeddings</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReRank}
            disabled={recomputing}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recomputing ? 'animate-spin' : ''}`} />
            <span>Re-Rank with Active Resume</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, company, technology (e.g. Python, React, Cloud, DevOps)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2 text-xs">
          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Locations</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Type</label>
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Experience</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Exp</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="2-4">2-4 years</option>
              <option value="3-5">3-5 years</option>
              <option value="4-7">4-7 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Risk Status</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk Only (Verified)</option>
              <option value="Potential">Potential Scams Only (Test Cases)</option>
            </select>
          </div>

          {/* Min Match Score Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-600">Min Match</label>
              <span className="text-[11px] font-bold text-indigo-600">{minMatchScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="match_score">AI Match Score (Highest)</option>
              <option value="newest">Newest Posted</option>
              <option value="salary">Salary Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid / List */}
      {loading ? (
        <LoadingSpinner message="Calculating high-dimensional semantic match scores..." />
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const id = job.id || job.job_id;
            return (
              <JobCard
                key={id}
                job={job}
                onSaveToggle={handleSaveToggle}
                onApply={handleApply}
                isSaved={savedJobIds.includes(id)}
                isApplied={appliedJobIds.includes(id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Jobs Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, lowering the minimum match score threshold, or resetting the location filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLocation('All');
              setSelectedJobType('All');
              setMinMatchScore(0);
              setRiskFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>

      {/* Apply Modal */}
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onConfirmed={(jobId) => {
            handleApplyConfirmed(jobId);
            setApplyingJob(null);
          }}
        />
      )}
    </>
  );
}
