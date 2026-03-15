"""
Link existing resumes to users based on name/phone matching
"""
from app.database import SessionLocal
from app.models import User, Resume
from sqlalchemy import or_

def link_resumes():
    db = SessionLocal()
    
    print("=" * 60)
    print("LINKING RESUMES TO USERS")
    print("=" * 60)
    
    users = db.query(User).filter(User.role == "worker").all()
    
    for user in users:
        print(f"\nProcessing user: {user.username} (ID: {user.id})")
        
        # Check if user already has a resume
        existing = db.query(Resume).filter(Resume.user_id == user.id).first()
        if existing:
            print(f"  ✓ Already has resume (ID: {existing.id})")
            continue
        
        # Try to find matching resume by name or phone
        resume = db.query(Resume).filter(
            Resume.user_id == None,
            or_(
                Resume.full_name.ilike(f"%{user.username}%"),
                Resume.phone_number == user.phone_number
            )
        ).order_by(Resume.created_at.desc()).first()
        
        if resume:
            resume.user_id = user.id
            db.commit()
            print(f"  ✓ Linked to Resume ID {resume.id} ({resume.full_name})")
        else:
            print(f"  ✗ No matching resume found")
    
    db.close()
    
    print("\n" + "=" * 60)
    print("✅ Linking complete!")
    print("=" * 60)
    print("\nIf you still don't have a profile:")
    print("1. Go to 'Describe Your Work' or 'Easy Form' page")
    print("2. Create a new profile")
    print("3. It will automatically link to your account")
    print("=" * 60)

if __name__ == "__main__":
    link_resumes()
