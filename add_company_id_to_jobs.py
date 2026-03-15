"""
Add company_id column to job_requests table
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def upgrade():
    """Add company_id column to job_requests"""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("Adding company_id column to job_requests table...")
        try:
            conn.execute(text("""
                ALTER TABLE job_requests 
                ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES users(id) ON DELETE CASCADE
            """))
            conn.commit()
            print("✓ company_id column added")
        except Exception as e:
            print(f"Note: {e}")
        
        print("Adding index on company_id...")
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_job_requests_company_id 
                ON job_requests(company_id)
            """))
            conn.commit()
            print("✓ Index created")
        except Exception as e:
            print(f"Note: {e}")
    
    print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    upgrade()
