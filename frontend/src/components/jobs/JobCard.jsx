import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, Bookmark, Check, ArrowRight } from 'lucide-react';
import MatchBadge from '../common/MatchBadge';
import RiskBadge from '../common/RiskBadge';
import storage from '../../services/storage';

export default function JobCard({ job, onSaveToggle, onApply, isSaved, isApplied }) {
  const matchScore = job.match_score;
  const matchedSkills = job.matched_skills || [];
  const missingSkills = job.missing_skills || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Title, Company, Match Score & Risk */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <Link
              to={`/jobs/${job.id || job.job_id}`}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition block truncate"
            >
              {job.title}
            </Link>
            <div className="text-sm font-medium text-slate-600 mt-0.5">{job.company || 'Confidential'}</div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {matchScore !== undefined && matchScore !== null && (
              <MatchBadge score={matchScore} level={job.match_level} />
            )}
            <RiskBadge risk={job.risk} />
          </div>
        </div>

        {/* Metadata Badges: Location, Salary, Experience, Type */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location || 'Undisclosed'}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-700">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.salary || 'Competitive'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.experience || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.jobType || 'Full-time'}</span>
          </div>
        </div>

        {/* Brief Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Semantic Skills Breakdown (Matched vs Missing) */}
        {(matchedSkills.length > 0 || missingSkills.length > 0) && (
          <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs space-y-2 border border-slate-100">
            {matchedSkills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-emerald-700 mr-1 text-[11px]">Matched:</span>
                {matchedSkills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 font-medium text-[11px]"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    {skill}
                  </span>
                ))}
                {matchedSkills.length > 4 && (
                  <span className="text-[10px] text-slate-400">+{matchedSkills.length - 4} more</span>
                )}
              </div>
            )}

            {missingSkills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-500 mr-1 text-[11px]">Missing:</span>
                {missingSkills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-600 text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
                {missingSkills.length > 3 && (
                  <span className="text-[10px] text-slate-400">+{missingSkills.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Required Skills tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(job.skills || []).slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-100"
            >
              {skill}
            </span>
          ))}
          {(job.skills || []).length > 5 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-400 self-center">
              +{(job.skills || []).length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onSaveToggle(job)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            isSaved
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600' : ''}`} />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job.id || job.job_id}`}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
          >
            Details
          </Link>

          <button
            onClick={() => onApply(job)}
            disabled={isApplied}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
              isApplied
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
            }`}
          >
            <span>{isApplied ? 'Applied' : 'Apply'}</span>
            {!isApplied && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
