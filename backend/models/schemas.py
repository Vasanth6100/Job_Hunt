from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Job(BaseModel):
    id: int
    title: str
    company: str
    location: str
    salary: str
    experience: str
    jobType: str
    skills: List[str]
    description: str
    postedDate: str
    department: Optional[str] = "Engineering"

class JobRiskAssessment(BaseModel):
    risk_score: int
    risk_level: str  # "Low", "Moderate", "High"
    reasons: List[str]
    disclaimer: str = "Prototype Fake Job Risk Analysis"

class JobWithRisk(Job):
    risk: JobRiskAssessment

class MatchedJobResult(BaseModel):
    job_id: int
    title: str
    company: str
    location: str
    salary: str
    experience: str
    jobType: str
    skills: List[str]
    description: str
    postedDate: str
    department: Optional[str] = "Engineering"
    match_score: float  # e.g., 87.5
    similarity: float    # e.g., 0.875
    match_level: str    # "High Match", "Medium Match", "Low Match"
    matched_skills: List[str]
    missing_skills: List[str]
    risk: JobRiskAssessment

class MatchJobsRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Full text extracted or pasted from candidate resume")
    top_k: Optional[int] = 30
    min_score: Optional[float] = 0.0

class MatchJobsResponse(BaseModel):
    total_jobs_evaluated: int
    matches_returned: int
    execution_time_ms: float
    model_used: str = "all-MiniLM-L6-v2"
    results: List[MatchedJobResult]

class ResumeAnalysisRequest(BaseModel):
    resume_text: str

class ResumeAnalysisResponse(BaseModel):
    summary: str
    detected_skills: List[str]
    education: List[str]
    experience_years_detected: Optional[str] = "Not specified"
    suggested_roles: List[str]
    word_count: int
    character_count: int
    disclaimer: str = "Prototype Resume Analysis"

class FakeJobCheckRequest(BaseModel):
    job_title: Optional[str] = ""
    company: Optional[str] = ""
    location: Optional[str] = ""
    salary: Optional[str] = ""
    description: str

class FakeJobCheckResponse(BaseModel):
    risk_score: int
    risk_level: str
    reasons: List[str]
    disclaimer: str = "Prototype Fake Job Risk Analysis"

class SystemStats(BaseModel):
    total_jobs: int
    categories: Dict[str, int]
    locations: Dict[str, int]
    risk_breakdown: Dict[str, int]
    top_skills: List[Dict[str, Any]]
    model_status: str
