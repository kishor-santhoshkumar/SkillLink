"""
Check if user kishor has a resume linked
"""
from app.database import SessionLocal
from app.models import User, Resume

db = SessionLocal()

# Find user kishor
user = db.query(User).filter(User.username == "kishor").first()
if user:
    print(f"✓ Found user: {user.username} (ID: {user.id})")
    
    # Find resume linked to this user
    resume = db.query(Resume).filter(Resume.user_id == user.id).first()
    if resume:
        print(f"✓ Found resume: {resume.full_name} (Resume ID: {resume.id})")
        print(f"  Primary trade: {resume.primary_trade}")
        print(f"  Phone: {resume.phone_number}")
    else:
        print(f"✗ No resume found for user {user.id}")
        print("\nAll resumes with user_id:")
        resumes = db.query(Resume).filter(Resume.user_id.isnot(None)).all()
        for r in resumes:
            print(f"  Resume {r.id}: user_id={r.user_id}, name={r.full_name}")
else:
    print("✗ User 'kishor' not found")

db.close()
