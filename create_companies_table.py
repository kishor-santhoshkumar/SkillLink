"""
Database migration script to create companies table.
Run this script to add the companies table to the database.

Usage:
    python create_companies_table.py
"""

from app.database import engine
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_companies_table():
    """
    Create companies table in the database.
    """
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        company_type VARCHAR(100),
        location VARCHAR(255),
        contact_person VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE
    );
    
    -- Create index on user_id for faster lookups
    CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
    """
    
    try:
        with engine.connect() as conn:
            # Execute the SQL
            conn.execute(text(create_table_sql))
            conn.commit()
            
            logger.info("✅ Companies table created successfully!")
            logger.info("✅ Index on user_id created successfully!")
            
            # Verify table exists
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'companies'
            """))
            
            if result.fetchone():
                logger.info("✅ Verified: companies table exists in database")
            else:
                logger.error("❌ Error: companies table not found after creation")
                
    except Exception as e:
        logger.error(f"❌ Error creating companies table: {e}")
        raise


if __name__ == "__main__":
    logger.info("Starting companies table creation...")
    create_companies_table()
    logger.info("Migration complete!")
