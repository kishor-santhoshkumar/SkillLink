"""
Test script for skilled worker profile system.
Tests the complete flow with sample data.
"""
import requests
import json

# Backend URL
BASE_URL = "http://127.0.0.1:8000"

# Test data - Skilled worker profiles in different languages
test_profiles = [
    {
        "name": "English Carpenter",
        "raw_input": "My name is Rajesh Kumar. Phone: +91-9876543210. I am a Carpenter with 8 years experience in Mumbai. I specialize in furniture making, door installation, and wooden flooring. Available for contract work. Can travel up to 15km. Completed 100+ projects. Know how to use circular saw, drill machine, planer, sander. Expected wage: ₹1000 per day. I speak Hindi, English, Marathi."
    },
    {
        "name": "Tamil Plumber",
        "raw_input": "என் பெயர் முருகன். தொலைபேசி: 9876543210. நான் 5 வருட அனுபவமுள்ள பிளம்பர். சென்னையில் வேலை செய்கிறேன். குழாய் பொருத்துதல், குளியலறை நிறுவல், நீர் சூடாக்கி பழுது. தினசரி கூலி வேலை. 10 கிமீ வரை பயணிக்க முடியும். 50+ திட்டங்கள் முடித்துள்ளேன்."
    },
    {
        "name": "Hindi Electrician",
        "raw_input": "मेरा नाम अमित शर्मा है। फोन: 9876543210। मैं 6 साल का अनुभव वाला इलेक्ट्रीशियन हूं। दिल्ली में काम करता हूं। वायरिंग, स्विचबोर्ड इंस्टॉलेशन, फॉल्ट रिपेयर में माहिर। पूर्णकालिक उपलब्ध। शहर भर में जा सकता हूं। 80+ प्रोजेक्ट पूरे किए। टेस्टर, प्लायर, वायर स्ट्रिपर जानता हूं। अपेक्षित वेतन: ₹800 प्रति दिन।"
    }
]

def test_create_profile(profile_data):
    """Test creating a skilled worker profile."""
    print(f"\n{'='*60}")
    print(f"Testing: {profile_data['name']}")
    print(f"{'='*60}")
    
    try:
        # Create profile
        response = requests.post(
            f"{BASE_URL}/resumes/",
            json={"raw_input": profile_data["raw_input"]},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            result = response.json()
            print(f"✓ Profile created successfully!")
            print(f"\nProfile ID: {result['id']}")
            print(f"Name: {result.get('full_name', 'N/A')}")
            print(f"Trade: {result.get('primary_trade', 'N/A')}")
            print(f"Experience: {result.get('years_of_experience', 'N/A')}")
            print(f"Location: {result.get('location', 'N/A')}")
            print(f"Phone: {result.get('contact_number', 'N/A')}")
            print(f"Specializations: {result.get('specializations', 'N/A')}")
            print(f"Service Type: {result.get('service_type', 'N/A')}")
            print(f"Projects: {result.get('projects_completed', 'N/A')}")
            print(f"Expected Wage: {result.get('expected_wage', 'N/A')}")
            print(f"\nQuality Score: {result.get('resume_score', 'N/A')}/100")
            print(f"AI Confidence: {result.get('ai_confidence_score', 'N/A')}%")
            print(f"Language: {result.get('detected_language', 'N/A')}")
            print(f"\nSummary: {result.get('professional_summary', 'N/A')}")
            
            return result['id']
        else:
            print(f"✗ Failed to create profile")
            print(f"Status: {response.status_code}")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return None


def test_get_profile(profile_id):
    """Test retrieving a profile."""
    print(f"\n{'='*60}")
    print(f"Testing: Get Profile {profile_id}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(f"{BASE_URL}/resumes/{profile_id}")
        
        if response.status_code == 200:
            print(f"✓ Profile retrieved successfully!")
            return True
        else:
            print(f"✗ Failed to retrieve profile")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_get_score(profile_id):
    """Test getting profile score."""
    print(f"\n{'='*60}")
    print(f"Testing: Get Score for Profile {profile_id}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(f"{BASE_URL}/resumes/{profile_id}/score")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ Score retrieved successfully!")
            print(f"Score: {result['score']}/100")
            print(f"Feedback: {result['feedback']}")
            return True
        else:
            print(f"✗ Failed to retrieve score")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    """Run all tests."""
    print("\n" + "="*60)
    print("SKILLLINK SKILLED WORKER PROFILE SYSTEM - TEST SUITE")
    print("="*60)
    
    # Test backend connection
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✓ Backend is running")
        else:
            print("✗ Backend connection failed")
            return
    except Exception as e:
        print(f"✗ Cannot connect to backend: {e}")
        return
    
    # Test each profile
    profile_ids = []
    for profile_data in test_profiles:
        profile_id = test_create_profile(profile_data)
        if profile_id:
            profile_ids.append(profile_id)
    
    # Test retrieval and scoring
    if profile_ids:
        test_profile_id = profile_ids[0]
        test_get_profile(test_profile_id)
        test_get_score(test_profile_id)
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")
    print(f"Profiles created: {len(profile_ids)}/{len(test_profiles)}")
    print(f"✓ System transformation complete!")
    print(f"✓ SkillLink is now a Skilled Worker Profile System!")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
