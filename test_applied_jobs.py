"""
Test script to verify applied jobs functionality
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Replace with your actual token
TOKEN = input("Enter your worker token: ")

headers = {
    "Authorization": f"Bearer {TOKEN}"
}

print("\n1. Testing GET /jobs/my-applications")
print("=" * 50)
response = requests.get(f"{BASE_URL}/jobs/my-applications", headers=headers)
print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n2. Testing GET /jobs/ (all jobs)")
print("=" * 50)
response = requests.get(f"{BASE_URL}/jobs/", headers=headers)
print(f"Status Code: {response.status_code}")
jobs = response.json()
print(f"Total jobs: {len(jobs)}")
if jobs:
    print(f"First job ID: {jobs[0]['id']}")
    print(f"First job trade: {jobs[0]['required_trade']}")

print("\n3. Checking which jobs you've applied to:")
print("=" * 50)
response = requests.get(f"{BASE_URL}/jobs/my-applications", headers=headers)
if response.status_code == 200:
    applications = response.json()
    applied_job_ids = [app['job_id'] for app in applications]
    print(f"Applied job IDs: {applied_job_ids}")
    
    # Check against all jobs
    response = requests.get(f"{BASE_URL}/jobs/", headers=headers)
    if response.status_code == 200:
        all_jobs = response.json()
        for job in all_jobs:
            status = "APPLIED ✓" if job['id'] in applied_job_ids else "NOT APPLIED"
            print(f"Job {job['id']} ({job['required_trade']}): {status}")
