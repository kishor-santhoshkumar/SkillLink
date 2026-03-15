"""
Test the complete job application flow with n8n webhook
"""
from app.database import SessionLocal
from app.models import User, Resume, JobRequest, JobApplication, ApplicationLog
from sqlalchemy import desc

def test_application_flow():
    db = SessionLocal()
    
    print("=" * 80)
    print("TESTING COMPLETE APPLICATION FLOW")
    print("=" * 80)
    
    # Check if we have test data
    print("\n1. Checking test data...")
    
    # Get a worker
    worker_user = db.query(User).filter(User.role == "worker").first()
    if not worker_user:
        print("❌ No worker users found. Please create a worker account first.")
        db.close()
        return
    
    worker_resume = db.query(Resume).filter(Resume.user_id == worker_user.id).first()
    if not worker_resume:
        print(f"❌ Worker {worker_user.username} has no profile. Please create profile first.")
        db.close()
        return
    
    print(f"✅ Found worker: {worker_resume.full_name} ({worker_resume.primary_trade})")
    
    # Get a company
    company_user = db.query(User).filter(User.role == "company").first()
    if not company_user:
        print("❌ No company users found. Please create a company account first.")
        db.close()
        return
    
    print(f"✅ Found company: {company_user.username} (Email: {company_user.email})")
    
    # Get an open job
    job = db.query(JobRequest).filter(
        JobRequest.company_id == company_user.id,
        JobRequest.status == "open"
    ).first()
    
    if not job:
        print("❌ No open jobs found. Please create a job first.")
        db.close()
        return
    
    print(f"✅ Found open job: {job.required_trade} at {job.location}")
    
    # Check recent applications
    print("\n2. Checking recent applications...")
    recent_apps = db.query(JobApplication).filter(
        JobApplication.job_id == job.id,
        JobApplication.worker_id == worker_resume.id
    ).all()
    
    if recent_apps:
        print(f"⚠️  Worker has already applied to this job ({len(recent_apps)} time(s))")
        print("   To test again, either:")
        print("   - Have the worker apply to a different job")
        print("   - Delete the existing application from database")
    else:
        print("✅ Worker has not applied to this job yet")
        print("\n   TO TEST: Have the worker apply to this job from the frontend")
    
    # Check application logs
    print("\n3. Checking webhook logs...")
    logs = db.query(ApplicationLog).order_by(desc(ApplicationLog.created_at)).limit(5).all()
    
    if not logs:
        print("   No webhook logs yet. Logs will appear after first application.")
    else:
        print(f"   Found {len(logs)} recent webhook trigger(s):")
        for log in logs:
            status_icon = "✅" if log.webhook_response_code == 200 else "❌"
            print(f"   {status_icon} {log.created_at.strftime('%Y-%m-%d %H:%M:%S')} - {log.email_trigger_status}")
    
    print("\n" + "=" * 80)
    print("NEXT STEPS TO TEST EMAIL INTEGRATION")
    print("=" * 80)
    print("\n1. Make sure backend is running: restart_backend.bat")
    print("2. Make sure frontend is running: restart_frontend.bat")
    print("3. Login as worker in browser")
    print("4. Go to Jobs page")
    print("5. Click 'Apply Now' on a job")
    print("6. Check backend console for logs:")
    print("   - Should see: 🚀 n8n webhook triggered")
    print("   - Should see: ✅ n8n webhook SUCCESS - Status: 200")
    print("7. Run: python view_application_logs.py")
    print("   - Should show Response Code: 200")
    print("8. Check company email inbox")
    print("   - Should receive email notification")
    print("\n" + "=" * 80)
    
    db.close()

if __name__ == "__main__":
    test_application_flow()
