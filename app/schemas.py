from pydantic import BaseModel, ConfigDict, Field, validator
from typing import Optional, List
from datetime import datetime


class ResumeCreate(BaseModel):
    """
    Schema for creating a new skilled worker profile.
    Only requires the raw input text.
    """
    raw_input: str


class ResumeStructuredCreate(BaseModel):
    """
    Schema for creating a profile from structured form data.
    Used by the Easy Form interface.
    """
    # Basic details
    full_name: str
    phone_number: str
    village_or_city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    
    # Trade details
    primary_trade: str
    years_of_experience: Optional[str] = None
    specializations: Optional[str] = None
    tools_handled: Optional[str] = None
    
    # Work background
    worked_as: Optional[str] = None
    company_name: Optional[str] = None
    project_types: Optional[str] = None
    
    # Service details
    service_type: Optional[str] = None
    availability: Optional[str] = None
    travel_radius: Optional[str] = None
    expected_wage: Optional[str] = None
    own_tools: Optional[bool] = False
    own_vehicle: Optional[bool] = False
    
    # Trust & credibility
    projects_completed: Optional[int] = 0
    reference_available: Optional[bool] = False
    
    # Education
    education_level: Optional[str] = None
    technical_training: Optional[str] = None
    
    # Languages
    languages_spoken: Optional[str] = None
    
    # Resume template selection
    resume_template: Optional[str] = 'executive'


class ResumeResponse(BaseModel):
    """
    Schema for skilled worker professional profile response.
    Returns all fields including AI-extracted data.
    """
    id: int
    raw_input: str
    
    # ============================================================
    # BASIC DETAILS
    # ============================================================
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_photo: Optional[str] = None
    
    # Location details
    village_or_city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    location: Optional[str] = None  # Legacy field
    
    # ============================================================
    # TRADE DETAILS
    # ============================================================
    primary_trade: Optional[str] = None
    years_of_experience: Optional[str] = None
    specializations: Optional[str] = None
    tools_handled: Optional[str] = None
    tools_known: Optional[str] = None  # Legacy field
    
    # ============================================================
    # WORK BACKGROUND
    # ============================================================
    worked_as: Optional[str] = None
    company_name: Optional[str] = None
    project_types: Optional[str] = None
    
    # ============================================================
    # SERVICE DETAILS
    # ============================================================
    service_type: Optional[str] = None
    availability: Optional[str] = None
    travel_radius: Optional[str] = None
    expected_wage: Optional[str] = None
    own_tools: Optional[bool] = None
    own_vehicle: Optional[bool] = None
    
    # ============================================================
    # TRUST & CREDIBILITY
    # ============================================================
    projects_completed: Optional[int] = None
    client_rating: Optional[float] = None
    reference_available: Optional[bool] = None
    average_rating: Optional[float] = None  # Legacy field
    
    # ============================================================
    # EDUCATION
    # ============================================================
    education_level: Optional[str] = None
    technical_training: Optional[str] = None
    
    # ============================================================
    # LANGUAGES
    # ============================================================
    languages_spoken: Optional[str] = None
    languages: Optional[str] = None  # Legacy field
    
    # ============================================================
    # AI-GENERATED CONTENT
    # ============================================================
    professional_summary: Optional[str] = None
    
    # ============================================================
    # QUALITY METRICS
    # ============================================================
    resume_score: Optional[int] = None
    ai_confidence_score: Optional[int] = None
    detected_language: Optional[str] = None
    
    # ============================================================
    # PROFILE VISIBILITY
    # ============================================================
    is_published: Optional[bool] = False
    
    # ============================================================
    # RESUME TEMPLATE
    # ============================================================
    resume_template: Optional[str] = 'executive'
    
    # ============================================================
    # TIMESTAMPS
    # ============================================================
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Enable ORM mode for SQLAlchemy model compatibility (Pydantic v2)
    model_config = ConfigDict(from_attributes=True)


class ResumeScoreResponse(BaseModel):
    """
    Schema for profile scoring response.
    """
    score: int
    feedback: str


# ============================================================
# REVIEW SCHEMAS
# ============================================================

class ReviewCreate(BaseModel):
    """
    Schema for creating a new review.
    """
    client_name: str = Field(..., min_length=1, max_length=255)
    rating: int = Field(..., ge=1, le=5)  # 1-5 stars
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    """
    Schema for review response.
    """
    id: int
    worker_id: int
    client_name: str
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================
# JOB REQUEST SCHEMAS
# ============================================================

class JobRequestCreate(BaseModel):
    """
    Schema for creating a new job request.
    """
    client_name: str = Field(..., min_length=1, max_length=255)
    phone_number: str = Field(..., min_length=10, max_length=50)
    location: str = Field(..., min_length=1, max_length=255)
    required_trade: str = Field(..., min_length=1, max_length=100)
    job_description: str = Field(..., min_length=10)
    budget: Optional[str] = None


class JobRequestResponse(BaseModel):
    """
    Schema for job request response.
    """
    id: int
    client_name: str
    phone_number: str
    location: str
    required_trade: str
    job_description: str
    budget: Optional[str] = None
    status: str
    assigned_worker_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class JobRequestUpdate(BaseModel):
    """
    Schema for updating job request status.
    """
    status: Optional[str] = Field(None, pattern="^(open|assigned|completed)$")
    assigned_worker_id: Optional[int] = None


class PhotoUploadResponse(BaseModel):
    """
    Schema for photo upload response.
    """
    message: str
    photo_url: str



# ============================================================
# COMPANY SCHEMAS
# ============================================================

class CompanyCreate(BaseModel):
    """
    Schema for creating a company profile.
    """
    company_name: str = Field(..., min_length=1, max_length=255)
    company_type: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    contact_person: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    email: Optional[str] = Field(None, max_length=255)


class CompanyUpdate(BaseModel):
    """
    Schema for updating a company profile.
    """
    company_name: Optional[str] = Field(None, min_length=1, max_length=255)
    company_type: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    contact_person: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    email: Optional[str] = Field(None, max_length=255)


class CompanyResponse(BaseModel):
    """
    Schema for company profile response.
    """
    id: int
    user_id: int
    company_name: str
    company_type: Optional[str] = None
    location: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
