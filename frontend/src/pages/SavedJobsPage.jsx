import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Trash2,
  ArrowRight,
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  BriefcaseIcon
} from 'lucide-react';
import storage from '../services/storage';
import MatchBadge from '../components/common/MatchBadge';
import RiskBadge from '../components/common/RiskBadge';

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = () => {
    const list = storage.getSavedJobs();
    setSavedJobs(list);
  };

  const handleRemove = (jobId) => {
    const updated = storage.removeSavedJob(jobId);
    setSavedJobs(updated);
  };

  const handleApply = (job) => {
    const id = job.id || job.job_id;
    storage.applyForJob({ ...job, id });
    navigate('/applications');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600 fill-indigo-100" />
            <span>Saved Opportunities ({savedJobs.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Persisted in browser localStorage. Review, apply, or generate cover letters when ready.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          Explore More Jobs
        </Link>
      </div>

      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map((job) => {
            const id = job.id || job.job_id;
            const isApplied = storage.isJobApplied(id);

            return (
              <div
                key={id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/jobs/${id}`}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition truncate"
                    >
                      {job.title}
                    </Link>
                    {job.match_score !== undefined && (
                      <MatchBadge score={job.match_score} level={job.match_level} />
                    )}
                    <RiskBadge risk={job.risk} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{job.company}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.jobType || 'Full-time'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1">{job.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleRemove(id)}
                    title="Remove from Saved"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/jobs/${id}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    Details
                  </Link>

                  <button
                    onClick={() => handleApply(job)}
                    disabled={isApplied}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                      isApplied
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    }`}
                  >
                    <span>{isApplied ? 'Applied' : 'Apply'}</span>
                    {!isApplied && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Saved Jobs Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse discovered opportunities and click "Save" to bookmark positions you wish to apply to later.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm"
          >
            <span>Discover Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
