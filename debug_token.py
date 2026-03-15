"""
Debug JWT token to see what's wrong
"""
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

# Get the secret key from environment
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"

print(f"SECRET_KEY from env: {SECRET_KEY}")
print()

# Token from the test
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImV4cCI6MTc3Mjk4ODc0Nn0.IL1WDzTluE__G3c1bbefNzYzb9B3WbBAg5tzNmHF9Zc"

try:
    # Try to decode without verification first
    unverified = jwt.get_unverified_claims(token)
    print("Unverified token payload:")
    print(unverified)
    print()
    
    # Try to decode with verification
    verified = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    print("✓ Token verified successfully!")
    print("Verified payload:")
    print(verified)
except JWTError as e:
    print(f"✗ Token verification failed: {e}")
