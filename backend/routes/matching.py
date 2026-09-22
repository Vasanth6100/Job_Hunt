from fastapi import APIRouter, HTTPException
from models.schemas import MatchJobsRequest, MatchJobsResponse
from ai.matching import matching_engine

router = APIRouter(prefix="/api", tags=["Semantic Matching"])

@router.post("/match-jobs", response_model=MatchJobsResponse)
def match_jobs_with_resume(payload: MatchJobsRequest):
    if not payload.resume_text or len(payload.resume_text.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Resume text must contain at least 10 characters to perform semantic matching."
        )

    try:
        results = matching_engine.match_resume_with_jobs(
            resume_text=payload.resume_text,
            top_k=payload.top_k or 30,
            min_score=payload.min_score or 0.0
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Semantic matching engine error: {str(e)}"
        )
