const STORAGE_KEYS = {
  USER: 'jobhunt_user',
  SAVED_JOBS: 'jobhunt_saved_jobs',
  APPLICATIONS: 'jobhunt_applications',
  PREFERENCES: 'jobhunt_preferences',
  ACTIVE_RESUME: 'jobhunt_active_resume',
  LAST_MATCHES: 'jobhunt_last_matches',
};

export const storage = {
  // Authentication
  getUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : { email: 'demo@jobhunt.com', name: 'Demo Candidate', role: 'student' };
    } catch (e) {
      return { email: 'demo@jobhunt.com', name: 'Demo Candidate', role: 'student' };
    }
  },

  setUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Saved Jobs
  getSavedJobs: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveJob: (job) => {
    const list = storage.getSavedJobs();
    if (!list.some((item) => item.id === job.id)) {
      list.unshift({ ...job, savedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(list));
    }
    return list;
  },

  removeSavedJob: (jobId) => {
    const list = storage.getSavedJobs().filter((item) => item.id !== jobId);
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(list));
    return list;
  },

  isJobSaved: (jobId) => {
    return storage.getSavedJobs().some((item) => item.id === jobId);
  },

  // Applications
  getApplications: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  applyForJob: (job, notes = '') => {
    const list = storage.getApplications();
    const existingIndex = list.findIndex((a) => a.jobId === job.id);
    const newEntry = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied', // Applied, Under Review, Interview, Rejected, Selected
      notes: notes,
    };

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...newEntry };
    } else {
      list.unshift(newEntry);
    }
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
    return list;
  },

  updateApplicationStatus: (appId, status) => {
    const list = storage.getApplications().map((item) =>
      item.id === appId ? { ...item, status, updatedDate: new Date().toISOString().split('T')[0] } : item
    );
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
    return list;
  },

  removeApplication: (appId) => {
    const list = storage.getApplications().filter((item) => item.id !== appId);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
    return list;
  },

  isJobApplied: (jobId) => {
    return storage.getApplications().some((item) => item.jobId === jobId);
  },

  // User Preferences
  getPreferences: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data
        ? JSON.parse(data)
        : {
            preferredRole: 'Python Developer / AI Engineer',
            preferredLocation: 'Bengaluru, India',
            jobType: 'Full-time',
            minSalary: '₹6 LPA',
            experience: '1-3 years',
            minMatchScore: 50,
            skills: ['Python', 'FastAPI', 'React', 'Git', 'SQL'],
          };
    } catch (e) {
      return {};
    }
  },

  setPreferences: (prefs) => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },

  // Active Resume
  getActiveResume: () => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_RESUME) || '';
  },

  setActiveResume: (text) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_RESUME, text);
  },

  // Last Match Results
  getLastMatches: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_MATCHES);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setLastMatches: (results) => {
    localStorage.setItem(STORAGE_KEYS.LAST_MATCHES, JSON.stringify(results));
  },
};

export default storage;
