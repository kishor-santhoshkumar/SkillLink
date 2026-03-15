"""
Migration script to add professional_summary column to resumes table.
Run this once to update the database schema.
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
    
    # Add professional_summary column
    print("Adding professional_summary column to resumes table...")
    cursor.execute("""
        ALTER TABLE resumes 
        ADD COLUMN IF NOT EXISTS professional_summary TEXT;
    """)
    
    conn.commit()
    print("✓ Successfully added professional_summary column!")
    
    # Verify the change
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'resumes';
    """)
    
    print("\nCurrent resumes table structure:")
    for row in cursor.fetchall():
        print(f"  - {row[0]}: {row[1]}")
    
    cursor.close()
    conn.close()
    
    print("\n✓ Migration completed successfully!")
    
except Exception as e:
    print(f"✗ Error: {e}")
