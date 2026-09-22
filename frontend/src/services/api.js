import axios from 'axios';

const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:8000/api'
  : '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // accommodate initial MiniLM cold load if applicable
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Health Check
  getHealth: async () => {
    const response = await client.get('/health');
    return response.data;
  },

  // Jobs
  getJobs: async (params = {}) => {
    const response = await client.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await client.get(`/jobs/${id}`);
    return response.data;
  },

  // Semantic Matching using SentenceTransformers all-MiniLM-L6-v2
  matchJobs: async (resumeText, topK = 30, minScore = 0.0) => {
    const response = await client.post('/match-jobs', {
      resume_text: resumeText,
      top_k: topK,
      min_score: minScore,
    });
    return response.data;
  },

  // Resume Analysis
  analyzeResume: async (resumeText) => {
    const response = await client.post('/analyze-resume', {
      resume_text: resumeText,
    });
    return response.data;
  },

  // Resume Document Upload (PDF/DOCX/TXT)
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Heuristic Fake Job Check
  checkFakeJob: async (jobData) => {
    const response = await client.post('/fake-job-check', jobData);
    return response.data;
  },

  // System Stats
  getStats: async () => {
    const response = await client.get('/stats');
    return response.data;
  },
};

export default api;
