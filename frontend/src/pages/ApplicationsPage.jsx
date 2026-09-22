import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  Trash2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import storage from '../services/storage';

const STATUS_CONFIG = {
  Applied: { color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  'Under Review': { color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  Interview: { color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  Selected: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  Rejected: { color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const list = storage.getApplications();
    setApplications(list);
  };

  const handleStatusChange = (appId, newStatus) => {
    const updated = storage.updateApplicationStatus(appId, newStatus);
    setApplications(updated);
  };

  const handleRemove = (appId) => {
    const updated = storage.removeApplication(appId);
    setApplications(updated);
  };

  const filteredApps = filterStatus === 'All'
    ? applications
    : applications.filter((a) => a.status === filterStatus);

  // Group counts
  const counts = {
    Total: applications.length,
    Applied: applications.filter((a) => a.status === 'Applied').length,
    'Under Review': applications.filter((a) => a.status === 'Under Review').length,
    Interview: applications.filter((a) => a.status === 'Interview').length,
    Selected: applications.filter((a) => a.status === 'Selected').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Status Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-indigo-600" />
              <span>Application Lifecycle Tracker</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track candidate recruitment progress across multi-stage interview funnels.
            </p>
          </div>

          <Link
            to="/jobs"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
          >
            Apply for More Jobs
          </Link>
        </div>

        {/* Funnel Stage Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs">
          {['All', 'Applied', 'Under Review', 'Interview', 'Selected', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{status}</span>
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {status === 'All' ? counts.Total : counts[status] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => {
            const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG['Applied'];

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition"
                    >
                      {app.title}
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.color}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Applied on {app.appliedDate}
                    </span>
                    {app.updatedDate && (
                      <span className="text-[11px] text-slate-400">
                        (Updated: {app.updatedDate})
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Switcher Dropdown & Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="relative">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <Link
                    to={`/cover-letter?jobId=${app.jobId}`}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
                  >
                    Cover Letter
                  </Link>

                  <button
                    onClick={() => handleRemove(app.id)}
                    title="Delete Application"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Applications Tracked</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you click "Apply" on any job card, it will automatically populate this tracker with its initial status set to "Applied".
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm"
          >
            <span>Explore Jobs to Apply</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
