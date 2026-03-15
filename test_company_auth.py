"""
Test script to verify company profile creation with authentication
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_company_creation():
    print("=" * 60)
    print("Testing Company Profile Creation")
    print("=" * 60)
    
    # Step 1: Login as company user
    print("\n1. Logging in as company user...")
    login_data = {
        "username_or_phone": "testcompany",
        "password": "company123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data
        )
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("access_token")
            user = token_data.get("user")
            print(f"✓ Login successful!")
            print(f"  User: {user.get('username')}")
            print(f"  Role: {user.get('role')}")
            print(f"  Token: {token[:20]}...")
        else:
            print(f"✗ Login failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return
    except Exception as e:
        print(f"✗ Login error: {e}")
        return
    
    # Step 2: Check existing company profile
    print("\n2. Checking for existing company profile...")
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"  Using token: {token[:30]}...")
    print(f"  Headers: {headers}")
    
    try:
        response = requests.get(
            f"{BASE_URL}/companies/me",
            headers=headers
        )
        
        print(f"  Response status: {response.status_code}")
        print(f"  Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            company = response.json()
            print(f"✓ Company profile exists:")
            print(f"  Name: {company.get('company_name')}")
            print(f"  Type: {company.get('company_type')}")
            print(f"  Location: {company.get('location')}")
            return
        elif response.status_code == 404:
            print("  No existing company profile found")
        else:
            print(f"✗ Error checking profile: {response.status_code}")
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # Step 3: Create company profile
    print("\n3. Creating company profile...")
    company_data = {
        "company_name": "Test Construction Company",
        "company_type": "Construction",
        "location": "Mumbai, Maharashtra",
        "contact_person": "Test Manager",
        "phone": "9876543210",
        "email": "test@company.com"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/companies/",
            headers=headers,
            json=company_data
        )
        
        if response.status_code == 201:
            company = response.json()
            print(f"✓ Company profile created successfully!")
            print(f"  ID: {company.get('id')}")
            print(f"  Name: {company.get('company_name')}")
            print(f"  Type: {company.get('company_type')}")
        else:
            print(f"✗ Creation failed: {response.status_code}")
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_company_creation()
