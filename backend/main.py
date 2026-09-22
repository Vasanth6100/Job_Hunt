import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from ai.matching import matching_engine
from routes.jobs import router as jobs_router
from routes.matching import router as matching_router
from routes.resume import router as resume_router
from routes.fake_detector import router as fake_detector_router
from routes.stats import router as stats_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize MiniLM sentence-transformers model & pre-compute job embeddings
    print("[*] Starting JobHunt Agent Backend...")
    matching_engine.initialize()
    yield
    print("[*] Shutting down JobHunt Agent Backend...")

app = FastAPI(
    title="JobHunt Agent – Intelligent Semantic Job Discovery API",
    description="Backend API for JobHunt Agent academic MVP utilizing all-MiniLM-L6-v2 sentence embeddings, cosine similarity, and heuristic fake-job detection.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React frontend (supports both standalone Vite and unified host)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(jobs_router)
app.include_router(matching_router)
app.include_router(resume_router)
app.include_router(fake_detector_router)
app.include_router(stats_router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "JobHunt Agent Unified Server",
        "model_loaded": matching_engine.is_loaded,
        "model_name": matching_engine.model_name,
        "total_jobs_indexed": len(matching_engine.jobs_data),
        "disclaimer": "Academic Research MVP - Real MiniLM Semantic Matching"
    }

# Mount and serve built React frontend (SPA)
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", tags=["Frontend SPA"])
    async def serve_spa(full_path: str):
        # Do not intercept unmatched /api routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")

        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)

        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
