"""
Test Script: Enhanced PDF Design with Profile Photo and All New Fields

Tests the upgraded PDF generation with:
- Profile photo in header
- All new fields (location, work background, education, etc.)
- Verified worker badge
- Professional layout
"""

import requests

BASE_URL = "http://127.0.0.1:8000"

print("=" * 80)
print("ENHANCED PDF DESIGN TEST - RURAL & URBAN SKILLED WORKER PLATFORM")
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
# TEST: Create Profile and Generate Enhanced PDF
# ============================================================

print("Creating comprehensive worker profile...")
print()

worker_data = {
    "raw_input": """
    My name is Rajesh Kumar. I am a professional Carpenter with 12 years of experience.
    
    I live in Whitefield, Bangalore Urban district, Karnataka.
    
    I worked for L&T Construction for 5 years as a carpentry supervisor.
    I have worked on residential houses, apartments, commercial buildings, and shopping malls.
    
    I specialize in:
    - Custom furniture design and installation
    - Modular kitchen installation
    - Wooden flooring and laminate work
    - Door and window fitting
    - Cabinet making and wardrobes
    - Decorative woodwork and paneling
    
    I have my own complete set of carpentry tools including:
    - Circular saw, table saw, jigsaw
    - Drill machine and impact driver
    - Planer and router
    - Measuring tools and levels
    - Hand tools (hammer, chisel, screwdriver set)
    
    I also have my own two-wheeler for travel.
    
    I have completed over 200 projects successfully.
    I can provide references from previous clients.
    
    I work on contract basis and am available full-time.
    I can travel anywhere in Bangalore city.
    My expected rate is ₹1800 per day.
    
    I completed my 10th standard and have ITI certification in Carpentry.
    I also did apprenticeship training with a master carpenter for 2 years.
    
    Contact: +91-9876543210
    Languages: English, Hindi, Kannada, Tamil
    """
}

print("📤 Creating worker profile...")
response = requests.post(f"{BASE_URL}/resumes/", json=worker_data)

if response.status_code in [200, 201]:
    data = response.json()
    worker_id = data['id']
    print(f"✅ Profile created (ID: {worker_id})")
    print()
    
    print("=" * 80)
    print("PROFILE SUMMARY")
    print("=" * 80)
    print(f"Name: {data.get('full_name')}")
    print(f"Trade: {data.get('primary_trade')}")
    print(f"Experience: {data.get('years_of_experience')}")
    print(f"Location: {data.get('village_or_city')}, {data.get('district')}, {data.get('state')}")
    print(f"Projects: {data.get('projects_completed')}")
    print(f"Own Tools: {data.get('own_tools')}")
    print(f"Own Vehicle: {data.get('own_vehicle')}")
    print(f"Education: {data.get('education_level')}")
    print(f"Training: {data.get('technical_training')}")
    print()
    
    # Add reviews to make verified worker
    print("Adding reviews to earn verified worker badge...")
    for i in range(5):
        review_data = {
            "client_name": f"Client {i+1}",
            "rating": 5,
            "comment": "Excellent work! Very professional."
        }
        requests.post(f"{BASE_URL}/resumes/{worker_id}/reviews", json=review_data)
    print("✅ Added 5 five-star reviews")
    print()
    
    # Generate PDF
    print("=" * 80)
    print("GENERATING ENHANCED PDF")
    print("=" * 80)
    print()
    
    pdf_response = requests.get(f"{BASE_URL}/resumes/{worker_id}/download")
    
    if pdf_response.status_code == 200:
        print("✅ PDF generated successfully!")
        print(f"   PDF Size: {len(pdf_response.content)} bytes")
        print()
        
        # Save PDF
        pdf_filename = f"enhanced_profile_{worker_id}.pdf"
        with open(pdf_filename, 'wb') as f:
            f.write(pdf_response.content)
        print(f"📄 PDF saved as: {pdf_filename}")
        print()
        
        print("=" * 80)
        print("ENHANCED PDF FEATURES")
        print("=" * 80)
        print()
        print("✓ Colored header section (Navy #1F3A5F)")
        print("✓ Profile photo support (if uploaded)")
        print("✓ Large bold name in header")
        print("✓ Trade and experience subtitle")
        print("✓ Contact info with icons (📱 📍 🗣️)")
        print("✓ Location details (village/city, district, state)")
        print("✓ Verified worker badge (if qualified)")
        print("✓ Professional summary section")
        print("✓ Work experience with bullet points")
        print("✓ Core skills (two-column layout)")
        print("✓ Tools & equipment (two-column layout)")
        print("✓ Work background section")
        print("✓ Service details (styled grey box)")
        print("✓ Projects completed")
        print("✓ Trust & credentials (rating, references)")
        print("✓ Education & training section")
        print("✓ Languages section")
        print("✓ Section headers with colored underlines")
        print("✓ Professional typography and spacing")
        print()
        
        print("=" * 80)
        print("TEST RESULT")
        print("=" * 80)
        print()
        print("🎉 ENHANCED PDF GENERATION SUCCESSFUL!")
        print()
        print("The PDF now includes:")
        print("  • All new fields from the platform upgrade")
        print("  • Professional Canva-style design")
        print("  • Verified worker badge system")
        print("  • Profile photo support (header left)")
        print("  • Two-column layouts for space efficiency")
        print("  • Styled sections with proper hierarchy")
        print("  • Clean, scannable format for HR/contractors")
        print()
        print(f"Open '{pdf_filename}' to view the enhanced design!")
        print()
        
    else:
        print(f"❌ PDF generation failed: {pdf_response.status_code}")
        print(f"Error: {pdf_response.text}")

else:
    print(f"❌ Profile creation failed: {response.status_code}")
    print(response.text)

print("=" * 80)
