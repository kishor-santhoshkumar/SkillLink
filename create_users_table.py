"""
Migration script to create users table and add user_id to resumes
Run this to add authentication to existing SkillLink database
"""

from sqlalchemy import create_engine, text
from app.database import DATABASE_URL
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # Create users table
            logger.info("Creating users table...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(100) UNIQUE NOT NULL,
                    phone_number VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(255),
                    hashed_password VARCHAR(255),
                    is_google_user BOOLEAN DEFAULT FALSE,
                    google_id VARCHAR(255) UNIQUE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE
                );
            """))
            
            # Create indexes
            logger.info("Creating indexes...")
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
                CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
                CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
            """))
            
            # Add user_id column to resumes table if it doesn't exist
            logger.info("Adding user_id to resumes table...")
            conn.execute(text("""
                ALTER TABLE resumes 
                ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
            """))
            
            # Create index on user_id
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
            """))
            
            conn.commit()
            logger.info("✅ Migration completed successfully!")
            logger.info("Users table created and resumes table updated")
            
        except Exception as e:
            logger.error(f"❌ Migration failed: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    migrate()
