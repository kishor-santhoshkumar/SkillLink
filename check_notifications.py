"""
Check notifications in database
"""
from app.database import SessionLocal
from app.models import Notification, JobRequest, JobApplication, Resume

def check_notifications():
    db = SessionLocal()
    
    print("=" * 80)
    print("NOTIFICATION DEBUG")
    print("=" * 80)
    
    # Get all notifications
    notifications = db.query(Notification).order_by(Notification.created_at.desc()).limit(10).all()
    
    print(f"\nLast 10 notifications:")
    print("-" * 80)
    
    for notif in notifications:
        print(f"\nID: {notif.id}")
        print(f"User ID: {notif.user_id}")
        print(f"Title: {notif.title}")
        print(f"Message: {notif.message}")
        print(f"Type: {notif.type}")
        print(f"Related ID: {notif.related_id}")
        print(f"Is Read: {notif.is_read}")
        print(f"Created: {notif.created_at}")
        
        # If it's a job application notification, show the actual job details
        if notif.type == "job_application" and notif.related_id:
            application = db.query(JobApplication).filter(JobApplication.id == notif.related_id).first()
            if application:
                job = db.query(JobRequest).filter(JobRequest.id == application.job_id).first()
                worker = db.query(Resume).filter(Resume.id == application.worker_id).first()
                if job:
                    print(f"  → Actual Job Trade: {job.required_trade}")
                    print(f"  → Job Location: {job.location}")
                if worker:
                    print(f"  → Worker Name: {worker.full_name}")
                    print(f"  → Worker Trade: {worker.primary_trade}")
        
        print("-" * 80)
    
    db.close()
    
    print("\n" + "=" * 80)
    print("If notification shows wrong trade:")
    print("1. It might be an old notification from before the fix")
    print("2. Try applying to a NEW job to test")
    print("3. Or delete old notifications with: python clear_old_notifications.py")
    print("=" * 80)

if __name__ == "__main__":
    check_notifications()
