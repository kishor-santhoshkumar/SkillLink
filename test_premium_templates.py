"""
Test script for Premium Resume Templates
Tests all 5 templates with sample data
"""

import os
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services_pdf import (
    generate_executive_pdf,
    generate_modern_pdf,
    generate_sidebar_pdf,
    generate_construction_pdf,
    generate_compact_pdf
)

# Sample resume data
sample_data = {
    'full_name': 'Rajesh Kumar',
    'phone_number': '+91-9876543210',
    'village_or_city': 'Mumbai',
    'district': 'Mumbai Suburban',
    'state': 'Maharashtra',
    'primary_trade': 'Senior Carpenter',
    'years_of_experience': '15 years',
    'specializations': 'Residential Framing, Roof Systems, Cabinet Installation, Finish Work, Blueprint Reading, Team Leadership',
    'tools_handled': 'Power Saws, Drills, Sanders, Nail Guns, Measuring Tools, Hand Tools',
    'worked_as': 'Self-employed Contractor',
    'company_name': 'Kumar Construction Services',
    'project_types': 'Residential houses, Apartments, Commercial buildings',
    'service_type': 'Contract',
    'availability': 'Full-time',
    'travel_radius': '20km',
    'expected_wage': '₹1500 per day',
    'own_tools': True,
    'own_vehicle': True,
    'projects_completed': 250,
    'client_rating': 4.8,
    'reference_available': True,
    'education_level': 'High School',
    'technical_training': 'ITI Carpentry - 2005',
    'languages_spoken': 'Hindi, English, Marathi',
    'professional_summary': 'Highly skilled Senior Carpenter with 15+ years of experience specializing in residential and commercial construction. Proven track record of delivering high-quality carpentry work on 250+ projects. Expert in framing, roofing, cabinet installation, and finish work. Known for reliability, precision, and client satisfaction.',
    'structured_work_experience': [
        'Executed 250+ carpentry projects for residential and commercial clients',
        'Delivered high-quality framing and finish work with 98% client satisfaction rate',
        'Specialized in custom cabinet installation and architectural woodwork',
        'Managed carpentry projects from planning to completion with own tools and vehicle',
        'Trained and supervised teams of 5-10 junior carpenters on complex projects'
    ],
    'profile_photo': None,  # No photo for this test
    'resume_template': 'executive'
}

def test_template(template_name, generator_func, output_file):
    """Test a single template"""
    print(f"\n{'='*60}")
    print(f"Testing {template_name} Template")
    print(f"{'='*60}")
    
    try:
        # Update template in data
        test_data = sample_data.copy()
        test_data['resume_template'] = template_name.lower()
        
        # Generate PDF
        result = generator_func(output_file, test_data)
        
        # Check if file was created
        if os.path.exists(result):
            file_size = os.path.getsize(result)
            print(f"✓ SUCCESS: PDF generated at {result}")
            print(f"  File size: {file_size:,} bytes")
            return True
        else:
            print(f"✗ FAILED: PDF file not created")
            return False
    
    except Exception as e:
        print(f"✗ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Test all 5 premium templates"""
    print("\n" + "="*60)
    print("PREMIUM RESUME TEMPLATES TEST SUITE")
    print("="*60)
    
    # Create output directory
    output_dir = Path("temp")
    output_dir.mkdir(exist_ok=True)
    
    # Test each template
    templates = [
        ('Executive Classic', generate_executive_pdf, 'temp/test_executive.pdf'),
        ('Modern Minimal Elite', generate_modern_pdf, 'temp/test_modern.pdf'),
        ('Sidebar Professional', generate_sidebar_pdf, 'temp/test_sidebar.pdf'),
        ('Premium Construction Theme', generate_construction_pdf, 'temp/test_construction.pdf'),
        ('Recruiter Quick Scan', generate_compact_pdf, 'temp/test_compact.pdf'),
    ]
    
    results = []
    for name, func, output in templates:
        success = test_template(name, func, output)
        results.append((name, success))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✓ PASS" if success else "✗ FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed}/{total} templates passed")
    
    if passed == total:
        print("\n🎉 All templates generated successfully!")
        print(f"\nGenerated PDFs are in the '{output_dir}' directory.")
        print("Open them to verify the designs.")
    else:
        print(f"\n⚠️  {total - passed} template(s) failed. Check errors above.")
    
    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
