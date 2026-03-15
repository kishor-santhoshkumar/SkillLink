"""
View application logs to debug webhook triggers
"""
from app.database import SessionLocal
from app.models import ApplicationLog, Resume, JobRequest
from sqlalchemy import desc

def view_logs():
    db = SessionLocal()
    
    print("=" * 80)
    print("APPLICATION LOGS - EMAIL WEBHOOK TRIGGERS")
    print("=" * 80)
    
    # Get last 20 logs
    logs = db.query(ApplicationLog).order_by(desc(ApplicationLog.created_at)).limit(20).all()
    
    if not logs:
        print("\nNo logs found yet.")
        print("Logs will appear after a worker applies to a job.")
        db.close()
        return
    
    print(f"\nShowing last {len(logs)} webhook triggers:\n")
    
    for log in logs:
        print("-" * 80)
        print(f"Log ID: {log.id}")
        print(f"Created: {log.created_at}")
        
        # Determine webhook type
        is_acceptance = log.email_trigger_status and log.email_trigger_status.startswith("ACCEPTANCE:")
        webhook_type = "🎉 JOB ACCEPTANCE" if is_acceptance else "📝 WORKER APPLICATION"
        print(f"Type: {webhook_type}")
        
        # Get worker info
        if log.worker_id:
            worker = db.query(Resume).filter(Resume.id == log.worker_id).first()
            if worker:
                print(f"Worker: {worker.full_name} ({worker.primary_trade})")
        
        # Get job info
        if log.job_id:
            job = db.query(JobRequest).filter(JobRequest.id == log.job_id).first()
            if job:
                print(f"Job: {job.required_trade} at {job.location}")
        
        print(f"Application ID: {log.application_id}")
        print(f"\n📧 Email Status: {log.email_trigger_status}")
        
        if log.webhook_response_code:
            status_icon = "✅" if log.webhook_response_code == 200 else "⚠️"
            print(f"{status_icon} Response Code: {log.webhook_response_code}")
        
        if log.webhook_response_body:
            print(f"Response: {log.webhook_response_body[:200]}")
        
        if log.error_message:
            print(f"❌ Error: {log.error_message}")
    
    print("\n" + "=" * 80)
    
    # Summary with breakdown
    success_count = sum(1 for log in logs if log.webhook_response_code == 200)
    failed_count = len(logs) - success_count
    
    # Count by type
    application_logs = [log for log in logs if not (log.email_trigger_status and log.email_trigger_status.startswith("ACCEPTANCE:"))]
    acceptance_logs = [log for log in logs if log.email_trigger_status and log.email_trigger_status.startswith("ACCEPTANCE:")]
    
    print(f"\nSUMMARY:")
    print(f"✅ Successful: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"\nBy Type:")
    print(f"📝 Worker Applications: {len(application_logs)}")
    print(f"🎉 Job Acceptances: {len(acceptance_logs)}")
    print("=" * 80)
    
    db.close()

if __name__ == "__main__":
    view_logs()
