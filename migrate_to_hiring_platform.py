"""
Migration script to upgrade SkillLink to a Hiring Platform.
Adds new tables and columns for reviews, jobs, and photos.
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
    
    print("Upgrading SkillLink to Hiring Platform...")
    print("=" * 60)
    
    # Add new columns to resumes table
    print("\n1. Adding new columns to resumes table...")
    cursor.execute("""
        ALTER TABLE resumes 
        ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(500),
        ADD COLUMN IF NOT EXISTS average_rating FLOAT DEFAULT 0.0;
    """)
    print("✓ Added: profile_photo, average_rating")
    
    # Create reviews table
    print("\n2. Creating reviews table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            worker_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
            client_name VARCHAR(255) NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_reviews_worker_id ON reviews(worker_id);
    """)
    print("✓ Created reviews table with foreign key to resumes")
    print("✓ Added index on worker_id")
    print("✓ Added rating constraint (1-5)")
    
    # Create job_requests table
    print("\n3. Creating job_requests table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS job_requests (
            id SERIAL PRIMARY KEY,
            client_name VARCHAR(255) NOT NULL,
            phone_number VARCHAR(50) NOT NULL,
            location VARCHAR(255) NOT NULL,
            required_trade VARCHAR(100) NOT NULL,
            job_description TEXT NOT NULL,
            budget VARCHAR(100),
            status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'completed')),
            assigned_worker_id INTEGER REFERENCES resumes(id) ON DELETE SET NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE
        );
    """)
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_job_requests_status ON job_requests(status);
    """)
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_job_requests_trade ON job_requests(required_trade);
    """)
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_job_requests_assigned_worker ON job_requests(assigned_worker_id);
    """)
    print("✓ Created job_requests table")
    print("✓ Added foreign key to resumes (assigned_worker_id)")
    print("✓ Added indexes on status, trade, and assigned_worker_id")
    print("✓ Added status constraint (open/assigned/completed)")
    
    conn.commit()
    
    # Verify the changes
    print("\n4. Verifying database structure...")
    
    # Check resumes table
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'resumes'
        ORDER BY ordinal_position;
    """)
    print("\nResumes table columns:")
    print("-" * 60)
    for row in cursor.fetchall():
        print(f"  {row[0]:<30} {row[1]}")
    
    # Check reviews table
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'reviews'
        ORDER BY ordinal_position;
    """)
    print("\nReviews table columns:")
    print("-" * 60)
    for row in cursor.fetchall():
        print(f"  {row[0]:<30} {row[1]}")
    
    # Check job_requests table
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'job_requests'
        ORDER BY ordinal_position;
    """)
    print("\nJob Requests table columns:")
    print("-" * 60)
    for row in cursor.fetchall():
        print(f"  {row[0]:<30} {row[1]}")
    
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 60)
    print("✓ Migration completed successfully!")
    print("\nSkillLink is now a Skilled Worker Hiring Platform!")
    print("\nNew Features:")
    print("  ✓ Worker profile photos")
    print("  ✓ Rating & review system")
    print("  ✓ Job request posting")
    print("  ✓ Worker-job matching")
    print("=" * 60)
    
except Exception as e:
    print(f"✗ Error: {e}")
    if conn:
        conn.rollback()
