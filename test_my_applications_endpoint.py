"""
Test the /my-applications endpoint directly
"""
import requests

BASE_URL = "http://127.0.0.1:8000"

# Test with user kishor (User ID 1, Resume ID 65)
print("Testing /my-applications endpoint")
print("=" * 50)

# You need to login first to get a token
login_data = {
    "username": "kishor",
    "password": "kishor123"  # Replace with actual password
}

print("\n1. Logging in...")
response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
if response.status_code == 200:
    token = response.json()["access_token"]
    print(f"✓ Login successful, token: {token[:20]}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n2. Calling /jobs/my-applications...")
    response = requests.get(f"{BASE_URL}/jobs/my-applications", headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        applications = response.json()
        print(f"\n✓ Found {len(applications)} applications")
        for app in applications:
            print(f"  - Job {app['job_id']}: {app['job_title']} at {app['company_name']}")
    else:
        print(f"✗ Error: {response.json()}")
else:
    print(f"✗ Login failed: {response.status_code}")
    print(f"Response: {response.json()}")
