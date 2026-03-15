from sqlalchemy.orm import Session
from app.models import Resume
from typing import List, Optional


def create_resume(
    db: Session,
    raw_input: str,
    user_id: Optional[int] = None,
    full_name: Optional[str] = None,
    phone_number: Optional[str] = None,
    village_or_city: Optional[str] = None,
    district: Optional[str] = None,
    state: Optional[str] = None,
    primary_trade: Optional[str] = None,
    years_of_experience: Optional[str] = None,
    specializations: Optional[str] = None,
    tools_handled: Optional[str] = None,
    worked_as: Optional[str] = None,
    company_name: Optional[str] = None,
    project_types: Optional[str] = None,
    service_type: Optional[str] = None,
    availability: Optional[str] = None,
    travel_radius: Optional[str] = None,
    expected_wage: Optional[str] = None,
    own_tools: Optional[bool] = None,
    own_vehicle: Optional[bool] = None,
    projects_completed: Optional[int] = None,
    reference_available: Optional[bool] = None,
    education_level: Optional[str] = None,
    technical_training: Optional[str] = None,
    languages_spoken: Optional[str] = None,
    professional_summary: Optional[str] = None,
    resume_score: Optional[int] = None,
    ai_confidence_score: Optional[int] = None,
    detected_language: Optional[str] = None,
    # Legacy fields for backward compatibility
    contact_number: Optional[str] = None,
    location: Optional[str] = None,
    tools_known: Optional[str] = None,
    languages: Optional[str] = None
) -> Resume:
    """
    Create a new skilled worker professional profile in the database.
    
    Supports both new fields and legacy fields for backward compatibility.
    
    Args:
        db: Database session
        raw_input: Raw input text
        
        Basic Details:
        full_name: Worker's full name
        phone_number: Phone number
        village_or_city: Village or city name
        district: District name
        state: State name
        
        Trade Details:
        primary_trade: Main trade (Carpenter, Plumber, etc.)
        years_of_experience: Years of experience
        specializations: Specific skills within trade
        tools_handled: Tools and equipment handled
        
        Work Background:
        worked_as: Type of work (self-employed/company worker)
        company_name: Company name if applicable
        project_types: Types of projects worked on
        
        Service Details:
        service_type: Service type (daily wage, contract, per project)
        availability: Availability (full-time, part-time)
        travel_radius: Travel radius
        expected_wage: Expected wage/rate
        own_tools: Has own tools
        own_vehicle: Has own vehicle
        
        Trust & Credibility:
        projects_completed: Number of projects completed
        reference_available: Has references available
        
        Education:
        education_level: Education level
        technical_training: Technical training details
        
        Languages:
        languages_spoken: Languages spoken
        
        AI-Generated:
        professional_summary: AI-generated summary
        resume_score: Quality score (0-100)
        ai_confidence_score: AI confidence score (0-100)
        detected_language: Detected input language
        
        Legacy Fields (for backward compatibility):
        contact_number, location, tools_known, languages
    
    Returns:
        Created Resume object
    """
    # Handle legacy field mapping
    if contact_number and not phone_number:
        phone_number = contact_number
    if location and not village_or_city:
        village_or_city = location
    if tools_known and not tools_handled:
        tools_handled = tools_known
    if languages and not languages_spoken:
        languages_spoken = languages
    
    db_resume = Resume(
        raw_input=raw_input,
        user_id=user_id,
        # Basic details
        full_name=full_name,
        phone_number=phone_number,
        village_or_city=village_or_city,
        district=district,
        state=state,
        # Trade details
        primary_trade=primary_trade,
        years_of_experience=years_of_experience,
        specializations=specializations,
        tools_handled=tools_handled,
        # Work background
        worked_as=worked_as,
        company_name=company_name,
        project_types=project_types,
        # Service details
        service_type=service_type,
        availability=availability,
        travel_radius=travel_radius,
        expected_wage=expected_wage,
        own_tools=own_tools,
        own_vehicle=own_vehicle,
        # Trust & credibility
        projects_completed=projects_completed,
        reference_available=reference_available,
        # Education
        education_level=education_level,
        technical_training=technical_training,
        # Languages
        languages_spoken=languages_spoken,
        # AI-generated content
        professional_summary=professional_summary,
        # Quality metrics
        resume_score=resume_score,
        ai_confidence_score=ai_confidence_score,
        detected_language=detected_language,
        # Legacy fields (for backward compatibility - these are actual columns in DB)
        contact_number=phone_number,  # Maps to contact_number column (legacy)
        location=village_or_city,  # Maps to location column (legacy)
        tools_known=tools_handled,  # Maps to tools_known column (legacy)
        languages=languages_spoken  # Maps to languages column (legacy)
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume


def get_resume_by_id(db: Session, resume_id: int) -> Optional[Resume]:
    """
    Retrieve a resume by its ID.
    
    Args:
        db: Database session
        resume_id: ID of the resume to retrieve
    
    Returns:
        Resume object if found, None otherwise
    """
    return db.query(Resume).filter(Resume.id == resume_id).first()


def get_all_resumes(db: Session) -> List[Resume]:
    """
    Retrieve all resumes ordered by creation date (newest first).
    
    Args:
        db: Database session
    
    Returns:
        List of Resume objects
    """
    return db.query(Resume).order_by(Resume.created_at.desc()).all()
