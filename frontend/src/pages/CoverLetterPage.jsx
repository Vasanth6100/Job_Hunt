import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Copy,
  Download,
  RefreshCw,
  Check
} from 'lucide-react';
import api from '../services/api';
import storage from '../services/storage';

export default function CoverLetterPage() {
  const [searchParams] = useSearchParams();
  const targetJobId = searchParams.get('jobId');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(targetJobId ? Number(targetJobId) : '');
  const [candidateName, setCandidateName] = useState(() => storage.getUser()?.name || 'Alex Mercer');
  const [candidateEmail, setCandidateEmail] = useState(() => storage.getUser()?.email || 'demo@jobhunt.com');
  const [candidateEducation, setCandidateEducation] = useState('B.Tech in Computer Science and Engineering');
  const [candidateSkills, setCandidateSkills] = useState('Python, FastAPI, React, Docker, Machine Learning, SQL');
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateLetter = useCallback((targetJob) => {
    if (!targetJob) return;

    setGenerating(true);

    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const matchedWithJob = (targetJob.skills || []).filter((s) =>
      candidateSkills.toLowerCase().includes(s.toLowerCase())
    );

    const relevantSkillsStr = matchedWithJob.length > 0 ? matchedWithJob.join(', ') : candidateSkills;

    // Deterministic template engine
    const text = `To the Hiring Team at ${targetJob.company || 'the Organization'},

Date: ${dateStr}
Application for: ${targetJob.title}

Dear Hiring Manager,

I am writing to enthusiastically express my interest in the ${targetJob.title} position at ${targetJob.company}. Having followed ${targetJob.company}'s work in ${targetJob.location || 'the technology sector'}, I am excited by your dedication to building high-impact software systems. With my academic foundation in ${candidateEducation} and practical background in ${relevantSkillsStr}, I am confident in my ability to immediately contribute to your engineering milestones.

In my recent work, I have focused extensively on architecting reliable backend services and responsive client interfaces. My technical toolset directly aligns with your core requirements:
- Direct hands-on experience in ${targetJob.skills?.slice(0, 3).join(', ') || 'modern software development'}.
- Passion for software maintainability, testing, and continuous deployment workflows.
- Strong problem-solving background in distributed computing and data-driven systems.

Regarding your team's objective: "${targetJob.description?.slice(0, 160)}...", I look forward to applying my competencies in ${relevantSkillsStr} to help solve these core technical challenges efficiently.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my skill set and background match your team's upcoming goals.

Sincerely,

${candidateName}
${candidateEmail}
Candidate Profile | JobHunt Agent Discovery Network`;

    setTimeout(() => {
      setCoverLetter(text);
      setGenerating(false);
    }, 250);
  }, [candidateEducation, candidateEmail, candidateName, candidateSkills]);

  const loadJobs = useCallback(async () => {
    try {
      const data = await api.getJobs();
      setJobs(data);
      if (!selectedJobId && data.length > 0) {
        const initialId = targetJobId ? Number(targetJobId) : data[0].id;
        setSelectedJobId(initialId);
        generateLetter(data.find((j) => j.id === initialId));
      } else if (selectedJobId && data.length > 0) {
        generateLetter(data.find((j) => j.id === selectedJobId));
      }
    } catch (err) {
      console.error('Error fetching jobs for cover letter:', err);
    }
  }, [selectedJobId, targetJobId, generateLetter]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleJobSelectChange = (e) => {
    const id = Number(e.target.value);
    setSelectedJobId(id);
    const target = jobs.find((j) => j.id === id);
    generateLetter(target);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const currentJob = jobs.find((j) => j.id === selectedJobId);
    const companyClean = currentJob?.company ? currentJob.company.replace(/\s+/g, '_') : 'Company';
    element.download = `Cover_Letter_${companyClean}_${candidateName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const currentJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">AI-Assisted Cover Letter Generator</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
                Prototype AI-Assisted Cover Letter
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized deterministic template engine synthesizing candidate background with target job specifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateLetter(currentJob)}
              disabled={generating}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Parameters & Generated Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Generation Parameters
          </h2>

          {/* Job Selection Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Select Target Job Listing
            </label>
            <select
              value={selectedJobId}
              onChange={handleJobSelectChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company}
                </option>
              ))}
            </select>
          </div>

          {/* Candidate Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Candidate Full Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Candidate Email */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Candidate Education */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Education Background
            </label>
            <input
              type="text"
              value={candidateEducation}
              onChange={(e) => setCandidateEducation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Candidate Skills */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Highlighted Skills (Comma-separated)
            </label>
            <textarea
              rows={3}
              value={candidateSkills}
              onChange={(e) => setCandidateSkills(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => generateLetter(currentJob)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
          >
            Update Cover Letter
          </button>
        </div>

        {/* Right Column: Generated Letter Preview */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Cover Letter Document Preview</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {coverLetter}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Prototype Deterministic Generator • No external paid LLM APIs used</span>
            <span>Target: {currentJob?.title} ({currentJob?.company})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
