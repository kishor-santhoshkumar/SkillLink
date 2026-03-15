"""
Migration script to add new fields to resumes table.
Adds: contact_number, email, education, certifications, languages, work_history
"""
import psycopg2

# Database connection details
host = "localhost"
port = "5432"
database = "skilllink"
username = "postgres"
password = "Kiss1234"

try:
    # Connect to PostgreSQL
    conn = psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=username,
        password=password
    )
    
    cursor = conn.cursor()
    
    print("Adding new columns to resumes table...")
    
    # Add new columns
    cursor.execute("""
        ALTER TABLE resumes 
        ADD COLUMN IF NOT EXISTS contact_number VARCHAR(50),
        ADD COLUMN IF NOT EXISTS email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS work_history TEXT,
        ADD COLUMN IF NOT EXISTS education TEXT,
        ADD COLUMN IF NOT EXISTS certifications TEXT,
        ADD COLUMN IF NOT EXISTS languages TEXT;
    """)
    
    conn.commit()
    print("✓ Successfully added new columns!")
    
    # Verify the changes
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'resumes'
        ORDER BY ordinal_position;
    """)
    
    print("\nCurrent resumes table structure:")
    for row in cursor.fetchall():
        print(f"  - {row[0]}: {row[1]}")
    
    cursor.close()
    conn.close()
    
    print("\n✓ Migration completed successfully!")
    
except Exception as e:
    print(f"✗ Error: {e}")
