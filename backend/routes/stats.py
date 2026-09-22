from fastapi import APIRouter
from collections import Counter
import json
import os
from models.schemas import SystemStats
from ai.matching import matching_engine
from services.fake_job_detector import assess_job_risk

router = APIRouter(prefix="/api", tags=["Statistics"])

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "jobs.json")

@router.get("/stats", response_model=SystemStats)
def get_system_stats():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        jobs = json.load(f)

    categories = Counter()
    locations = Counter()
    risk_breakdown = {"Low": 0, "Moderate": 0, "High": 0}
    skill_counter = Counter()

    for j in jobs:
        categories[j.get("department", "Engineering")] += 1
        loc = j.get("location", "Unknown").split("(")[0].strip()
        if not loc:
            loc = "Undisclosed"
        locations[loc] += 1

        risk = assess_job_risk(j)
        risk_breakdown[risk["risk_level"]] = risk_breakdown.get(risk["risk_level"], 0) + 1

        for s in j.get("skills", []):
            skill_counter[s] += 1

    top_skills = [{"skill": s, "count": c} for s, c in skill_counter.most_common(12)]

    model_status = "Loaded & Cached in RAM" if matching_engine.is_loaded else "Pending Initialization"

    return {
        "total_jobs": len(jobs),
        "categories": dict(categories),
        "locations": dict(locations),
        "risk_breakdown": risk_breakdown,
        "top_skills": top_skills,
        "model_status": model_status
    }
