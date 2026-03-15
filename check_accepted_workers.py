"""
Check accepted applications in database
"""
from app.database import SessionLocal
from app.models import JobApplication, JobRequest, Resume, User

db = SessionLocal()

print("\n=== ACCEPTED APPLICATIONS ===")
accepted_apps = db.query(JobApplication).filter(
    JobApplication.status == "accepted"
).all()

print(f"Total accepted applications: {len(accepted_apps)}")

for app in accepted_apps:
    job = db.query(JobRequest).filter(JobRequest.id == app.job_id).first()
    worker = db.query(Resume).filter(Resume.id == app.worker_id).first()
    company = db.query(User).filter(User.id == job.company_id).first() if job else None
    
    print(f"\nApplication {app.id}:")
    print(f"  Job: {job.required_trade if job else 'NOT FOUND'} (ID: {app.job_id})")
    print(f"  Job Status: {job.status if job else 'N/A'}")
    print(f"  Company: {company.username if company else 'NOT FOUND'} (ID: {job.company_id if job else 'N/A'})")
    print(f"  Worker: {worker.full_name if worker else 'NOT FOUND'} (ID: {app.worker_id})")
    print(f"  Application Status: {app.status}")

db.close()
