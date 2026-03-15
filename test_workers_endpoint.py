"""
Test the /workers/ endpoint to verify it returns worker data
"""
import requests

try:
    response = requests.get('http://127.0.0.1:8000/workers/')
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        workers = response.json()
        print(f"Total Workers: {len(workers)}")
        
        # Count published workers
        published = [w for w in workers if w.get('is_published')]
        print(f"Published Workers: {len(published)}")
        
        # Show first worker if available
        if published:
            first = published[0]
            print(f"\nSample Worker:")
            print(f"  Name: {first.get('full_name')}")
            print(f"  Trade: {first.get('primary_trade')}")
            print(f"  Published: {first.get('is_published')}")
            print(f"  Rating: {first.get('client_rating')}")
    else:
        print(f"Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("ERROR: Backend not running at http://127.0.0.1:8000")
    print("Please start the backend with: start_backend.bat")
except Exception as e:
    print(f"ERROR: {e}")
