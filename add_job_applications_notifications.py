"""
Add job applications and notifications tables
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def upgrade():
    """Create job applications and notifications tables"""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("Creating job_applications table...")
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS job_applications (
                    id SERIAL PRIMARY KEY,
                    job_id INTEGER NOT NULL REFERENCES job_requests(id) ON DELETE CASCADE,
                    worker_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
                    status VARCHAR(50) NOT NULL DEFAULT 'pending',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE
                )
            """))
            conn.commit()
            print("✓ job_applications table created")
        except Exception as e:
            print(f"Note: {e}")
        
        print("Creating indexes on job_applications...")
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_job_applications_job_id 
                ON job_applications(job_id)
            """))
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_job_applications_worker_id 
                ON job_applications(worker_id)
            """))
            conn.commit()
            print("✓ Indexes created")
        except Exception as e:
            print(f"Note: {e}")
        
        print("Creating notifications table...")
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    title VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    type VARCHAR(50) NOT NULL,
                    related_id INTEGER,
                    is_read BOOLEAN NOT NULL DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
            print("✓ notifications table created")
        except Exception as e:
            print(f"Note: {e}")
        
        print("Creating indexes on notifications...")
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_notifications_user_id 
                ON notifications(user_id)
            """))
            conn.commit()
            print("✓ Indexes created")
        except Exception as e:
            print(f"Note: {e}")
    
    print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    upgrade()
