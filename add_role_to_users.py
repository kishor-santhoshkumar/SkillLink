"""
Add role column to users table
Supports dual-role platform: worker and company
"""

from app.database import engine
from sqlalchemy import text

def add_role_column():
    """Add role column to users table"""
    try:
        with engine.connect() as conn:
            # Add role column with default value 'worker'
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'worker'
            """))
            conn.commit()
            print("✅ Role column added successfully!")
            print("   Default role: 'worker'")
            print("   Allowed values: 'worker', 'company'")
    except Exception as e:
        print(f"❌ Error adding role column: {e}")
        raise

if __name__ == "__main__":
    print("Adding role column to users table...")
    add_role_column()
    print("\n✅ Migration complete!")
    print("\nNext steps:")
    print("1. Restart backend: uvicorn app.main:app --reload")
    print("2. Test registration with role selection")
