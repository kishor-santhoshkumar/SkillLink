"""
Test /my-applications endpoint with actual login
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Login as kishor
print("1. Logging in as kishor...")
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "username_or_phone": "kishor",
    "password": "kishor"
})

if login_response.status_code != 200:
    print(f"✗ Login failed: {login_response.status_code}")
    print(login_response.json())
    exit(1)

token = login_response.json()["access_token"]
print(f"✓ Login successful")

headers = {"Authorization": f"Bearer {token}"}

# Test /my-applications
print("\n2. Testing /jobs/my-applications...")
response = requests.get(f"{BASE_URL}/jobs/my-applications", headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

if response.status_code == 200:
    apps = response.json()
    print(f"\n✓ Found {len(apps)} applications")
    if len(apps) > 0:
        print("Job IDs:", [app['job_id'] for app in apps])
    else:
        print("⚠️ No applications found - checking why...")
        
        # Check if resume exists
        print("\n3. Checking resume...")
        resume_response = requests.get(f"{BASE_URL}/resumes/me", headers=headers)
        if resume_response.status_code == 200:
            resume = resume_response.json()
            print(f"✓ Resume found: ID={resume.get('id')}, Name={resume.get('full_name')}")
        else:
            print(f"✗ No resume found: {resume_response.status_code}")
