"""
Create a test company user for testing
"""
from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

db = SessionLocal()

# Check if user exists
existing_user = db.query(User).filter(User.username == "testcompany").first()

if existing_user:
    print(f"User 'testcompany' already exists (ID: {existing_user.id}, Role: {existing_user.role})")
    # Update to company role if needed
    if existing_user.role != "company":
        existing_user.role = "company"
        db.commit()
        print("Updated role to 'company'")
else:
    # Create new company user
    new_user = User(
        username="testcompany",
        phone_number="9999999999",
        email="testcompany@example.com",
        hashed_password=get_password_hash("company123"),
        is_google_user=False,
        role="company"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print(f"Created new company user:")
    print(f"  Username: testcompany")
    print(f"  Password: company123")
    print(f"  Role: company")
    print(f"  ID: {new_user.id}")

db.close()
