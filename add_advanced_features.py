"""
Migration script to add advanced feature columns to resumes table.
Adds: resume_score, ai_confidence_score, detected_language
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
    
    print("Adding advanced feature columns to resumes table...")
    
    # Add new columns
    cursor.execute("""
        ALTER TABLE resumes 
        ADD COLUMN IF NOT EXISTS resume_score INTEGER,
        ADD COLUMN IF NOT EXISTS ai_confidence_score INTEGER,
        ADD COLUMN IF NOT EXISTS detected_language VARCHAR(50);
    """)
    
    conn.commit()
    print("✓ Successfully added advanced feature columns!")
    
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
    print("\nNew Features Added:")
    print("  1. Resume Quality Scoring (0-100)")
    print("  2. AI Confidence Scoring (0-100)")
    print("  3. Language Detection")
    
except Exception as e:
    print(f"✗ Error: {e}")
