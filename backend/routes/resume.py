from fastapi import APIRouter, HTTPException, UploadFile, File
from models.schemas import ResumeAnalysisRequest, ResumeAnalysisResponse
from services.resume_parser import parse_resume_text, extract_text_from_pdf, extract_text_from_docx

router = APIRouter(prefix="/api", tags=["Resume Analysis"])

@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
def analyze_resume_text(payload: ResumeAnalysisRequest):
    text = payload.resume_text.strip()
    if len(text) < 15:
        raise HTTPException(
            status_code=400,
            detail="Resume text is too brief to analyze. Please provide a more detailed resume or skill profile."
        )

    analysis = parse_resume_text(text)
    return analysis

@router.post("/upload-resume")
async def upload_and_analyze_resume(file: UploadFile = File(...)):
    filename = file.filename.lower()
    content = await file.read()

    if filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        extracted_text = extract_text_from_docx(content)
    elif filename.endswith(".txt"):
        extracted_text = content.decode("utf-8", errors="ignore")
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a PDF, DOCX, or TXT file."
        )

    if not extracted_text or len(extracted_text.strip()) < 15:
        raise HTTPException(
            status_code=400,
            detail="Could not extract sufficient text from the uploaded document."
        )

    analysis = parse_resume_text(extracted_text)
    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "analysis": analysis
    }
