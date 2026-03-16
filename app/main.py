from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from dotenv import load_dotenv
from app.database import engine, Base
from app import models  # Import models to register them with Base
from app.routers import resume, review, job, auth, company, worker, notification, verification
from app.middleware import LoggingMiddleware

# Load environment variables from .env file
load_dotenv()

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create FastAPI instance
app = FastAPI(
    title="SkillLink API - Skilled Worker Hiring Platform",
    description="AI-powered platform for skilled worker profiles, ratings, and job matching",
    version="3.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skilllink-team.vercel.app"
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

# Create database tables on startup
Base.metadata.create_all(bind=engine)

# Mount static files for photo uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/resumes", tags=["Worker Profiles"])
app.include_router(review.router, prefix="/resumes", tags=["Reviews & Ratings"])
app.include_router(job.router, prefix="/jobs", tags=["Job Requests"])
app.include_router(company.router, prefix="/companies", tags=["Company Profiles"])
app.include_router(worker.router, prefix="/workers", tags=["Worker Search"])
app.include_router(notification.router, prefix="/notifications", tags=["Notifications"])
app.include_router(verification.router, tags=["Verification Badges"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to SkillLink API v3.0 - Skilled Worker Hiring Platform",
        "features": [
            "AI-powered worker profile extraction",
            "Multi-language support (English, Tamil, Hindi)",
            "Profile photo upload",
            "Worker ratings & reviews",
            "Job request posting",
            "Worker-job matching",
            "PDF profile generation",
            "Quality scoring"
        ],
        "endpoints": {
            "profiles": "/resumes",
            "reviews": "/resumes/{id}/reviews",
            "jobs": "/jobs",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "3.0.0",
        "platform": "Skilled Worker Hiring Platform"
    }
