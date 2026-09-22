import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
            JH
          </div>
          <span className="font-semibold text-slate-700">JobHunt Agent</span>
          <span>•</span>
          <span>AI-Powered Job Discovery & Risk Analysis</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/about" className="hover:text-indigo-600 transition">
            About Project
          </Link>
          <span className="text-slate-400">Model: all-MiniLM-L6-v2</span>
        </div>
      </div>
    </footer>
  );
}
