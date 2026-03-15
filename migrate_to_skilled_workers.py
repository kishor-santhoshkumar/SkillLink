"""
Migration script to transform database from corporate resumes to skilled worker profiles.
Drops old columns and adds new trade-specific columns.
"""
import psycopg2

# Database connection details
host = "localhost"
port = "5432"
database = "skilllink"
username = "postgres"
password = "Kiss1234"

try:
    conn = psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=username,
        password=password
    )
    
    cursor = conn.cursor()
    
    print("Migrating to Skilled Worker Profile System...")
    print("=" * 60)
    
    # Drop old corporate-focused columns
    print("\n1. Removing corporate-focused columns...")
    cursor.execute("""
        ALTER TABLE resumes 
        DROP COLUMN IF EXISTS email,
        DROP COLUMN IF EXISTS skills,
        DROP COLUMN IF EXISTS experience,
        DROP COLUMN IF EXISTS work_history,
        DROP COLUMN IF EXISTS education,
        DROP COLUMN IF EXISTS certifications;
    """)
    print("✓ Removed: email, skills, experience, work_history, education, certifications")
    
    # Add new skilled worker columns
    print("\n2. Adding skilled worker profile columns...")
    cursor.execute("""
        ALTER TABLE resumes 
        ADD COLUMN IF NOT EXISTS primary_trade VARCHAR(100),
        ADD COLUMN IF NOT EXISTS specializations TEXT,
        ADD COLUMN IF NOT EXISTS years_of_experience VARCHAR(50),
        ADD COLUMN IF NOT EXISTS service_type VARCHAR(100),
        ADD COLUMN IF NOT EXISTS availability VARCHAR(100),
        ADD COLUMN IF NOT EXISTS travel_radius VARCHAR(100),
        ADD COLUMN IF NOT EXISTS projects_completed INTEGER,
        ADD COLUMN IF NOT EXISTS tools_known TEXT,
        ADD COLUMN IF NOT EXISTS expected_wage VARCHAR(100);
    """)
    print("✓ Added: primary_trade, specializations, years_of_experience")
    print("✓ Added: service_type, availability, travel_radius")
    print("✓ Added: projects_completed, tools_known, expected_wage")
    
    conn.commit()
    
    # Verify the changes
    print("\n3. Verifying new table structure...")
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'resumes'
        ORDER BY ordinal_position;
    """)
    
    print("\nCurrent resumes table structure:")
    print("-" * 60)
    for row in cursor.fetchall():
        print(f"  {row[0]:<30} {row[1]}")
    
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 60)
    print("✓ Migration completed successfully!")
    print("\nSkillLink is now a Skilled Worker Profile System!")
    print("Supports: Carpenters, Plumbers, Electricians, Mechanics, etc.")
    
except Exception as e:
    print(f"✗ Error: {e}")
