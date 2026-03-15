"""
Check photo paths stored in database
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Resume
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print("📸 Checking profile photo paths in database...\n")

# Get all resumes with photos
resumes = db.query(Resume).filter(Resume.profile_photo.isnot(None)).all()

print(f"Found {len(resumes)} resumes with photos:\n")

for resume in resumes:
    print(f"Resume ID: {resume.id}")
    print(f"  Name: {resume.full_name}")
    print(f"  Photo Path: {resume.profile_photo}")
    print(f"  Photo Path Type: {type(resume.profile_photo)}")
    print(f"  Photo Path Length: {len(resume.profile_photo) if resume.profile_photo else 0}")
    
    # Check if file exists
    import os
    if resume.profile_photo:
        exists = os.path.exists(resume.profile_photo)
        print(f"  File Exists: {exists}")
        
        # Try normalized path
        normalized = resume.profile_photo.replace('\\', '/')
        print(f"  Normalized: {normalized}")
    print()

db.close()
