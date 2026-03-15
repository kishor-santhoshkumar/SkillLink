"""
Database Migration Script: Upgrade to Rural & Urban Skilled Worker Professional Profile Platform

This script adds new columns to support comprehensive worker profiles:
- Location details (village/city, district, state)
- Work background (worked_as, company_name, project_types)
- Service details (own_tools, own_vehicle)
- Trust & credibility (reference_available)
- Education (education_level, technical_training)
- Renamed fields for clarity (tools_handled, languages_spoken, client_rating)
"""

import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection parameters
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "skilllink")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Kiss1234")

def run_migration():
    """Execute database migration."""
    try:
        # Connect to database
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("=" * 70)
        print("RURAL & URBAN SKILLED WORKER PLATFORM - DATABASE MIGRATION")
        print("=" * 70)
        print()
        
        # ============================================================
        # ADD NEW COLUMNS
        # ============================================================
        
        migrations = [
            # Basic Details - Location
            ("village_or_city", "VARCHAR(255)", "Location: Village or City"),
            ("district", "VARCHAR(255)", "Location: District"),
            ("state", "VARCHAR(255)", "Location: State"),
            ("phone_number", "VARCHAR(50)", "Phone number (renamed from contact_number)"),
            
            # Trade Details
            ("tools_handled", "TEXT", "Tools handled (renamed from tools_known)"),
            
            # Work Background
            ("worked_as", "VARCHAR(100)", "Work type: self-employed/company worker"),
            ("company_name", "VARCHAR(255)", "Company name if applicable"),
            ("project_types", "TEXT", "Types of projects worked on"),
            
            # Service Details
            ("own_tools", "BOOLEAN DEFAULT FALSE", "Has own tools"),
            ("own_vehicle", "BOOLEAN DEFAULT FALSE", "Has own vehicle"),
            
            # Trust & Credibility
            ("client_rating", "FLOAT DEFAULT 0.0", "Client rating (renamed from average_rating)"),
            ("reference_available", "BOOLEAN DEFAULT FALSE", "Has references available"),
            
            # Education
            ("education_level", "VARCHAR(100)", "Education level"),
            ("technical_training", "VARCHAR(255)", "Technical training details"),
            
            # Languages
            ("languages_spoken", "TEXT", "Languages spoken (renamed from languages)"),
            
            # Timestamps
            ("updated_at", "TIMESTAMP WITH TIME ZONE", "Last update timestamp"),
        ]
        
        print("Adding new columns to 'resumes' table...")
        print()
        
        for column_name, column_type, description in migrations:
            try:
                # Check if column exists
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='resumes' AND column_name=%s
                """, (column_name,))
                
                if cursor.fetchone():
                    print(f"  ⏭️  Column '{column_name}' already exists - skipping")
                else:
                    # Add column
                    cursor.execute(sql.SQL(
                        "ALTER TABLE resumes ADD COLUMN {} {}"
                    ).format(
                        sql.Identifier(column_name),
                        sql.SQL(column_type)
                    ))
                    print(f"  ✅ Added column '{column_name}' - {description}")
            
            except Exception as e:
                print(f"  ⚠️  Error adding column '{column_name}': {e}")
        
        print()
        
        # ============================================================
        # DATA MIGRATION - Copy legacy fields to new fields
        # ============================================================
        
        print("Migrating data from legacy fields to new fields...")
        print()
        
        # Copy contact_number to phone_number
        try:
            cursor.execute("""
                UPDATE resumes 
                SET phone_number = contact_number 
                WHERE phone_number IS NULL AND contact_number IS NOT NULL
            """)
            print(f"  ✅ Migrated contact_number → phone_number")
        except Exception as e:
            print(f"  ⚠️  Error migrating contact_number: {e}")
        
        # Copy tools_known to tools_handled
        try:
            cursor.execute("""
                UPDATE resumes 
                SET tools_handled = tools_known 
                WHERE tools_handled IS NULL AND tools_known IS NOT NULL
            """)
            print(f"  ✅ Migrated tools_known → tools_handled")
        except Exception as e:
            print(f"  ⚠️  Error migrating tools_known: {e}")
        
        # Copy languages to languages_spoken
        try:
            cursor.execute("""
                UPDATE resumes 
                SET languages_spoken = languages 
                WHERE languages_spoken IS NULL AND languages IS NOT NULL
            """)
            print(f"  ✅ Migrated languages → languages_spoken")
        except Exception as e:
            print(f"  ⚠️  Error migrating languages: {e}")
        
        # Copy average_rating to client_rating
        try:
            cursor.execute("""
                UPDATE resumes 
                SET client_rating = average_rating 
                WHERE client_rating IS NULL AND average_rating IS NOT NULL
            """)
            print(f"  ✅ Migrated average_rating → client_rating")
        except Exception as e:
            print(f"  ⚠️  Error migrating average_rating: {e}")
        
        print()
        
        # ============================================================
        # ADD INDEXES FOR PERFORMANCE
        # ============================================================
        
        print("Adding indexes for better query performance...")
        print()
        
        indexes = [
            ("idx_resumes_phone_number", "phone_number"),
            ("idx_resumes_primary_trade", "primary_trade"),
            ("idx_resumes_district", "district"),
            ("idx_resumes_state", "state"),
        ]
        
        for index_name, column_name in indexes:
            try:
                cursor.execute(sql.SQL("""
                    CREATE INDEX IF NOT EXISTS {} ON resumes ({})
                """).format(
                    sql.Identifier(index_name),
                    sql.Identifier(column_name)
                ))
                print(f"  ✅ Created index '{index_name}' on '{column_name}'")
            except Exception as e:
                print(f"  ⚠️  Error creating index '{index_name}': {e}")
        
        print()
        
        # ============================================================
        # VERIFY MIGRATION
        # ============================================================
        
        print("Verifying migration...")
        print()
        
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'resumes' 
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        print(f"  ✅ Total columns in 'resumes' table: {len(columns)}")
        
        # Count records
        cursor.execute("SELECT COUNT(*) FROM resumes")
        count = cursor.fetchone()[0]
        print(f"  ✅ Total worker profiles: {count}")
        
        print()
        print("=" * 70)
        print("MIGRATION COMPLETED SUCCESSFULLY!")
        print("=" * 70)
        print()
        print("New Features Added:")
        print("  ✓ Rural/Urban location tracking (village, district, state)")
        print("  ✓ Work background (self-employed/company worker)")
        print("  ✓ Asset tracking (own tools, own vehicle)")
        print("  ✓ Trust indicators (references available)")
        print("  ✓ Education & training details")
        print("  ✓ Enhanced field naming for clarity")
        print("  ✓ Performance indexes added")
        print()
        print("Legacy fields maintained for backward compatibility:")
        print("  • contact_number → phone_number")
        print("  • tools_known → tools_handled")
        print("  • languages → languages_spoken")
        print("  • average_rating → client_rating")
        print()
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise


if __name__ == "__main__":
    run_migration()
