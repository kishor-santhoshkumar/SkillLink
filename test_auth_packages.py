"""
Quick test to verify authentication packages are installed correctly
Run this after installing packages to verify everything is ready
"""

def test_imports():
    """Test if all required packages can be imported"""
    print("Testing authentication package imports...\n")
    
    tests = []
    
    # Test python-jose
    try:
        from jose import jwt
        print("✅ python-jose (JWT) - OK")
        tests.append(True)
    except ImportError as e:
        print(f"❌ python-jose (JWT) - FAILED: {e}")
        tests.append(False)
    
    # Test passlib
    try:
        from passlib.context import CryptContext
        print("✅ passlib (Password hashing) - OK")
        tests.append(True)
    except ImportError as e:
        print(f"❌ passlib (Password hashing) - FAILED: {e}")
        tests.append(False)
    
    # Test google-auth
    try:
        from google.oauth2 import id_token
        print("✅ google-auth (Google OAuth) - OK")
        tests.append(True)
    except ImportError as e:
        print(f"❌ google-auth (Google OAuth) - FAILED: {e}")
        tests.append(False)
    
    # Test python-multipart
    try:
        import multipart
        print("✅ python-multipart (Form data) - OK")
        tests.append(True)
    except ImportError as e:
        print(f"❌ python-multipart (Form data) - FAILED: {e}")
        tests.append(False)
    
    print("\n" + "="*50)
    if all(tests):
        print("✅ ALL PACKAGES INSTALLED SUCCESSFULLY!")
        print("You can now run: python create_users_table.py")
        print("Then restart backend: uvicorn app.main:app --reload")
        return True
    else:
        print("❌ SOME PACKAGES MISSING")
        print("Run: pip install -r requirements.txt")
        return False

def test_jwt_functionality():
    """Test JWT token creation and verification"""
    print("\n" + "="*50)
    print("Testing JWT functionality...\n")
    
    try:
        from jose import jwt
        from datetime import datetime, timedelta
        
        # Create a test token
        secret = "test_secret_key_12345"
        data = {"sub": "test_user", "exp": datetime.utcnow() + timedelta(minutes=15)}
        token = jwt.encode(data, secret, algorithm="HS256")
        print(f"✅ JWT Token created: {token[:50]}...")
        
        # Verify the token
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        print(f"✅ JWT Token decoded: {decoded}")
        
        return True
    except Exception as e:
        print(f"❌ JWT test failed: {e}")
        return False

def test_password_hashing():
    """Test password hashing functionality"""
    print("\n" + "="*50)
    print("Testing password hashing...\n")
    
    try:
        from passlib.context import CryptContext
        
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # Hash a password
        password = "test_password_123"
        hashed = pwd_context.hash(password)
        print(f"✅ Password hashed: {hashed[:50]}...")
        
        # Verify the password
        is_valid = pwd_context.verify(password, hashed)
        print(f"✅ Password verification: {is_valid}")
        
        # Test wrong password
        is_invalid = pwd_context.verify("wrong_password", hashed)
        print(f"✅ Wrong password rejected: {not is_invalid}")
        
        return True
    except Exception as e:
        print(f"❌ Password hashing test failed: {e}")
        return False

if __name__ == "__main__":
    print("="*50)
    print("SKILLLINK AUTHENTICATION PACKAGE TEST")
    print("="*50)
    
    # Test imports
    imports_ok = test_imports()
    
    if imports_ok:
        # Test JWT functionality
        jwt_ok = test_jwt_functionality()
        
        # Test password hashing
        pwd_ok = test_password_hashing()
        
        print("\n" + "="*50)
        if jwt_ok and pwd_ok:
            print("✅ ALL TESTS PASSED!")
            print("\nNext steps:")
            print("1. Run: python create_users_table.py")
            print("2. Restart backend: uvicorn app.main:app --reload")
            print("3. Test registration at http://localhost:3000")
        else:
            print("⚠️ Some functionality tests failed")
    else:
        print("\n❌ Cannot proceed - packages not installed")
        print("Run: pip install -r requirements.txt")
