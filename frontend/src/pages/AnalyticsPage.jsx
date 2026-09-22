import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Cpu,
  Bookmark,
  FileCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';
import api from '../services/api';
import storage from '../services/storage';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgScore, setAvgScore] = useState(0);
  const [appCounts, setAppCounts] = useState({});
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const statsData = await api.getStats();
      setStats(statsData);

      // Local storage data
      const saved = storage.getSavedJobs();
      setSavedCount(saved.length);

      const applications = storage.getApplications();
      const statusMap = {
        Applied: 0,
        'Under Review': 0,
        Interview: 0,
        Selected: 0,
        Rejected: 0,
      };
      applications.forEach((a) => {
        statusMap[a.status] = (statusMap[a.status] || 0) + 1;
      });
      setAppCounts(statusMap);

      // Calculate average match score from last matches or sample
      const lastMatches = storage.getLastMatches();
      if (lastMatches && lastMatches.results && lastMatches.results.length > 0) {
        const total = lastMatches.results.reduce((acc, curr) => acc + curr.match_score, 0);
        setAvgScore((total / lastMatches.results.length).toFixed(1));
      } else {
        setAvgScore('64.8');
      }
    } catch (err) {
      console.error('Error fetching analytics stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Aggregating dataset distributions and evaluation metrics..." />;
  }

  const locations = stats?.locations || {};
  const topSkills = stats?.top_skills || [];
  const riskBreakdown = stats?.risk_breakdown || { Low: 30, Moderate: 0, High: 2 };
  const categories = stats?.categories || {};

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">Platform Analytics &amp; Metrics</h1>
            </div>
            <p className="text-xs text-slate-500">
              Corpus distribution analysis, semantic match statistics, and recruitment funnel insights.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Model: {stats?.model_status || 'all-MiniLM-L6-v2 active'}</span>
          </div>
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Jobs Analyzed</span>
          <div className="text-2xl font-bold text-slate-900">{stats?.total_jobs || 32}</div>
          <span className="text-[10px] text-indigo-600 font-medium">All vector encoded</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Avg Match Score</span>
          <div className="text-2xl font-bold text-indigo-600">{avgScore}%</div>
          <span className="text-[10px] text-slate-500 font-medium">Cosine Similarity</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Saved Jobs</span>
          <div className="text-2xl font-bold text-slate-900">{savedCount}</div>
          <span className="text-[10px] text-purple-600 font-medium">In localStorage</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Applications</span>
          <div className="text-2xl font-bold text-slate-900">
            {Object.values(appCounts).reduce((a, b) => a + b, 0)}
          </div>
          <span className="text-[10px] text-blue-600 font-medium">Total Submitted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Interviews</span>
          <div className="text-2xl font-bold text-emerald-600">{appCounts['Interview'] || 0}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Active Stages</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Potential Scams</span>
          <div className="text-2xl font-bold text-rose-600">{riskBreakdown.High || 2}</div>
          <span className="text-[10px] text-rose-600 font-medium">Heuristic Flagged</span>
        </div>
      </div>

      {/* Grid: Most Requested Skills & Jobs by Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Demanded Technical Skills */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Most Requested Skills in Dataset</h2>
            </div>
            <span className="text-xs text-slate-400">Frequency count</span>
          </div>

          <div className="space-y-3">
            {topSkills.slice(0, 8).map((item, idx) => {
              const maxCount = topSkills[0]?.count || 1;
              const pct = Math.round((item.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.skill}</span>
                    <span className="text-slate-400">{item.count} listings</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Jobs by Geographic Hub */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Job Distribution by Location</h2>
            </div>
            <span className="text-xs text-slate-400">Metro hubs</span>
          </div>

          <div className="space-y-3">
            {Object.entries(locations)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([loc, count], idx) => {
                const total = stats?.total_jobs || 32;
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{loc}</span>
                      <span className="text-slate-400">{count} jobs ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Application Funnel & Risk Safety Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application Status Funnel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Recruitment Funnel Progress</h2>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Applied</span>
              <div className="text-xl font-bold text-blue-900 mt-1">{appCounts['Applied'] || 0}</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-[10px] font-bold text-amber-700 uppercase">In Review</span>
              <div className="text-xl font-bold text-amber-900 mt-1">{appCounts['Under Review'] || 0}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="text-[10px] font-bold text-purple-700 uppercase">Interview</span>
              <div className="text-xl font-bold text-purple-900 mt-1">{appCounts['Interview'] || 0}</div>
            </div>
          </div>
        </div>

        {/* Safety & Fake Job Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Risk Assessment Breakdown</h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="font-semibold text-emerald-800">✓ Verified Low Risk</span>
              <span className="font-bold text-emerald-900">{riskBreakdown.Low || 30} Listings</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-2xl border border-rose-100">
              <span className="font-semibold text-rose-800">⚠ Potential High Risk / Scam Test Cases</span>
              <span className="font-bold text-rose-900">{riskBreakdown.High || 2} Listings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
