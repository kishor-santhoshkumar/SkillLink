"""
Debug script to check job applications in database
"""
from app.database import SessionLocal
from app.models import JobApplication, Resume, User, JobRequest

db = SessionLocal()

print("\n=== ALL USERS ===")
users = db.query(User).all()
for user in users:
    print(f"User ID: {user.id}, Username: {user.username}, Role: {user.role}")

print("\n=== ALL RESUMES ===")
resumes = db.query(Resume).all()
for resume in resumes:
    print(f"Resume ID: {resume.id}, User ID: {resume.user_id}, Name: {resume.full_name}")

print("\n=== ALL JOB APPLICATIONS ===")
applications = db.query(JobApplication).all()
for app in applications:
    print(f"Application ID: {app.id}, Job ID: {app.job_id}, Worker ID (Resume ID): {app.worker_id}, Status: {app.status}")

print("\n=== ALL JOBS ===")
jobs = db.query(JobRequest).all()
for job in jobs:
    print(f"Job ID: {job.id}, Trade: {job.required_trade}, Company: {job.client_name}")

print("\n=== CHECKING RELATIONSHIPS ===")
for app in applications:
    job = db.query(JobRequest).filter(JobRequest.id == app.job_id).first()
    resume = db.query(Resume).filter(Resume.id == app.worker_id).first()
    user = db.query(User).filter(User.id == resume.user_id).first() if resume else None
    
    print(f"\nApplication {app.id}:")
    print(f"  Job: {job.required_trade if job else 'NOT FOUND'}")
    print(f"  Worker Resume ID: {app.worker_id}")
    print(f"  Worker Name: {resume.full_name if resume else 'NOT FOUND'}")
    print(f"  User ID: {resume.user_id if resume else 'NOT FOUND'}")
    print(f"  Username: {user.username if user else 'NOT FOUND'}")

db.close()
