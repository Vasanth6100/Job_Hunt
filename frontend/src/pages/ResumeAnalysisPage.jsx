import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Layers,
  FileCheck
} from 'lucide-react';
import api from '../services/api';
import storage from '../services/storage';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SAMPLE_RESUMES = {
  python: `Alex Mercer
Software & AI Engineer | Bengaluru, India | demo@jobhunt.com

SUMMARY:
Results-driven Software Engineer with 2+ years of experience specializing in Python, FastAPI, React, and Machine Learning. Proficient in developing high-throughput REST APIs, fine-tuning transformer models, and implementing semantic vector search architectures.

TECHNICAL SKILLS:
- Languages: Python, JavaScript, TypeScript, SQL, Bash
- Backend: FastAPI, Flask, Django, Node.js, RESTful Microservices
- AI & Data: Sentence Transformers, PyTorch, Scikit-learn, Pandas, HuggingFace, NLP
- Databases: PostgreSQL, MongoDB, Redis
- DevOps & Tools: Docker, Git, CI/CD pipelines, Linux

EDUCATION:
B.Tech in Computer Science and Engineering, National Institute of Technology (2020 - 2024)

EXPERIENCE:
Software Engineer | DataCraft Labs (2024 - Present)
- Developed and deployed high-performance microservices using FastAPI and PostgreSQL, serving over 100k daily requests.
- Integrated sentence-transformers (all-MiniLM-L6-v2) for contextual semantic search.
- Maintained 99.9% uptime using Docker and AWS container deployment.`,

  frontend: `Priya Sharma
Frontend React & UI Engineer | Mumbai, India | priya@frontenddev.com

SUMMARY:
Creative Frontend Developer with 3 years of hands-on experience crafting responsive, performant user interfaces using React, TypeScript, and Tailwind CSS. Passionate about state management, component accessibility, and web animations.

TECHNICAL SKILLS:
- Frontend: React, Next.js, Redux, JavaScript, TypeScript, Tailwind CSS, HTML5, CSS3
- Tools & Libraries: Git, Webpack, Vite, Figma, UI/UX, REST APIs
- Testing: Jest, React Testing Library

EDUCATION:
Bachelor of Engineering in Information Technology, Mumbai University (2019 - 2023)

EXPERIENCE:
Frontend Developer | PixelSphere Technologies (2023 - Present)
- Architected reusable design component library in React reducing time-to-market by 40%.
- Improved Core Web Vitals and page load performance across e-commerce portals.`,

  datascience: `Rohan Verma
Data Scientist & ML Researcher | Hyderabad, India | rohan.data@mlresearch.org

SUMMARY:
Data Scientist with 3+ years experience in predictive modeling, statistical inference, NLP, and deep learning. Skilled in converting unstructured enterprise data into high-value automated machine learning products.

TECHNICAL SKILLS:
- Machine Learning & AI: PyTorch, TensorFlow, Scikit-learn, Transformers, NLP, Computer Vision
- Languages & Frameworks: Python, SQL, Pandas, NumPy, FastAPI
- Big Data & Cloud: Apache Spark, AWS, Docker, Git

EDUCATION:
Master of Science in Data Science, Indian Institute of Science (2021 - 2023)
Bachelor of Technology in Computer Science (2017 - 2021)

EXPERIENCE:
Data Scientist | Hyperion Analytics (2023 - Present)
- Engineered end-to-end customer churn and transaction forecasting models using Scikit-learn and XGBoost.
- Published research on multimodal embeddings in NLP.`
};

