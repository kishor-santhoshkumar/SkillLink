"""
Debug script to check worker profile status
"""
from app.database import SessionLocal
from app.models import User, Resume

def check_profiles():
    db = SessionLocal()
    
    print("=" * 60)
    print("WORKER PROFILE DEBUG")
    print("=" * 60)
    
    # Get all users
    users = db.query(User).all()
    
    print(f"\nTotal users: {len(users)}")
    print("\n" + "-" * 60)
    
    for user in users:
        print(f"\nUser ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Role: {user.role}")
        print(f"Phone: {user.phone_number}")
        
        # Check for resume
        resume = db.query(Resume).filter(Resume.user_id == user.id).first()
        
        if resume:
            print(f"✓ HAS PROFILE (Resume ID: {resume.id})")
            print(f"  Name: {resume.full_name}")
            print(f"  Trade: {resume.primary_trade}")
        else:
            print(f"✗ NO PROFILE")
        
        print("-" * 60)
    
    # Check resumes without user_id
    orphan_resumes = db.query(Resume).filter(Resume.user_id == None).all()
    if orphan_resumes:
        print(f"\n⚠️  Found {len(orphan_resumes)} resumes without user_id:")
        for resume in orphan_resumes:
            print(f"  - Resume ID {resume.id}: {resume.full_name} ({resume.primary_trade})")
    
    db.close()
    
    print("\n" + "=" * 60)
    print("SOLUTION:")
    print("=" * 60)
    print("If your profile exists but user_id is NULL:")
    print("1. Note your User ID and Resume ID from above")
    print("2. Run: python link_resume_to_user.py <user_id> <resume_id>")
    print("=" * 60)

if __name__ == "__main__":
    check_profiles()
