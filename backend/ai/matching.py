import json
import os
import time
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from services.fake_job_detector import assess_job_risk

class SemanticMatchingEngine:
    _instance = None

    def __init__(self):
        self.model = None
        self.model_name = "all-MiniLM-L6-v2"
        self.jobs_data: List[Dict[str, Any]] = []
        self.job_embeddings = None
        self.is_loaded = False
        self.load_error = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = SemanticMatchingEngine()
        return cls._instance

    def initialize(self, jobs_file_path: Optional[str] = None):
        """
        Loads the SentenceTransformer model once and computes in-memory embeddings for all jobs in jobs.json.
        """
        if self.is_loaded:
            return

        print(f"[*] Initializing SemanticMatchingEngine with {self.model_name}...")
        start_time = time.time()
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(self.model_name)

            if jobs_file_path is None:
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                jobs_file_path = os.path.join(base_dir, "data", "jobs.json")

            with open(jobs_file_path, "r", encoding="utf-8") as f:
                self.jobs_data = json.load(f)

            # Pre-compute job corpus text for embedding
            # Concatenating title, company, skills, and description yields rich contextual vectors
            job_texts = []
            for job in self.jobs_data:
                skills_str = ", ".join(job.get("skills", []))
                text = (
                    f"Job Title: {job.get('title', '')}. "
                    f"Company: {job.get('company', '')}. "
                    f"Key Skills: {skills_str}. "
                    f"Description: {job.get('description', '')}"
                )
                job_texts.append(text)

            print(f"[*] Encoding {len(job_texts)} job listings in memory...")
            self.job_embeddings = self.model.encode(job_texts, convert_to_numpy=True, show_progress_bar=False)
            self.is_loaded = True
            elapsed = time.time() - start_time
            print(f"[OK] MiniLM model and {len(self.jobs_data)} job embeddings successfully cached in {elapsed:.2f}s!")
        except Exception as e:
            self.load_error = str(e)
            print(f"[!] Error loading SentenceTransformer model: {e}")

    def compute_skill_overlap(self, resume_text: str, job_skills: List[str]):
        """
        Computes explicit matched and missing skills between candidate resume text and job requirements.
        """
        resume_lower = resume_text.lower()
        matched = []
        missing = []
        for skill in job_skills:
            # Case-insensitive substring match with boundary check
            s_clean = skill.strip().lower()
            if s_clean in resume_lower:
                matched.append(skill)
            else:
                missing.append(skill)
        return matched, missing

    def match_resume_with_jobs(
        self,
        resume_text: str,
        top_k: int = 30,
        min_score: float = 0.0
    ) -> Dict[str, Any]:
        """
        Encodes the user's resume using all-MiniLM-L6-v2, computes cosine similarity against
        all cached job embeddings, and ranks the results.
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError(f"MiniLM model not loaded. Error: {self.load_error}")

        start_time = time.time()

        # 1. Encode user resume into 384-dimensional dense vector
        resume_embedding = self.model.encode([resume_text], convert_to_numpy=True)

        # 2. Compute cosine similarity matrix between resume and all pre-cached jobs
        similarities = cosine_similarity(resume_embedding, self.job_embeddings)[0]

        # 3. Assemble ranked results
        results = []
        for idx, sim in enumerate(similarities):
            job = self.jobs_data[idx]
            sim_float = float(sim)
            # Map cosine similarity to 0-100 percentage
            # Cosine similarity typically ranges from -1 to 1; for text in all-MiniLM, positive similarity maps cleanly
            score = round(max(0.0, sim_float) * 100, 1)

            if score < min_score:
                continue

            # Skill overlap
            matched_skills, missing_skills = self.compute_skill_overlap(resume_text, job.get("skills", []))

            # Match Level badge
            if score >= 70.0:
                match_level = "High Match"
            elif score >= 50.0:
                match_level = "Medium Match"
            else:
                match_level = "Low Match"

            # Risk assessment
            risk = assess_job_risk(job)

            results.append({
                "job_id": job["id"],
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "salary": job["salary"],
                "experience": job["experience"],
                "jobType": job["jobType"],
                "skills": job["skills"],
                "description": job["description"],
                "postedDate": job["postedDate"],
                "department": job.get("department", "Engineering"),
                "match_score": score,
                "similarity": round(sim_float, 4),
                "match_level": match_level,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "risk": risk
            })

        # Sort descending by match_score
        results.sort(key=lambda x: x["match_score"], reverse=True)

        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "total_jobs_evaluated": len(self.jobs_data),
            "matches_returned": min(len(results), top_k),
            "execution_time_ms": elapsed_ms,
            "model_used": self.model_name,
            "results": results[:top_k]
        }

matching_engine = SemanticMatchingEngine.get_instance()
