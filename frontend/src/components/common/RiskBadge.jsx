import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function RiskBadge({ risk, showDetails = false }) {
  if (!risk) return null;

  const level = risk.risk_level || 'Low';
  const score = risk.risk_score || 0;

  if (level === 'High') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
        <span>⚠ High Risk ({score}%)</span>
      </div>
    );
  }

  if (level === 'Moderate') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>⚠ Potential Risk ({score}%)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      <span>✓ Low Risk</span>
    </div>
  );
}
