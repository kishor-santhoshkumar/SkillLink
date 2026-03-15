"""
Test script for Jobs and Notifications system
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_system():
    print("=" * 60)
    print("Testing Jobs & Notifications System")
    print("=" * 60)
    
    # Test 1: Check if tables exist
    print("\n1. Checking database tables...")
    try:
        from app.database import engine
        from sqlalchemy import inspect
        
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        required_tables = ['job_applications', 'notifications', 'job_requests']
        for table in required_tables:
            if table in tables:
                print(f"   ✓ {table} table exists")
            else:
                print(f"   ✗ {table} table missing")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 2: Check API endpoints
    print("\n2. Checking API endpoints...")
    endpoints = [
        "/jobs/",
        "/notifications/",
        "/notifications/unread-count"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            if response.status_code in [200, 401]:  # 401 is expected without auth
                print(f"   ✓ {endpoint} - Available")
            else:
                print(f"   ✗ {endpoint} - Status {response.status_code}")
        except Exception as e:
            print(f"   ✗ {endpoint} - Error: {e}")
    
    print("\n" + "=" * 60)
    print("✅ System check complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Restart backend: restart_backend.bat")
    print("2. Restart frontend: restart_frontend.bat")
    print("3. Login as company and post a job")
    print("4. Login as worker and apply to the job")
    print("5. Check notifications bell icon for updates")
    print("=" * 60)

if __name__ == "__main__":
    test_system()
