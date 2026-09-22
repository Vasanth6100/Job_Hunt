import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import { Menu, X } from 'lucide-react';
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileCheck,
  FileText,
  Mail,
  BarChart3,
  Sliders,
  Info
} from 'lucide-react';
import storage from '../services/storage';

const MOBILE_NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Find Jobs', icon: Briefcase },
  { to: '/resume-analysis', label: 'Resume Analysis', icon: FileText },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { to: '/applications', label: 'Applications', icon: FileCheck },
  { to: '/cover-letter', label: 'Cover Letter', icon: Mail },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/preferences', label: 'Preferences', icon: Sliders },
  { to: '/about', label: 'About', icon: Info },
];

// Pages that are accessible without login (no sidebar)
const PUBLIC_PATHS = ['/', '/login'];

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = storage.getUser();

  const isPublicPath = PUBLIC_PATHS.includes(location.pathname);
  const isLoggedIn = !!user;

  // If trying to access a protected page without being logged in, redirect to login
  if (!isLoggedIn && !isPublicPath) {
    return <Navigate to="/login" replace />;
  }

  // For public pages (landing + login): full-width layout, no sidebar
  if (isPublicPath) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Minimal navbar for public pages */}
        <Navbar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  // Authenticated layout: sidebar + main content
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Mobile nav drawer button */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          <span>Navigation Menu</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-1 shadow-lg">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
