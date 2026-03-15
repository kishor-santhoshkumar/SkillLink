"""
Test script for worker verification badges system.
Tests verification endpoints and badge display.
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_get_worker_badges():
    """Test getting worker badges."""
    print("\n=== Testing Get Worker Badges ===")
    
    # Get a worker first
    response = requests.get(f"{BASE_URL}/workers/")
    if response.status_code != 200:
        print("✗ Failed to get workers")
        return
    
    workers = response.json()
    if not workers:
        print("✗ No workers found")
        return
    
    worker_id = workers[0]['id']
    print(f"Testing with worker ID: {worker_id}")
    
    # Get badges
    response = requests.get(f"{BASE_URL}/verification/workers/{worker_id}/badges")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Got badges: {json.dumps(data, indent=2)}")
        return worker_id
    else:
        print(f"✗ Failed to get badges: {response.status_code}")
        return None


def test_verify_email(worker_id, token):
    """Test email verification."""
    print("\n=== Testing Email Verification ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.patch(
        f"{BASE_URL}/verification/workers/{worker_id}/email",
        headers=headers
    )
    
    if response.status_code == 200:
        print("✓ Email verified successfully")
        return True
    else:
        print(f"✗ Failed to verify email: {response.status_code}")
        print(f"  Response: {response.text}")
        return False


def test_verify_phone(worker_id, token):
    """Test phone verification."""
    print("\n=== Testing Phone Verification ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.patch(
        f"{BASE_URL}/verification/workers/{worker_id}/phone",
        headers=headers
    )
    
    if response.status_code == 200:
        print("✓ Phone verified successfully")
        return True
    else:
        print(f"✗ Failed to verify phone: {response.status_code}")
        return False


def test_verify_identity(worker_id, token):
    """Test identity verification."""
    print("\n=== Testing Identity Verification ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.patch(
        f"{BASE_URL}/verification/workers/{worker_id}/identity",
        headers=headers
    )
    
    if response.status_code == 200:
        print("✓ Identity verified successfully")
        return True
    else:
        print(f"✗ Failed to verify identity: {response.status_code}")
        return False


def test_verify_background(worker_id, token):
    """Test background check verification."""
    print("\n=== Testing Background Check Verification ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.patch(
        f"{BASE_URL}/verification/workers/{worker_id}/background",
        headers=headers
    )
    
    if response.status_code == 200:
        print("✓ Background check verified successfully")
        return True
    else:
        print(f"✗ Failed to verify background: {response.status_code}")
        return False


def test_revoke_verification(worker_id, badge_type, token):
    """Test revoking a verification badge."""
    print(f"\n=== Testing Revoke {badge_type.title()} Verification ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.patch(
        f"{BASE_URL}/verification/workers/{worker_id}/revoke/{badge_type}",
        headers=headers
    )
    
    if response.status_code == 200:
        print(f"✓ {badge_type} verification revoked successfully")
        return True
    else:
        print(f"✗ Failed to revoke {badge_type}: {response.status_code}")
        return False


def test_get_updated_badges(worker_id):
    """Test getting updated badges after verification."""
    print("\n=== Testing Get Updated Badges ===")
    
    response = requests.get(f"{BASE_URL}/verification/workers/{worker_id}/badges")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Updated badges: {json.dumps(data, indent=2)}")
        return True
    else:
        print(f"✗ Failed to get updated badges: {response.status_code}")
        return False


def main():
    print("=" * 50)
    print("Worker Verification System Test Suite")
    print("=" * 50)
    
    # Get a worker and test badges
    worker_id = test_get_worker_badges()
    if not worker_id:
        print("\n✗ Cannot proceed without a worker")
        return
    
    # For testing verification endpoints, we need a token
    # In a real scenario, you'd login first
    print("\n⚠ Note: Verification endpoints require admin/company token")
    print("  Skipping verification tests (would need authentication)")
    
    # Test getting badges again
    test_get_updated_badges(worker_id)
    
    print("\n" + "=" * 50)
    print("Test suite completed!")
    print("=" * 50)


if __name__ == "__main__":
    main()
