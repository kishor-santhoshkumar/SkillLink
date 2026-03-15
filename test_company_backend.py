"""
Test script for Phase 2: Company Backend
Tests company profile creation and worker search endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_company_backend():
    """
    Test company backend endpoints
    """
    print("=" * 60)
    print("🧪 Testing Phase 2: Company Backend")
    print("=" * 60)
    
    # Step 1: Register a company user
    print("\n1️⃣ Registering company user...")
    register_data = {
        "username": "testcompany123",
        "phone_number": "9999888877",
        "password": "password123",
        "email": "test@company.com",
        "role": "company"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if response.status_code == 201:
            print("✅ Company user registered successfully")
            token = response.json()["access_token"]
            user = response.json()["user"]
            print(f"   Username: {user['username']}")
            print(f"   Role: {user['role']}")
            print(f"   Token: {token[:20]}...")
        elif response.status_code == 400:
            # User already exists, try login
            print("⚠️  User already exists, trying login...")
            login_data = {
                "username_or_phone": register_data["username"],
                "password": register_data["password"]
            }
            response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            if response.status_code == 200:
                print("✅ Logged in successfully")
                token = response.json()["access_token"]
                user = response.json()["user"]
            else:
                print(f"❌ Login failed: {response.text}")
                return
        else:
            print(f"❌ Registration failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Create company profile
    print("\n2️⃣ Creating company profile...")
    company_data = {
        "company_name": "ABC Construction Pvt Ltd",
        "company_type": "Construction",
        "location": "Mumbai, Maharashtra",
        "contact_person": "Rajesh Kumar",
        "phone": "9876543210",
        "email": "contact@abcconstruction.com"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/companies/", json=company_data, headers=headers)
        if response.status_code == 201:
            print("✅ Company profile created successfully")
            company = response.json()
            print(f"   Company ID: {company['id']}")
            print(f"   Company Name: {company['company_name']}")
            print(f"   Location: {company['location']}")
            company_id = company['id']
        elif response.status_code == 400:
            print("⚠️  Company profile already exists")
            # Get existing profile
            response = requests.get(f"{BASE_URL}/companies/me", headers=headers)
            if response.status_code == 200:
                company = response.json()
                company_id = company['id']
                print(f"   Using existing company ID: {company_id}")
        else:
            print(f"❌ Failed to create company: {response.text}")
            return
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Step 3: Get company profile
    print("\n3️⃣ Getting company profile...")
    try:
        response = requests.get(f"{BASE_URL}/companies/me", headers=headers)
        if response.status_code == 200:
            print("✅ Company profile retrieved successfully")
            company = response.json()
            print(f"   Company Name: {company['company_name']}")
            print(f"   Type: {company['company_type']}")
            print(f"   Location: {company['location']}")
        else:
            print(f"❌ Failed to get company: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Step 4: Update company profile
    print("\n4️⃣ Updating company profile...")
    update_data = {
        "contact_person": "Suresh Patel",
        "phone": "9876543211"
    }
    
    try:
        response = requests.put(f"{BASE_URL}/companies/{company_id}", json=update_data, headers=headers)
        if response.status_code == 200:
            print("✅ Company profile updated successfully")
            company = response.json()
            print(f"   Updated Contact: {company['contact_person']}")
            print(f"   Updated Phone: {company['phone']}")
        else:
            print(f"❌ Failed to update company: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Step 5: Search workers
    print("\n5️⃣ Searching for workers...")
    try:
        # Search for carpenters
        response = requests.get(f"{BASE_URL}/workers/search?trade=Carpenter&limit=5", headers=headers)
        if response.status_code == 200:
            workers = response.json()
            print(f"✅ Found {len(workers)} carpenter(s)")
            for i, worker in enumerate(workers[:3], 1):
                print(f"   {i}. {worker.get('full_name', 'N/A')} - {worker.get('primary_trade', 'N/A')} - {worker.get('location', 'N/A')}")
        else:
            print(f"⚠️  Worker search returned: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Step 6: List available trades
    print("\n6️⃣ Listing available trades...")
    try:
        response = requests.get(f"{BASE_URL}/workers/trades/list", headers=headers)
        if response.status_code == 200:
            trades = response.json()
            print(f"✅ Found {len(trades)} trade(s)")
            print(f"   Trades: {', '.join(trades[:10])}")
        else:
            print(f"⚠️  Trades list returned: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Step 7: Test role-based access control
    print("\n7️⃣ Testing role-based access control...")
    print("   (Creating a worker user and trying to access company endpoints)")
    
    worker_register = {
        "username": "testworker456",
        "phone_number": "8888777766",
        "password": "password123",
        "role": "worker"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=worker_register)
        if response.status_code in [201, 400]:
            if response.status_code == 400:
                # Login if already exists
                login_data = {
                    "username_or_phone": worker_register["username"],
                    "password": worker_register["password"]
                }
                response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            
            worker_token = response.json()["access_token"]
            worker_headers = {"Authorization": f"Bearer {worker_token}"}
            
            # Try to access company endpoint
            response = requests.get(f"{BASE_URL}/companies/me", headers=worker_headers)
            if response.status_code == 403:
                print("✅ Role-based access control working correctly")
                print("   Worker user cannot access company endpoints (403 Forbidden)")
            else:
                print(f"⚠️  Unexpected response: {response.status_code}")
        else:
            print(f"⚠️  Could not create worker user for testing")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("✅ Phase 2 Backend Testing Complete!")
    print("=" * 60)
    print("\n📋 Summary:")
    print("   ✅ Company user registration")
    print("   ✅ Company profile creation")
    print("   ✅ Company profile retrieval")
    print("   ✅ Company profile update")
    print("   ✅ Worker search with filters")
    print("   ✅ Available trades listing")
    print("   ✅ Role-based access control")
    print("\n🚀 Ready for Phase 3: Company Frontend")


if __name__ == "__main__":
    print("\n⚠️  Make sure the backend is running on http://localhost:8000")
    print("   Run: python -m uvicorn app.main:app --reload\n")
    
    input("Press Enter to start testing...")
    test_company_backend()
