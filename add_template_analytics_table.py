"""
Migration script to add template_analytics table for tracking template usage.
Run this script to create the analytics table in the database.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import engine, Base
from app.models import TemplateAnalytics
from sqlalchemy import inspect

def create_template_analytics_table():
    """Create template_analytics table if it doesn't exist"""
    
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    print("="*60)
    print("Template Analytics Table Migration")
    print("="*60)
    
    if 'template_analytics' in existing_tables:
        print("\n✓ template_analytics table already exists")
        print("  No migration needed")
        return
    
    print("\n Creating template_analytics table...")
    
    try:
        # Create only the template_analytics table
        TemplateAnalytics.__table__.create(engine)
        
        print("✓ template_analytics table created successfully!")
        print("\nTable structure:")
        print("  - id (PRIMARY KEY)")
        print("  - resume_id (FOREIGN KEY -> resumes.id)")
        print("  - template_id (VARCHAR(50), INDEXED)")
        print("  - action_type (VARCHAR(50), INDEXED)")
        print("  - user_agent (TEXT)")
        print("  - session_id (VARCHAR(100))")
        print("  - created_at (TIMESTAMP, INDEXED)")
        
        print("\nAction types:")
        print("  - 'selected' - Template selected by user")
        print("  - 'previewed' - Template preview downloaded")
        print("  - 'downloaded' - Resume PDF downloaded")
        print("  - 'saved' - Template choice saved")
        
        print("\n" + "="*60)
        print("Migration completed successfully!")
        print("="*60)
        
    except Exception as e:
        print(f"\n✗ Error creating table: {e}")
        raise

if __name__ == "__main__":
    create_template_analytics_table()
