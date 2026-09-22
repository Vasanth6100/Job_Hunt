import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  BarChart3,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  Check,
  AlertTriangle,
  Briefcase
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-10 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 pb-4">

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Find the Right Job. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Smarter.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          JobHunt Agent uses semantic AI matching to discover relevant opportunities and help identify potentially fraudulent job listings. Powered by local Sentence Transformers and transparent heuristic risk analysis.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/jobs"
            className="px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            <span>Explore 30+ Indexed Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/resume-analysis"
            className="px-6 py-3 rounded-xl font-semibold text-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Upload or Paste Resume</span>
          </Link>

          <Link
            to="/login"
            className="px-5 py-3 rounded-xl font-semibold text-sm text-indigo-600 hover:bg-indigo-50 border border-indigo-100 transition"
          >
            <span>Login</span>
          </Link>
        </div>

        <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Real MiniLM Embeddings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero External Paid APIs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cosine Similarity Matrix</span>
          </div>
        </div>
      </section>

      {/* System Architecture Flow Diagram */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">System Architecture</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            End-to-End Semantic Discovery Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            As formulated in the IEEE research paper, matching is computed strictly through high-dimensional vector spaces.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-600 mb-2" />
            <div className="font-bold text-xs text-slate-800">Resume</div>
            <div className="text-[10px] text-slate-500 mt-1">PDF / DOCX / Text</div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col items-center justify-center">
            <Cpu className="w-6 h-6 text-blue-600 mb-2" />
            <div className="font-bold text-xs text-slate-800">MiniLM Model</div>
            <div className="text-[10px] text-slate-500 mt-1">all-MiniLM-L6-v2</div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col items-center justify-center">
            <Layers className="w-6 h-6 text-indigo-600 mb-2" />
            <div className="font-bold text-xs text-slate-800">Dense Vectors</div>
            <div className="text-[10px] text-slate-500 mt-1">384-d Embeddings</div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-600 mb-2" />
            <div className="font-bold text-xs text-slate-800">Cosine Similarity</div>
            <div className="text-[10px] text-slate-500 mt-1">Vector Dot Product</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
            <div className="font-bold text-xs text-slate-800">Risk Filtering</div>
            <div className="text-[10px] text-slate-500 mt-1">Heuristic Rules</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col items-center justify-center">
            <Briefcase className="w-6 h-6 text-emerald-600 mb-2" />
            <div className="font-bold text-xs text-slate-800">Ranked Results</div>
            <div className="text-[10px] text-slate-500 mt-1">Match Percentage</div>
          </div>
        </div>
      </section>

      {/* Six Pillars / Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Core Features</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            System Capabilities in 50% Working MVP
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">AI Semantic Job Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real vector similarity calculation using all-MiniLM-L6-v2. No random numbers or keyword-only counts. Ranks jobs strictly by contextual meaning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Resume Intelligence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Parses PDF, DOCX, or text inputs. Extracts candidate technical competencies, education background, and suggests high-fit roles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Fake Job Risk Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rule-based heuristic engine flags suspicious compensation, anonymous hiring entities, urgent Telegram/WhatsApp recruiting scams, and fee demands.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Smart Skill Overlap</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides granular visibility into matched competencies versus missing skills, giving job seekers clear diagnostic feedback on qualification gaps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Application Tracker</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              End-to-end recruitment lifecycle status management (Applied, Under Review, Interview, Selected, Rejected) with persistent local storage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Recruitment Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visualizes average semantic match scores, candidate application funnels, top in-demand skills in the dataset, and geographic distributions.
            </p>
          </div>
        </div>
      </section>

      {/* Honest Scope Disclosure Card */}
      <section className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Academic Integrity & Implementation Scope</span>
        </div>
        <h3 className="text-xl font-bold">50% Real Implementation vs Future Phase 2 Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Real Implemented (Active Now)</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>all-MiniLM-L6-v2 Sentence Transformers running locally</li>
              <li>Calculated Cosine Similarity matrix & ranking</li>
              <li>32 Realistic jobs dataset with RAM embedding cache</li>
              <li>Rule-based fake-job heuristic risk engine</li>
              <li>React + Tailwind frontend with full routing</li>
            </ul>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Future Scope (Phase 2)</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Live LinkedIn & Indeed automated scraping</li>
              <li>MongoDB Atlas distributed cluster integration</li>
              <li>Telegram notification bot & Chrome browser extension</li>
              <li>Reinforcement learning from user feedback</li>
              <li>Production multi-tenant cloud authentication</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
