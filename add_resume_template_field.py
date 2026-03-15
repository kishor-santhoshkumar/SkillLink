"""
Migration script to add resume_template field to resumes table
Part of Premium Resume System Phase 1
"""
from sqlalchemy import text
from app.database import engine

def add_resume_template_field():
    """Add resume_template column to resumes table"""
    
    print("=" * 60)
    print("Premium Resume System - Phase 1: Database Migration")
    print("=" * 60)
    
    with engine.connect() as conn:
        # Check if column already exists (PostgreSQL)
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_name='resumes' AND column_name='resume_template'
        """))
        
        exists = result.scalar() > 0
        
        if exists:
            print("\n✓ Column 'resume_template' already exists")
        else:
            # Add the column with default value
            print("\nAdding 'resume_template' column...")
            conn.execute(text("""
                ALTER TABLE resumes 
                ADD COLUMN resume_template VARCHAR(50) NOT NULL DEFAULT 'executive'
            """))
            conn.commit()
            print("✓ Added 'resume_template' column to resumes table")
            print("  Default value: 'executive' (Executive Classic template)")
            print("  Options: executive, modern, sidebar, construction, compact")
        
        # Show current resume count
        result = conn.execute(text("SELECT COUNT(*) FROM resumes"))
        count = result.scalar()
        print(f"\n✓ Total resumes in database: {count}")
        
        if count > 0 and not exists:
            print(f"  All {count} existing resumes set to 'executive' template")

if __name__ == "__main__":
    print("\nStarting migration...")
    add_resume_template_field()
    print("\n" + "=" * 60)
    print("Migration complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Restart backend server")
    print("2. Proceed to Phase 2: PDF Template Generators")
    print("=" * 60)
