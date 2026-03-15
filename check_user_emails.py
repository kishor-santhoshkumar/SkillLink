"""
Check user emails in the database to verify correct email addresses
"""
from app.database import SessionLocal
from app.models import User, Company

def check_emails():
    db = SessionLocal()
    
    print("=" * 80)
    print("USER EMAIL VERIFICATION")
    print("=" * 80)
    
    # Get all users
    users = db.query(User).all()
    
    if not users:
        print("\nNo users found in database.")
        db.close()
        return
    
    print(f"\nFound {len(users)} users:\n")
    
    for user in users:
        print("-" * 80)
        print(f"User ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Role: {user.role}")
        print(f"📧 User Email (Login): {user.email or 'NOT SET'}")
        print(f"Phone: {user.phone_number}")
        
        # If company, check Company table email
        if user.role == "company":
            company = db.query(Company).filter(Company.user_id == user.id).first()
            if company:
                print(f"Company Name: {company.company_name}")
                print(f"📧 Company Email (Profile): {company.email or 'NOT SET'}")
                
                # Check if they match
                if user.email and company.email and user.email != company.email:
                    print(f"⚠️  WARNING: User email and Company email are DIFFERENT!")
                    print(f"   Emails will be sent to User email: {user.email}")
                elif not user.email:
                    print(f"⚠️  WARNING: User has no email set!")
        
        print()
    
    print("=" * 80)
    print("EMAIL USAGE IN WEBHOOKS")
    print("=" * 80)
    print("\nWebhook 1 (Worker Application → Company):")
    print("  Uses: User.email (from users table)")
    print("  Source: The email used during company registration/login")
    print("\nWebhook 2 (Job Acceptance → Worker):")
    print("  Worker email: User.email (from users table)")
    print("  Company email: User.email (from users table)")
    print("  Source: The email used during registration/login")
    print("\n⚠️  Company.email (from companies table) is NOT used for webhooks")
    print("=" * 80)
    
    db.close()

if __name__ == "__main__":
    check_emails()
