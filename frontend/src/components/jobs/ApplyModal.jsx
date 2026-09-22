import React, { useState, useEffect } from 'react';
import {
  X, Briefcase, MapPin, IndianRupee, Send, CheckCircle,
  User, Mail, FileText, ChevronDown
} from 'lucide-react';
import storage from '../../services/storage';

export default function ApplyModal({ job, onClose, onConfirmed }) {
  const user = storage.getUser();
  const resume = storage.getActiveResume();

  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    note: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSubmitting(true);
    setTimeout(() => {
      // Save application to localStorage
      storage.applyForJob({
        ...(job || {}),
        id: job?.id || job?.job_id,
        applicantName: form.name,
        applicantEmail: form.email,
        applicantPhone: form.phone,
        note: form.note,
        appliedAt: new Date().toISOString(),
        status: 'Applied',
      });
      onConfirmed(job?.id || job?.job_id);
      setSubmitting(false);
      setStep(2);
    }, 600);
  };

  const change = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={step === 2 ? onClose : undefined}
      />

      {/* Modal box */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg leading-snug">{job?.title}</h2>
              <p className="text-sm text-slate-500">{job?.company || 'Confidential'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0 mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Job meta pills */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
          {job?.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
          )}
          {job?.salary && (
            <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{job.salary}</span>
          )}
          {job?.jobType && (
            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.jobType}</span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => change('name', e.target.value)}
                    placeholder="Your full name"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => change('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.email ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => change('phone', e.target.value)}
                  placeholder="+91 9XXXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Resume status */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700">Resume</p>
                  {resume ? (
                    <p className="text-[11px] text-emerald-600 truncate">
                      ✓ Resume on file ({Math.round(resume.length / 5)} words approx.)
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-600">
                      No resume on file — add one in Resume Analysis
                    </p>
                  )}
                </div>
              </div>

              {/* Note / Cover */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Note to Recruiter <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => change('note', e.target.value)}
                  placeholder="Briefly introduce yourself or highlight why you're a good fit..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success screen */
            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Application Submitted!</h3>
                <p className="text-sm text-slate-500 max-w-xs">
                  Your application for <span className="font-semibold text-slate-700">{job?.title}</span> at{' '}
                  <span className="font-semibold text-slate-700">{job?.company}</span> has been recorded.
                </p>
              </div>
              <div className="w-full p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-left space-y-1.5">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Name:</span> {form.name}
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Email:</span> {form.email}
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Status:</span>{' '}
                  <span className="text-emerald-600 font-semibold">Applied ✓</span>
                </div>
                <div className="text-xs text-slate-400">
                  Track your application in the <span className="text-indigo-600 font-semibold">Applications</span> page.
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
