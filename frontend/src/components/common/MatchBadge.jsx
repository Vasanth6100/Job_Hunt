import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export default function MatchBadge({ score, level, size = 'md' }) {
  if (score === undefined || score === null) return null;

  const numericScore = typeof score === 'number' ? score : parseFloat(score);

  let bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeColor = 'bg-emerald-600';
  let matchLabel = level || (numericScore >= 70 ? 'High Match' : numericScore >= 50 ? 'Medium Match' : 'Low Match');

  if (numericScore < 50) {
    bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
    badgeColor = 'bg-slate-500';
  } else if (numericScore < 70) {
    bgClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    badgeColor = 'bg-indigo-600';
  }

  const isSmall = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${bgClass} ${isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm'}`}>
      <Sparkles className={isSmall ? 'w-3 h-3 text-indigo-500' : 'w-3.5 h-3.5 text-indigo-500'} />
      <span>{numericScore}% MATCH</span>
      <span className="hidden sm:inline-block font-normal text-slate-500 text-xs">({matchLabel})</span>
    </div>
  );
}
