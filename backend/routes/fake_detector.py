from fastapi import APIRouter
from models.schemas import FakeJobCheckRequest, FakeJobCheckResponse
from services.fake_job_detector import assess_job_risk

router = APIRouter(prefix="/api", tags=["Fake Job Detector"])

@router.post("/fake-job-check", response_model=FakeJobCheckResponse)
def check_fake_job(payload: FakeJobCheckRequest):
    job_dict = {
        "title": payload.job_title,
        "company": payload.company,
        "location": payload.location,
        "salary": payload.salary,
        "description": payload.description,
        "skills": [],
        "experience": ""
    }
    result = assess_job_risk(job_dict)
    return result
