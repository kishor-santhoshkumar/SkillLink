import requests

# Test if API is working
try:
    response = requests.get('http://127.0.0.1:8000/resumes/')
    print(f"Status Code: {response.status_code}")
    print(f"Number of profiles: {len(response.json())}")
    if response.json():
        print(f"First profile: {response.json()[0].get('full_name', 'No name')} (ID: {response.json()[0].get('id')})")
    else:
        print("No profiles found in database")
except Exception as e:
    print(f"Error: {e}")
