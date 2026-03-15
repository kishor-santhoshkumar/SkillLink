"""
Test script for Template Selection API
Tests the template update endpoint and PDF generation with different templates
"""

import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_template_update():
    """Test updating resume template"""
    print("\n" + "="*60)
    print("Testing Template Update API")
    print("="*60)
    
    # Get first resume
    print("\n1. Fetching resumes...")
    response = requests.get(f"{BASE_URL}/resumes/")
    
    if response.status_code != 200:
        print(f"✗ Failed to fetch resumes: {response.status_code}")
        return False
    
    resumes = response.json()
    if not resumes:
        print("✗ No resumes found. Create a profile first.")
        return False
    
    resume_id = resumes[0]['id']
    current_template = resumes[0].get('resume_template', 'executive')
    print(f"✓ Found resume ID: {resume_id}")
    print(f"  Current template: {current_template}")
    
    # Test each template
    templates = ['executive', 'modern', 'sidebar', 'construction', 'compact']
    
    for template in templates:
        print(f"\n2. Testing template: {template}")
        
        # Update template
        response = requests.put(
            f"{BASE_URL}/resumes/{resume_id}",
            json={"resume_template": template}
        )
        
        if response.status_code != 200:
            print(f"✗ Failed to update template: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
        
        data = response.json()
        if data.get('resume_template') != template:
            print(f"✗ Template not updated correctly")
            print(f"  Expected: {template}, Got: {data.get('resume_template')}")
            return False
        
        print(f"✓ Template updated to: {template}")
        
        # Test PDF download with this template
        print(f"  Testing PDF download...")
        response = requests.get(f"{BASE_URL}/resumes/{resume_id}/download")
        
        if response.status_code != 200:
            print(f"✗ Failed to download PDF: {response.status_code}")
            return False
        
        # Save PDF
        filename = f"temp/test_api_{template}.pdf"
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ PDF downloaded: {filename} ({len(response.content):,} bytes)")
    
    print("\n" + "="*60)
    print("✓ All template tests passed!")
    print("="*60)
    return True


def test_invalid_template():
    """Test invalid template rejection"""
    print("\n" + "="*60)
    print("Testing Invalid Template Rejection")
    print("="*60)
    
    # Get first resume
    response = requests.get(f"{BASE_URL}/resumes/")
    if response.status_code != 200 or not response.json():
        print("✗ No resumes found")
        return False
    
    resume_id = response.json()[0]['id']
    
    # Try invalid template
    print("\nTrying invalid template 'invalid_template'...")
    response = requests.put(
        f"{BASE_URL}/resumes/{resume_id}",
        json={"resume_template": "invalid_template"}
    )
    
    if response.status_code == 400:
        print("✓ Invalid template correctly rejected")
        print(f"  Error message: {response.json().get('detail')}")
        return True
    else:
        print(f"✗ Expected 400 error, got: {response.status_code}")
        return False


def test_template_persistence():
    """Test that template choice persists"""
    print("\n" + "="*60)
    print("Testing Template Persistence")
    print("="*60)
    
    # Get first resume
    response = requests.get(f"{BASE_URL}/resumes/")
    if response.status_code != 200 or not response.json():
        print("✗ No resumes found")
        return False
    
    resume_id = response.json()[0]['id']
    
    # Set template to 'modern'
    print("\n1. Setting template to 'modern'...")
    response = requests.put(
        f"{BASE_URL}/resumes/{resume_id}",
        json={"resume_template": "modern"}
    )
    
    if response.status_code != 200:
        print(f"✗ Failed to update template")
        return False
    
    print("✓ Template updated")
    
    # Fetch resume again
    print("\n2. Fetching resume again...")
    response = requests.get(f"{BASE_URL}/resumes/{resume_id}")
    
    if response.status_code != 200:
        print(f"✗ Failed to fetch resume")
        return False
    
    data = response.json()
    if data.get('resume_template') != 'modern':
        print(f"✗ Template not persisted")
        print(f"  Expected: modern, Got: {data.get('resume_template')}")
        return False
    
    print("✓ Template persisted correctly")
    return True


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("TEMPLATE SELECTION API TEST SUITE")
    print("="*60)
    print("\nMake sure the backend is running on http://127.0.0.1:8000")
    print("Press Enter to continue...")
    input()
    
    # Create temp directory
    import os
    os.makedirs('temp', exist_ok=True)
    
    results = []
    
    # Run tests
    results.append(("Template Update", test_template_update()))
    results.append(("Invalid Template Rejection", test_invalid_template()))
    results.append(("Template Persistence", test_template_persistence()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✓ PASS" if success else "✗ FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        print("\nGenerated PDFs are in the 'temp/' directory:")
        print("  - test_api_executive.pdf")
        print("  - test_api_modern.pdf")
        print("  - test_api_sidebar.pdf")
        print("  - test_api_construction.pdf")
        print("  - test_api_compact.pdf")
        return True
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
