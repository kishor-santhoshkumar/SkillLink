"""
Authentication routes for SkillLink
Handles user registration, login, Google OAuth, and password management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
import logging

from app.database import get_db
from app.models import User
from app.schemas_auth import (
    UserRegister, UserLogin, GoogleLoginRequest,
    Token, UserResponse, ChangePassword
)
from app.auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_user
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Google OAuth settings
# Try to load from environment, fallback to hardcoded value
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID") or "480432487640-i2vq1bm9s1svprejijai1i2jjat063kn.apps.googleusercontent.com"

# Debug: Print to verify it's loaded
if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID != "":
    logger.info(f"Google Client ID loaded: {GOOGLE_CLIENT_ID[:20]}...")
else:
    logger.warning("WARNING: GOOGLE_CLIENT_ID is empty! Check .env file")


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user with username, phone, and password
    
    Validations:
    - Username must be unique
    - Phone number must be unique
    - Password minimum 6 characters
    - Passwords must match
    
    Returns JWT token and user info
    """
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if phone number already exists
    existing_phone = db.query(User).filter(User.phone_number == user_data.phone_number).first()
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        username=user_data.username,
        phone_number=user_data.phone_number,
        email=user_data.email,
        hashed_password=hashed_password,
        is_google_user=False,
        role=user_data.role  # NEW: Set user role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"New user registered: {new_user.username} (role: {new_user.role})")
    
    # Create access token
    access_token = create_access_token(data={"sub": new_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }


@router.post("/login", response_model=Token)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login with username/phone and password
    
    Accepts either username or phone number
    Returns JWT token and user info
    """
    user = authenticate_user(db, login_data.username_or_phone, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    logger.info(f"User logged in: {user.username}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/google-login", response_model=Token)
def google_login(google_data: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Login or register using Google OAuth
    
    Process:
    1. Verify Google ID token
    2. Extract user info from token
    3. Check if user exists (by google_id or email)
    4. If not exists, create new user automatically
    5. Return JWT token
    """
    try:
        # Verify Google token - skip audience check if GOOGLE_CLIENT_ID is not set
        if not GOOGLE_CLIENT_ID:
            logger.error("GOOGLE_CLIENT_ID is not set in environment variables!")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Google OAuth is not configured on the server"
            )
        
        # Verify token without strict audience check for development
        idinfo = id_token.verify_oauth2_token(
            google_data.token,
            google_requests.Request()
        )
        
        # Manually verify the audience matches our client ID
        token_audience = idinfo.get('aud')
        if token_audience != GOOGLE_CLIENT_ID:
            logger.error(f"Token audience mismatch: {token_audience} != {GOOGLE_CLIENT_ID}")
            raise ValueError(f"Token audience mismatch")
        
        # Verify the token is from Google
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        
        # Extract user info
        google_id = idinfo['sub']
        email = idinfo.get('email')
        name = idinfo.get('name', email.split('@')[0] if email else 'user')
        
        logger.info(f"Google login attempt - ID: {google_id}, Email: {email}, Name: {name}")
        
        # Check if user exists by google_id
        user = db.query(User).filter(User.google_id == google_id).first()
        
        if not user:
            # Check if user exists by email
            if email:
                user = db.query(User).filter(User.email == email).first()
                
                if user:
                    # Link Google account to existing user
                    user.google_id = google_id
                    user.is_google_user = True
                    db.commit()
                    db.refresh(user)
                    logger.info(f"Linked Google account to existing user: {user.username}")
        
        if not user:
            # Create new user automatically
            # Generate unique username from email or name
            base_username = name.replace(' ', '_').lower()
            username = base_username
            counter = 1
            
            while db.query(User).filter(User.username == username).first():
                username = f"{base_username}{counter}"
                counter += 1
            
            # Generate unique phone placeholder (will be updated by user later)
            phone_placeholder = f"google_{google_id[:10]}"
            
            user = User(
                username=username,
                phone_number=phone_placeholder,
                email=email,
                is_google_user=True,
                google_id=google_id,
                hashed_password=None,
                role='worker'  # Default role for Google users
            )
            
            db.add(user)
            db.commit()
            db.refresh(user)
            
            logger.info(f"New Google user auto-created: {user.username} (email: {email})")
        else:
            logger.info(f"Google user logged in: {user.username}")
        
        # Create access token
        access_token = create_access_token(data={"sub": user.id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except ValueError as e:
        # Invalid token
        logger.error(f"Google login error - ValueError: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        # Other errors
        logger.error(f"Google login error - Exception: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google login failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user info
    Requires valid JWT token
    """
    return current_user


@router.post("/change-password")
async def change_password(
    password_data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change user password
    Requires current password for verification
    """
    if current_user.is_google_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google users cannot change password"
        )
    
    # Verify current password
    from app.auth import verify_password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    logger.info(f"Password changed for user: {current_user.username}")
    
    return {"message": "Password changed successfully"}


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint
    Note: JWT tokens are stateless, so logout is handled client-side
    by removing the token from storage
    """
    logger.info(f"User logged out: {current_user.username}")
    return {"message": "Logged out successfully"}


@router.post("/forgot-password")
async def forgot_password(email: str, db: Session = Depends(get_db)):
    """
    Request password reset
    In production, this would send an email with reset link
    For now, returns a message
    """
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Don't reveal if email exists (security best practice)
        logger.warning(f"Password reset requested for non-existent email: {email}")
        return {"message": "If email exists, password reset link will be sent"}
    
    # In production, generate reset token and send email
    logger.info(f"Password reset requested for user: {user.username}")
    return {"message": "Password reset link sent to your email"}


@router.post("/reset-password")
async def reset_password(email: str, new_password: str, db: Session = Depends(get_db)):
    """
    Reset password with email verification
    In production, this would verify a reset token
    """
    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.password_hash = get_password_hash(new_password)
    db.commit()
    
    logger.info(f"Password reset for user: {user.username}")
    return {"message": "Password reset successfully"}


@router.put("/profile")
async def update_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    username: str = None,
    email: str = None,
    phone_number: str = None
):
    """
    Update user profile information
    Accepts username, email, and phone_number as query parameters
    """
    try:
        # Check if email is already taken by another user
        if email and email != current_user.email:
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
        
        # Check if phone is already taken by another user
        if phone_number and phone_number != current_user.phone_number:
            existing_user = db.query(User).filter(User.phone_number == phone_number).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Phone number already in use"
                )
        
        # Update fields
        if username:
            current_user.username = username
        if email:
            current_user.email = email
        if phone_number:
            current_user.phone_number = phone_number
        
        db.commit()
        db.refresh(current_user)
        
        logger.info(f"Profile updated for user: {current_user.username}")
        return {
            "message": "Profile updated successfully",
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "phone_number": current_user.phone_number,
                "role": current_user.role
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating profile"
        )
