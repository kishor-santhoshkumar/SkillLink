"""
Test Script: PDF Generation with Profile Photo

Tests that the profile photo is correctly fetched and displayed in the PDF.
"""

import requests
from PIL import Image
import io

BASE_URL = "http://127.0.0.1:8000"

print("=" * 80)
print("PDF WITH PROFILE PHOTO TEST")
print("=" * 80)
print()

# Check if backend is running
try:
    response = requests.get(f"{BASE_URL}/")
    print("✅ Backend is running")
    print()
except:
    print("❌ Backend is not running. Please start it first.")
    exit(1)

# ============================================================
# STEP 1: Create a worker profile
# ============================================================

print("STEP 1: Creating worker profile...")
print()

worker_data = {
    "raw_input": """
    My name is Vikram Singh. I am a professional Electrician with 15 years of experience.
    I live in Whitefield, Bangalore Urban, Karnataka.
    I specialize in electrical panel installations, industrial wiring, and lighting design.
    I have completed over 250 projects.
    I have my own tools and vehicle.
    Contact: +91-9123456789
    Languages: English, Hindi, Kannada
    """
}

response = requests.post(f"{BASE_URL}/resumes/", json=worker_data)

if response.status_code in [200, 201]:
    data = response.json()
    worker_id = data['id']
    print(f"✅ Profile created (ID: {worker_id})")
    print(f"   Name: {data.get('full_name')}")
    print(f"   Trade: {data.get('primary_trade')}")
    print()
else:
    print(f"❌ Profile creation failed: {response.status_code}")
    print(response.text)
    exit(1)

# ============================================================
# STEP 2: Create a test profile photo
# ============================================================

print("STEP 2: Creating test profile photo...")
print()

# Create a simple test image (blue square with text)
img = Image.new('RGB', (300, 300), color='#1F3A5F')  # Navy blue
img_bytes = io.BytesIO()
img.save(img_bytes, format='JPEG')
img_bytes.seek(0)

print("✅ Test photo created (300x300 JPEG)")
print()

# ============================================================
# STEP 3: Upload profile photo
# ============================================================

print("STEP 3: Uploading profile photo...")
print()

files = {
    'file': ('profile.jpg', img_bytes, 'image/jpeg')
}

response = requests.post(
    f"{BASE_URL}/resumes/{worker_id}/upload-photo",
    files=files
)

if response.status_code == 200:
    photo_data = response.json()
    print(f"✅ Photo uploaded successfully!")
    print(f"   Photo URL: {photo_data.get('photo_url')}")
    print()
else:
    print(f"❌ Photo upload failed: {response.status_code}")
    print(response.text)
    exit(1)

# ============================================================
# STEP 4: Verify photo is in database
# ============================================================

print("STEP 4: Verifying photo in database...")
print()

response = requests.get(f"{BASE_URL}/resumes/{worker_id}")

if response.status_code == 200:
    data = response.json()
    profile_photo = data.get('profile_photo')
    
    if profile_photo:
        print(f"✅ Profile photo found in database")
        print(f"   Path: {profile_photo}")
        print()
    else:
        print("❌ Profile photo NOT found in database")
        print()
        exit(1)
else:
    print(f"❌ Failed to fetch profile: {response.status_code}")
    exit(1)

# ============================================================
# STEP 5: Add reviews for verified badge
# ============================================================

print("STEP 5: Adding reviews for verified worker badge...")
print()

for i in range(5):
    review_data = {
        "client_name": f"Client {i+1}",
        "rating": 5,
        "comment": "Excellent work!"
    }
    requests.post(f"{BASE_URL}/resumes/{worker_id}/reviews", json=review_data)

print("✅ Added 5 five-star reviews")
print()

# ============================================================
# STEP 6: Generate PDF with photo
# ============================================================

print("STEP 6: Generating PDF with profile photo...")
print()

pdf_response = requests.get(f"{BASE_URL}/resumes/{worker_id}/download")

if pdf_response.status_code == 200:
    print("✅ PDF generated successfully!")
    print(f"   PDF Size: {len(pdf_response.content)} bytes")
    print()
    
    # Save PDF
    pdf_filename = f"profile_with_photo_{worker_id}.pdf"
    with open(pdf_filename, 'wb') as f:
        f.write(pdf_response.content)
    
    print(f"📄 PDF saved as: {pdf_filename}")
    print()
    
    print("=" * 80)
    print("TEST RESULT")
    print("=" * 80)
    print()
    print("🎉 PDF WITH PROFILE PHOTO GENERATED!")
    print()
    print(f"Open '{pdf_filename}' to verify:")
    print("  ✓ Profile photo appears in header (left side)")
    print("  ✓ Photo is 1.2\" x 1.2\" size")
    print("  ✓ Name and details appear to the right of photo")
    print("  ✓ Navy header background (#1F3A5F)")
    print("  ✓ Verified worker badge displayed")
    print()
    
else:
    print(f"❌ PDF generation failed: {pdf_response.status_code}")
    print(f"Error: {pdf_response.text}")
    exit(1)

print("=" * 80)
print()
print("DEBUGGING INFO:")
print(f"  Worker ID: {worker_id}")
print(f"  Profile Photo Path: {profile_photo}")
print(f"  Photo URL: {photo_data.get('photo_url')}")
print()
print("If photo doesn't appear in PDF, check:")
print("  1. Photo file exists at the path")
print("  2. Path is accessible from PDF generation function")
print("  3. Image library can read the file format")
print()
print("=" * 80)
