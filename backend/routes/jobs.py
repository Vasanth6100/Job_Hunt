from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import json
import os
from models.schemas import JobWithRisk, JobRiskAssessment
from services.fake_job_detector import assess_job_risk

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "jobs.json")

def load_jobs() -> List[dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", response_model=List[JobWithRisk])
def get_jobs(
    search: Optional[str] = Query(None, description="Keyword search in title, company, or skills"),
    location: Optional[str] = Query(None, description="Filter by location keyword (e.g. Remote, Bengaluru)"),
    job_type: Optional[str] = Query(None, description="Filter by job type (e.g. Full-time, Remote)"),
    experience: Optional[str] = Query(None, description="Filter by experience"),
    sort_by: Optional[str] = Query("newest", description="Sort by newest or salary")
):
    jobs = load_jobs()
    results = []

    for j in jobs:
        # Search filter
        if search:
            q = search.lower()
            in_title = q in j["title"].lower()
            in_company = q in j["company"].lower()
            in_skills = any(q in s.lower() for s in j.get("skills", []))
            in_desc = q in j.get("description", "").lower()
            if not (in_title or in_company or in_skills or in_desc):
                continue

        # Location filter
        if location and location.lower() != "all":
            if location.lower() not in j.get("location", "").lower():
                continue

        # Job type filter
        if job_type and job_type.lower() != "all":
            if job_type.lower() not in j.get("jobType", "").lower():
                continue

        # Experience filter
        if experience and experience.lower() != "all":
            if experience.lower() not in j.get("experience", "").lower():
                continue

        # Attach risk assessment
        risk_data = assess_job_risk(j)
        j_with_risk = dict(j)
        j_with_risk["risk"] = risk_data
        results.append(j_with_risk)

    # Sorting
    if sort_by == "newest":
        results.sort(key=lambda x: x.get("postedDate", ""), reverse=True)

    return results

@router.get("/{job_id}", response_model=JobWithRisk)
def get_job_by_id(job_id: int):
    jobs = load_jobs()
    for j in jobs:
        if j["id"] == job_id:
            risk_data = assess_job_risk(j)
            j_with_risk = dict(j)
            j_with_risk["risk"] = risk_data
            return j_with_risk
    raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found")
