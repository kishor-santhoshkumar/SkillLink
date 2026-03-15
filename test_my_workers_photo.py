"""
Test script to check what photo URLs are being returned from /jobs/my-workers endpoint
"""
import requests
import json

# Login as company user
login_url = "http://127.0.0.1:8000/auth/login"
login_data = {
    "username": "testcompany",  # Replace with actual company username
    "password": "password123"   # Replace with actual password
}

print("🔐 Logging in as company...")
response = requests.post(login_url, data=login_data)
if response.status_code != 200:
    print(f"❌ Login failed: {response.status_code}")
    print(response.text)
    exit(1)

token = response.json()["access_token"]
print(f"✅ Login successful! Token: {token[:20]}...")

# Test my-workers endpoint
headers = {"Authorization": f"Bearer {token}"}

print("\n📋 Fetching in-progress workers...")
response = requests.get(
    "http://127.0.0.1:8000/jobs/my-workers?status=in-progress",
    headers=headers
)

if response.status_code != 200:
    print(f"❌ Request failed: {response.status_code}")
    print(response.text)
    exit(1)

workers = response.json()
print(f"✅ Found {len(workers)} workers\n")

# Print photo information for each worker
for i, worker in enumerate(workers, 1):
    print(f"Worker {i}:")
    print(f"  Name: {worker.get('worker_name')}")
    print(f"  Trade: {worker.get('worker_trade')}")
    print(f"  Photo Path: {worker.get('profile_photo')}")
    print(f"  Photo Type: {type(worker.get('profile_photo'))}")
    
    # Try to access the photo
    if worker.get('profile_photo'):
        photo_path = worker['profile_photo']
        
        # Test different URL constructions
        test_urls = [
            f"http://127.0.0.1:8000/uploads/{photo_path}",
            f"http://127.0.0.1:8000/{photo_path}",
            photo_path if photo_path.startswith('http') else None
        ]
        
        print(f"  Testing photo URLs:")
        for url in test_urls:
            if url:
                try:
                    photo_response = requests.get(url, timeout=2)
                    print(f"    {url} -> {photo_response.status_code}")
                except Exception as e:
                    print(f"    {url} -> ERROR: {e}")
    print()