export default function ResumeAnalysisPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'upload'
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load previously analyzed resume if available
    const savedResume = storage.getActiveResume();
    if (savedResume) {
      setResumeText(savedResume);
      // Run quick analysis on mount if no analysis yet
      handleAnalyzeText(savedResume, false);
    } else {
      setResumeText(SAMPLE_RESUMES.python);
      handleAnalyzeText(SAMPLE_RESUMES.python, false);
    }
  }, []);

  const handleAnalyzeText = async (textToAnalyze = resumeText, saveToStorage = true) => {
    if (!textToAnalyze || textToAnalyze.trim().length < 15) {
      setError('Please provide a complete resume text of at least 15 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await api.analyzeResume(textToAnalyze);
      setAnalysis(result);
      if (saveToStorage) {
        storage.setActiveResume(textToAnalyze);
      }
    } catch (err) {
      setError('Resume analysis failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError('');
    setLoading(true);

    try {
      const result = await api.uploadResume(uploadedFile);
      setResumeText(result.extracted_text);
      setAnalysis(result.analysis);
      storage.setActiveResume(result.extracted_text);
    } catch (err) {
      setError('File upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (key) => {
    const sample = SAMPLE_RESUMES[key];
    setResumeText(sample);
    handleAnalyzeText(sample, true);
  };

  const handleFindJobsWithResume = async () => {
    if (!resumeText || resumeText.trim().length < 10) {
      setError('Please analyze a resume before proceeding to job matching.');
      return;
    }
    setMatchingLoading(true);
    try {
      const matchResult = await api.matchJobs(resumeText, 50);
      storage.setLastMatches(matchResult);
      storage.setActiveResume(resumeText);
      navigate('/jobs');
    } catch (err) {
      setError('Matching error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Resume Semantic Analyzer</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                Prototype Resume Analysis
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Parses technical skills, education degrees, and formats candidate text for all-MiniLM-L6-v2 embeddings.
            </p>
          </div>

          <button
            onClick={handleFindJobsWithResume}
            disabled={matchingLoading || !resumeText}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-200 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{matchingLoading ? 'Encoding & Matching...' : 'Match with 32 Jobs'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Selection: Paste vs Upload */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'paste'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Paste Resume Text
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Upload PDF / DOCX / TXT
            </button>
          </div>

          {/* Quick Preset Buttons for rapid testing */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Test Presets:</span>
            <button
              onClick={() => handleSelectSample('python')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
            >
              Python/AI
            </button>
            <button
              onClick={() => handleSelectSample('frontend')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
            >
              Frontend React
            </button>
            <button
              onClick={() => handleSelectSample('datascience')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium"
            >
              Data Scientist
            </button>
          </div>
        </div>

        {activeTab === 'paste' ? (
          <div className="space-y-3">
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste complete resume text here (Summary, Skills, Education, Experience)..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleAnalyzeText(resumeText, true)}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{loading ? 'Analyzing...' : 'Parse & Extract Entities'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition">
              <Upload className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-800">
                {file ? file.name : 'Choose a PDF, DOCX, or TXT Resume'}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                Extracted text is processed locally by the Python backend parser
              </span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {resumeText && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono max-h-48 overflow-y-auto whitespace-pre-wrap">
                {resumeText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analysis Output Presentation */}
      {loading ? (
        <LoadingSpinner message="Extracting candidate entities & competencies..." />
      ) : analysis ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Extracted Candidate Profile</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {analysis.word_count} words • {analysis.character_count} chars
              </span>
            </div>

            {/* Summary */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
              <span className="font-bold block mb-1">Resume Summary:</span>
              {analysis.summary}
            </div>

            {/* Detected Skills */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Detected Skills ({analysis.detected_skills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-2">
                {(analysis.detected_skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Roles & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Suggested Roles</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.suggested_roles || []).map((role, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>Education &amp; Experience</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Degree:</strong> {analysis.education?.join(', ') || 'Not detected'}</div>
                  <div><strong>Experience:</strong> {analysis.experience_years_detected}</div>
                </div>
              </div>
            </div>

            {/* CTA to Match Jobs */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-400 italic">
                {analysis.disclaimer} • Local NLP dictionary matching
              </p>
              <button
                onClick={handleFindJobsWithResume}
                disabled={matchingLoading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
              >
                <span>Find Matches with this Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
