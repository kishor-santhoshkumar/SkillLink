"""
Authentication schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator, ConfigDict
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    """Schema for user registration"""
    username: str = Field(..., min_length=3, max_length=50)
    phone_number: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    email: Optional[str] = None
    role: str = Field(default="worker", pattern="^(worker|company)$")

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username must be alphanumeric (can include _ and -)')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    username_or_phone: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)


class GoogleLoginRequest(BaseModel):
    """Schema for Google OAuth login"""
    token: str = Field(..., description="Google ID token")


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: 'UserResponse'


class UserResponse(BaseModel):
    """Schema for user data in responses"""
    id: int
    username: str
    phone_number: str
    email: Optional[str] = None
    is_google_user: bool
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChangePassword(BaseModel):
    """Schema for changing password"""
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)
    confirm_new_password: str = Field(..., min_length=6)

    @validator('confirm_new_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('New passwords do not match')
        return v
