"""
Migration script to add verification badge fields to Resume model.
Ensures all verification fields exist in the database.
"""

from sqlalchemy import Column, Boolean, inspect
from app.database import engine, SessionLocal
from app.models import Resume

def add_verification_fields():
    """Add verification badge fields to Resume table if they don't exist."""
    
    # Get database connection
    db = SessionLocal()
    
    try:
        # Check if table exists
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('resumes')]
        
        # List of verification fields to add
        verification_fields = [
            'is_email_verified',
            'is_phone_verified',
            'is_identity_verified',
            'is_background_checked'
        ]
        
        # Check which fields are missing
        missing_fields = [field for field in verification_fields if field not in columns]
        
        if missing_fields:
            print(f"Adding missing verification fields: {missing_fields}")
            
            # Add missing fields using raw SQL
            from sqlalchemy import text
            
            for field in missing_fields:
                try:
                    sql = f"ALTER TABLE resumes ADD COLUMN {field} BOOLEAN NOT NULL DEFAULT FALSE"
                    db.execute(text(sql))
                    print(f"✓ Added {field}")
                except Exception as e:
                    print(f"✗ Error adding {field}: {e}")
            
            db.commit()
            print("\n✓ All verification fields added successfully!")
        else:
            print("✓ All verification fields already exist")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_verification_fields()
