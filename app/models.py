from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    """
    User model for authentication
    Supports both regular registration and Google OAuth
    Supports dual roles: worker and company
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    phone_number = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=True)  # Null for Google users
    is_google_user = Column(Boolean, default=False)
    google_id = Column(String(255), nullable=True, unique=True)  # Google user ID
    role = Column(String(20), default="worker")  # "worker" or "company"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    resumes = relationship("Resume", back_populates="user")
    company = relationship("Company", back_populates="user", uselist=False)


class Resume(Base):
    """
    Rural & Urban Skilled Worker Professional Profile model.
    Designed for carpenters, plumbers, electricians, mechanics, masons, painters, welders, etc.
    Supports semi-literate and illiterate workers with structured data collection.
    """
    __tablename__ = "resumes"

    # Primary key with index
    id = Column(Integer, primary_key=True, index=True)
    
    # User relationship (owner of this resume)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True, index=True)
    user = relationship("User", back_populates="resumes")
    
    # Raw input (required for AI extraction)
    raw_input = Column(Text, nullable=False)
    
    # ============================================================
    # BASIC DETAILS
    # ============================================================
    full_name = Column(String(255), nullable=True)
    phone_number = Column(String(50), nullable=True, index=True)  # Indexed for quick lookup
    profile_photo = Column(String(500), nullable=True)  # File path or URL
    
    # Location details (rural/urban)
    village_or_city = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    state = Column(String(255), nullable=True)
    
    # Legacy fields for backward compatibility
    contact_number = Column(String(50), nullable=True)  # Will be deprecated - use phone_number
    location = Column(String(255), nullable=True)  # Will be deprecated - use village_or_city
    
    # ============================================================
    # TRADE DETAILS
    # ============================================================
    primary_trade = Column(String(100), nullable=True, index=True)  # Carpenter, Plumber, Electrician, etc.
    years_of_experience = Column(String(50), nullable=True)
    specializations = Column(Text, nullable=True)  # Specific skills within trade
    tools_handled = Column(Text, nullable=True)  # Renamed from tools_known for clarity
    
    # Legacy field for backward compatibility
    tools_known = Column(Text, nullable=True)  # Will be deprecated
    
    # ============================================================
    # WORK BACKGROUND
    # ============================================================
    worked_as = Column(String(100), nullable=True)  # self-employed / company worker / contractor
    company_name = Column(String(255), nullable=True)  # If worked for company
    project_types = Column(Text, nullable=True)  # houses, apartments, factories, commercial buildings
    
    # ============================================================
    # SERVICE DETAILS
    # ============================================================
    service_type = Column(String(100), nullable=True)  # daily wage, contract, per project, hourly
    availability = Column(String(100), nullable=True)  # full-time, part-time, weekends
    travel_radius = Column(String(100), nullable=True)  # 5km, 10km, 20km, city-wide, anywhere
    expected_wage = Column(String(100), nullable=True)
    own_tools = Column(Boolean, nullable=True, default=False)  # Has own tools
    own_vehicle = Column(Boolean, nullable=True, default=False)  # Has own vehicle
    
    # ============================================================
    # TRUST & CREDIBILITY
    # ============================================================
    projects_completed = Column(Integer, nullable=True)
    client_rating = Column(Float, nullable=True, default=0.0)  # Renamed from average_rating
    reference_available = Column(Boolean, nullable=True, default=False)  # Has references
    
    # Verification badges
    is_email_verified = Column(Boolean, nullable=False, default=False)  # Email verified
    is_phone_verified = Column(Boolean, nullable=False, default=False)  # Phone verified
    is_identity_verified = Column(Boolean, nullable=False, default=False)  # ID verified
    is_background_checked = Column(Boolean, nullable=False, default=False)  # Background check passed
    
    # ============================================================
    # PROFILE VISIBILITY
    # ============================================================
    is_published = Column(Boolean, nullable=False, default=False)  # Profile published for companies to see
    
    # Legacy field for backward compatibility
    average_rating = Column(Float, nullable=True, default=0.0)  # Will be deprecated
    
    # ============================================================
    # EDUCATION
    # ============================================================
    education_level = Column(String(100), nullable=True)  # illiterate, primary, secondary, high school, diploma, degree
    technical_training = Column(String(255), nullable=True)  # ITI, polytechnic, apprenticeship, self-taught
    
    # ============================================================
    # LANGUAGES
    # ============================================================
    languages_spoken = Column(Text, nullable=True)  # Renamed from languages for clarity
    
    # Legacy field for backward compatibility
    languages = Column(Text, nullable=True)  # Will be deprecated
    
    # ============================================================
    # AI-GENERATED CONTENT
    # ============================================================
    professional_summary = Column(Text, nullable=True)
    
    # ============================================================
    # QUALITY METRICS
    # ============================================================
    resume_score = Column(Integer, nullable=True)  # 0-100 score
    ai_confidence_score = Column(Integer, nullable=True)  # AI confidence 0-100
    detected_language = Column(String(50), nullable=True)  # Detected input language
    
    # ============================================================
    # TIMESTAMPS
    # ============================================================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # ============================================================
    # RESUME TEMPLATE SELECTION
    # ============================================================
    resume_template = Column(String(50), nullable=False, default='executive')
    # Options: 'executive', 'modern', 'sidebar', 'construction', 'compact'
    
    # ============================================================
    # RELATIONSHIPS
    # ============================================================
    reviews = relationship("Review", back_populates="worker", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Resume(id={self.id}, full_name='{self.full_name}', trade='{self.primary_trade}')>"
    
    @property
    def is_verified_worker(self) -> bool:
        """
        Check if worker qualifies for 'Verified Worker' badge.
        Criteria: 20+ projects completed AND rating > 4.0
        """
        rating = self.client_rating or self.average_rating or 0.0
        projects = self.projects_completed or 0
        return projects >= 20 and rating >= 4.0


class Review(Base):
    """
    Review model for worker ratings and feedback.
    Allows clients to rate and review workers.
    """
    __tablename__ = "reviews"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to worker
    worker_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    
    # Review details
    client_name = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    worker = relationship("Resume", back_populates="reviews")
    
    def __repr__(self):
        return f"<Review(id={self.id}, worker_id={self.worker_id}, rating={self.rating})>"


class JobRequest(Base):
    """
    Job Request model for clients posting job opportunities.
    Workers can view and apply for jobs.
    """
    __tablename__ = "job_requests"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Company/User who posted the job
    company_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    
    # Client information
    client_name = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=False)
    location = Column(String(255), nullable=False)
    
    # Job details
    required_trade = Column(String(100), nullable=False)  # Carpenter, Plumber, etc.
    job_description = Column(Text, nullable=False)
    budget = Column(String(100), nullable=True)
    
    # Status tracking
    status = Column(String(50), nullable=False, default="open")  # open, closed
    assigned_worker_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)  # Legacy field
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    assigned_worker = relationship("Resume", foreign_keys=[assigned_worker_id])
    company_user = relationship("User", foreign_keys=[company_id])
    
    def __repr__(self):
        return f"<JobRequest(id={self.id}, trade='{self.required_trade}', status='{self.status}')>"



class Company(Base):
    """
    Company model for businesses looking to hire skilled workers.
    Linked to User model with role='company'.
    """
    __tablename__ = "companies"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Company details
    company_name = Column(String(255), nullable=False)
    company_type = Column(String(100), nullable=True)  # Construction, Real Estate, Manufacturing, etc.
    location = Column(String(255), nullable=True)
    contact_person = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="company")
    
    def __repr__(self):
        return f"<Company(id={self.id}, name='{self.company_name}')>"


class TemplateAnalytics(Base):
    """
    Analytics model for tracking template usage and user behavior.
    Helps understand which templates are popular and optimize recommendations.
    """
    __tablename__ = "template_analytics"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to resume
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Template information
    template_id = Column(String(50), nullable=False, index=True)  # executive, modern, sidebar, etc.
    
    # Action type
    action_type = Column(String(50), nullable=False, index=True)  # selected, previewed, downloaded, saved
    
    # Metadata
    user_agent = Column(Text, nullable=True)
    session_id = Column(String(100), nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    def __repr__(self):
        return f"<TemplateAnalytics(id={self.id}, resume_id={self.resume_id}, template='{self.template_id}', action='{self.action_type}')>"


class JobApplication(Base):
    """
    Job Application model for workers applying to jobs.
    Tracks application status and creates notifications.
    """
    __tablename__ = "job_applications"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    job_id = Column(Integer, ForeignKey("job_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    worker_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Status tracking
    status = Column(String(50), nullable=False, default="pending")  # pending, accepted, rejected
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    job = relationship("JobRequest", foreign_keys=[job_id])
    worker = relationship("Resume", foreign_keys=[worker_id])
    
    def __repr__(self):
        return f"<JobApplication(id={self.id}, job_id={self.job_id}, worker_id={self.worker_id}, status='{self.status}')>"


class Notification(Base):
    """
    Notification model for user notifications.
    Supports job application notifications and status updates.
    """
    __tablename__ = "notifications"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Notification details
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # job_application, application_accepted, application_rejected
    related_id = Column(Integer, nullable=True)  # job_id or application_id
    
    # Read status
    is_read = Column(Boolean, nullable=False, default=False)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    
    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.user_id}, type='{self.type}', is_read={self.is_read})>"


class ApplicationLog(Base):
    """
    Application Log model for tracking email webhook triggers.
    Logs all attempts to send email notifications via n8n.
    """
    __tablename__ = "application_logs"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    worker_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=True, index=True)
    job_id = Column(Integer, ForeignKey("job_requests.id", ondelete="CASCADE"), nullable=True, index=True)
    application_id = Column(Integer, ForeignKey("job_applications.id", ondelete="CASCADE"), nullable=True, index=True)
    
    # Webhook status
    email_trigger_status = Column(String(100), nullable=False)
    webhook_response_code = Column(Integer, nullable=True)
    webhook_response_body = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    worker = relationship("Resume", foreign_keys=[worker_id])
    job = relationship("JobRequest", foreign_keys=[job_id])
    application = relationship("JobApplication", foreign_keys=[application_id])
    
    def __repr__(self):
        return f"<ApplicationLog(id={self.id}, status='{self.email_trigger_status}', code={self.webhook_response_code})>"
