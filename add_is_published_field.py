"""
Migration script to add is_published field to resumes table
"""
from sqlalchemy import text
from app.database import engine

def add_is_published_field():
    """Add is_published column to resumes table"""
    
    with engine.connect() as conn:
        # Check if column already exists (PostgreSQL)
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_name='resumes' AND column_name='is_published'
        """))
        
        exists = result.scalar() > 0
        
        if exists:
            print("✓ Column 'is_published' already exists")
        else:
            # Add the column
            conn.execute(text("""
                ALTER TABLE resumes 
                ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT FALSE
            """))
            conn.commit()
            print("✓ Added 'is_published' column to resumes table")
            print("  Default value: False (unpublished)")

if __name__ == "__main__":
    print("Adding is_published field to resumes table...")
    add_is_published_field()
    print("\nMigration complete!")
