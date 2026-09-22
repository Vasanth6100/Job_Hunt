import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, Save, Check, Sparkles, MapPin, IndianRupee, Briefcase } from 'lucide-react';
import storage from '../services/storage';

export default function PreferencesPage() {
  const navigate = useNavigate();
  const [preferredRole, setPreferredRole] = useState('Python Developer / AI Engineer');
  const [preferredLocation, setPreferredLocation] = useState('Bengaluru, India');
  const [jobType, setJobType] = useState('Full-time');
  const [minSalary, setMinSalary] = useState('₹6 LPA');
  const [experience, setExperience] = useState('1-3 years');
  const [skills, setSkills] = useState('Python, FastAPI, React, Git, Docker, Machine Learning');
  const [minMatchScore, setMinMatchScore] = useState(60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const prefs = storage.getPreferences();
    if (prefs) {
      if (prefs.preferredRole) setPreferredRole(prefs.preferredRole);
      if (prefs.preferredLocation) setPreferredLocation(prefs.preferredLocation);
      if (prefs.jobType) setJobType(prefs.jobType);
      if (prefs.minSalary) setMinSalary(prefs.minSalary);
      if (prefs.experience) setExperience(prefs.experience);
      if (prefs.minMatchScore !== undefined) setMinMatchScore(prefs.minMatchScore);
      if (prefs.skills) {
        setSkills(Array.isArray(prefs.skills) ? prefs.skills.join(', ') : prefs.skills);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
    const newPrefs = {
      preferredRole,
      preferredLocation,
      jobType,
      minSalary,
      experience,
      minMatchScore,
      skills: skillsArray,
      updatedAt: new Date().toISOString(),
    };
    storage.setPreferences(newPrefs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">Candidate Job Preferences</h1>
            </div>
            <p className="text-xs text-slate-500">
              Configure search biases, salary expectations, and AI matching thresholds.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Preferences Saved!</span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preferred Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Preferred Target Role
            </label>
            <input
              type="text"
              value={preferredRole}
              onChange={(e) => setPreferredRole(e.target.value)}
              placeholder="e.g. Python Backend Developer"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Preferred Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Preferred Location
            </label>
            <input
              type="text"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              placeholder="e.g. Bengaluru, India or Remote"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Employment Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="0-1 years">Entry Level (0-1 years)</option>
              <option value="1-3 years">Junior to Mid (1-3 years)</option>
              <option value="3-5 years">Mid Level (3-5 years)</option>
              <option value="5-8 years">Senior Level (5-8 years)</option>
              <option value="8+ years">Lead / Principal (8+ years)</option>
            </select>
          </div>

          {/* Minimum Salary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Minimum Salary Threshold
            </label>
            <input
              type="text"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              placeholder="e.g. ₹6 LPA"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Min Match Score */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                AI Minimum Match Cutoff
              </label>
              <span className="text-xs font-bold text-indigo-600">{minMatchScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Jobs with MiniLM cosine score below {minMatchScore}% will be deprioritized.
            </span>
          </div>
        </div>

        {/* Highlighted Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Key Technical Skills (Comma-separated)
          </label>
          <textarea
            rows={2}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Stored locally in localStorage. Will automatically pre-populate your search preferences.
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
