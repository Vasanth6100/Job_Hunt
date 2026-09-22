import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileCheck,
  FileText,
  Mail,
  BarChart3,
  Sliders,
  Info,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Find Jobs', icon: Briefcase },
  { to: '/resume-analysis', label: 'Resume Analysis', icon: FileText },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { to: '/applications', label: 'Applications', icon: FileCheck },
  { to: '/cover-letter', label: 'Cover Letter', icon: Mail },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/preferences', label: 'Preferences', icon: Sliders },
  { to: '/about', label: 'About Project', icon: Info },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Engine
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Model & Research Status Badge */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs mb-1">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>all-MiniLM-L6-v2</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Local SentenceTransformer embeddings + Cosine Similarity ranking
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-medium border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real AI Engine Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
