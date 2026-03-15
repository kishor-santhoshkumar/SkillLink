"""
Update user email in the database
This updates the User.email field (used for login and webhooks)
"""
from app.database import SessionLocal
from app.models import User

def update_email():
    db = SessionLocal()
    
    print("=" * 80)
    print("UPDATE USER EMAIL")
    print("=" * 80)
    print("\nThis will update the email in the users table.")
    print("This is the email used for:")
    print("  - Login/Authentication")
    print("  - Webhook email notifications")
    print("  - All system communications")
    print("\n" + "=" * 80)
    
    # Show all users
    users = db.query(User).all()
    print(f"\nCurrent users:\n")
    for user in users:
        print(f"{user.id}. {user.username} ({user.role}) - Email: {user.email or 'NOT SET'}")
    
    print("\n" + "-" * 80)
    
    # Get user ID to update
    try:
        user_id = int(input("\nEnter User ID to update: "))
    except ValueError:
        print("Invalid user ID")
        db.close()
        return
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        print(f"User with ID {user_id} not found")
        db.close()
        return
    
    print(f"\nSelected user: {user.username} ({user.role})")
    print(f"Current email: {user.email or 'NOT SET'}")
    
    # Get new email
    new_email = input("\nEnter new email address: ").strip()
    
    if not new_email:
        print("Email cannot be empty")
        db.close()
        return
    
    # Confirm
    print(f"\n⚠️  You are about to update:")
    print(f"   User: {user.username}")
    print(f"   From: {user.email or 'NOT SET'}")
    print(f"   To: {new_email}")
    
    confirm = input("\nConfirm? (yes/no): ").strip().lower()
    
    if confirm != "yes":
        print("Update cancelled")
        db.close()
        return
    
    # Update email
    user.email = new_email
    db.commit()
    
    print(f"\n✅ Email updated successfully!")
    print(f"   User: {user.username}")
    print(f"   New email: {user.email}")
    print(f"\nThis email will now be used for all webhook notifications.")
    
    db.close()

if __name__ == "__main__":
    update_email()
