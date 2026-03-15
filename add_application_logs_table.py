"""
Create application_logs table for tracking email webhook triggers
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def upgrade():
    """Create application_logs table"""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("Creating application_logs table...")
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS application_logs (
                    id SERIAL PRIMARY KEY,
                    worker_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
                    job_id INTEGER REFERENCES job_requests(id) ON DELETE CASCADE,
                    application_id INTEGER REFERENCES job_applications(id) ON DELETE CASCADE,
                    email_trigger_status VARCHAR(100) NOT NULL,
                    webhook_response_code INTEGER,
                    webhook_response_body TEXT,
                    error_message TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
            print("✓ application_logs table created")
        except Exception as e:
            print(f"Note: {e}")
        
        print("Creating indexes...")
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_application_logs_worker_id 
                ON application_logs(worker_id)
            """))
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_application_logs_job_id 
                ON application_logs(job_id)
            """))
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_application_logs_application_id 
                ON application_logs(application_id)
            """))
            conn.commit()
            print("✓ Indexes created")
        except Exception as e:
            print(f"Note: {e}")
    
    print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    upgrade()
