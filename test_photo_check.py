import requests

# Get the latest profile
response = requests.get('http://127.0.0.1:8000/resumes/')
profiles = response.json()

if profiles:
    latest = profiles[0]
    print(f"Latest Profile ID: {latest['id']}")
    print(f"Name: {latest.get('full_name', 'N/A')}")
    print(f"Photo Path: {latest.get('profile_photo', 'NO PHOTO')}")
    
    if latest.get('profile_photo'):
        photo_url = f"http://127.0.0.1:8000{latest['profile_photo']}"
        print(f"Photo URL: {photo_url}")
        
        # Try to access the photo
        try:
            photo_response = requests.get(photo_url)
            print(f"Photo Status Code: {photo_response.status_code}")
            if photo_response.status_code == 200:
                print("✓ Photo is accessible!")
            else:
                print("✗ Photo not accessible")
        except Exception as e:
            print(f"Error accessing photo: {e}")
    else:
        print("✗ No photo path in database")
else:
    print("No profiles found")
