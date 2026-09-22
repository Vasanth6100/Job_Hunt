import React from 'react';
import { Info, AlertCircle, CheckCircle2, Cpu, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">About JobHunt Agent</h1>
            <p className="text-xs text-slate-500">
              Academic Research Paper: "JobHunt Agent – An Intelligent Agentic AI for Automated Job Discovery and Filtering"
            </p>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-base border-b border-slate-100 pb-3">
          <AlertCircle className="w-5 h-5" />
          <h2>The Problem in Modern Job Search Platforms</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Contemporary recruitment platforms often create friction for candidates due to algorithmic limitations and unregulated posting practices:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
            <span className="font-bold text-xs text-rose-900 block mb-1">
              1. Keyword-Biased Recommendations
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traditional platforms rely on exact string keyword counts, penalizing candidates with equivalent skills described using alternative terminology.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
            <span className="font-bold text-xs text-rose-900 block mb-1">
              2. Scattered Opportunities
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Job seekers spend disproportionate hours manually checking fragmented portals without unified semantic filtering.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
            <span className="font-bold text-xs text-rose-900 block mb-1">
              3. Duplicate Listings
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              The same vacancy is frequently syndicated across aggregators with conflicting compensation or requirements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
            <span className="font-bold text-xs text-rose-900 block mb-1">
              4. Fraudulent &amp; Scam Listings
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Phishing operators post deceptive high-paying jobs demanding registration fees, Telegram interviews, or financial instrument transfers.
            </p>
          </div>
        </div>
      </div>

      {/* Proposed Solution */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-base border-b border-slate-100 pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h2>The Proposed Solution: JobHunt Agent</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          JobHunt Agent proposes an intelligent agentic architecture that embeds resume and job descriptions into a continuous vector space using <strong>all-MiniLM-L6-v2</strong>. By computing <strong>cosine similarity</strong> directly against 384-dimensional dense representations, semantic alignment is discovered independently of keyword syntax. Additionally, a dedicated heuristic layer intercepts and flags fraudulent job listings before they reach applicants.
        </p>

        {/* Tech Stack Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Active 50% MVP Stack */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-900">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Active Technologies (50% Real MVP)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-2">
              <li><strong>Frontend:</strong> React.js, Vite, Tailwind CSS, React Router, Lucide React</li>
              <li><strong>Backend:</strong> Python, FastAPI, Uvicorn, Pydantic</li>
              <li><strong>AI &amp; Embeddings:</strong> sentence-transformers (all-MiniLM-L6-v2)</li>
              <li><strong>Distance Metric:</strong> scikit-learn cosine_similarity</li>
              <li><strong>Data Storage:</strong> In-memory embedding cache + JSON records + localStorage</li>
              <li><strong>Fake Job Detection:</strong> Rule-based heuristic verification service</li>
            </ul>
          </div>

          {/* Phase 2 Stack */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Future Technologies (Phase 2 Roadmap)</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li><strong>Database:</strong> MongoDB Atlas cloud cluster</li>
              <li><strong>Automated Ingestion:</strong> LinkedIn &amp; Indeed background scrapers</li>
              <li><strong>Notifications:</strong> Real-time Telegram alerting bot</li>
              <li><strong>Browser Extension:</strong> Chrome Extension for 1-click matching</li>
              <li><strong>Adaptive Learning:</strong> Reinforcement learning from candidate click-throughs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
