"""
Diagnostic script to check company dashboard access
"""
import requests

BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("Company Dashboard Access Diagnostic")
print("=" * 60)

# Test 1: Check if backend is running
print("\n1. Checking if backend is running...")
try:
    response = requests.get(f"{BASE_URL}/docs", timeout=2)
    if response.status_code == 200:
        print("✓ Backend is running on port 8000")
    else:
        print(f"⚠ Backend responded with status {response.status_code}")
except Exception as e:
    print(f"✗ Backend is NOT running: {e}")
    print("  → Run: start_backend.bat")
    exit(1)

# Test 2: Check if testcompany user exists
print("\n2. Checking if testcompany user exists...")
from app.database import SessionLocal
from app.models import User

db = SessionLocal()
user = db.query(User).filter(User.username == "testcompany").first()

if user:
    print(f"✓ User found:")
    print(f"  ID: {user.id}")
    print(f"  Username: {user.username}")
    print(f"  Role: {user.role}")
    print(f"  Email: {user.email}")
else:
    print("✗ User 'testcompany' not found")
    print("  → Run: python create_test_company_user.py")
    db.close()
    exit(1)

db.close()

# Test 3: Try to login
print("\n3. Testing login...")
try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "username_or_phone": "testcompany",
            "password": "company123"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        user_data = data.get("user")
        
        print("✓ Login successful!")
        print(f"  User: {user_data.get('username')}")
        print(f"  Role: {user_data.get('role')}")
        print(f"  Token: {token[:30]}...")
        
        # Test 4: Try to access company endpoint
        print("\n4. Testing company endpoint access...")
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/companies/me", headers=headers)
        
        if response.status_code == 200:
            company = response.json()
            print("✓ Company profile exists:")
            print(f"  Name: {company.get('company_name')}")
            print(f"  Type: {company.get('company_type')}")
        elif response.status_code == 404:
            print("ℹ No company profile yet (this is OK)")
            print("  You can create one from the dashboard")
        elif response.status_code == 401:
            print("✗ 401 Unauthorized - Token validation failed")
            print("  → Backend needs to be restarted!")
            print("  → Run: Ctrl+C in backend terminal, then start_backend.bat")
        else:
            print(f"⚠ Unexpected status: {response.status_code}")
            print(f"  Response: {response.text}")
            
    else:
        print(f"✗ Login failed: {response.status_code}")
        print(f"  Response: {response.text}")
        
except Exception as e:
    print(f"✗ Error: {e}")

print("\n" + "=" * 60)
print("Frontend Access Instructions:")
print("=" * 60)
print("\n1. Make sure frontend is running:")
print("   cd frontend")
print("   npm run dev")
print("\n2. Open browser: http://localhost:3000")
print("\n3. Clear localStorage:")
print("   - Press F12")
print("   - Go to Application tab")
print("   - Click Local Storage → http://localhost:3000")
print("   - Delete all entries")
print("   - Refresh page")
print("\n4. Click 'Login' and enter:")
print("   Username: testcompany")
print("   Password: company123")
print("\n5. You should be redirected to: /company/dashboard")
print("\n" + "=" * 60)
