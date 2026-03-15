from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import logging
import uuid
from pathlib import Path

from app.schemas import ResumeCreate, ResumeStructuredCreate, ResumeResponse, ResumeScoreResponse, PhotoUploadResponse
from app.crud import create_resume, get_resume_by_id, get_all_resumes
from app.database import get_db
from app.auth import get_current_user
from app.models import User
from app.services import (
    generate_structured_resume,
    detect_language,
    calculate_resume_score,
    generate_formatted_resume,
    generate_resume_pdf
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Photo upload configuration
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


# ============================================================
# ANALYTICS HELPER FUNCTIONS
# ============================================================

def track_template_action(
    db: Session,
    resume_id: int,
    template_id: str,
    action_type: str,
    user_agent: str = None
):
    """
    Track template-related actions for analytics.
    
    Args:
        db: Database session
        resume_id: ID of the resume
        template_id: Template identifier
        action_type: Type of action (selected, previewed, downloaded, saved)
        user_agent: User agent string (optional)
    """
    try:
        from app.models import TemplateAnalytics
        
        analytics = TemplateAnalytics(
            resume_id=resume_id,
            template_id=template_id,
            action_type=action_type,
            user_agent=user_agent
        )
        db.add(analytics)
        db.commit()
        logger.info(f"Tracked {action_type} action for template {template_id} on resume {resume_id}")
    except Exception as e:
        logger.error(f"Error tracking analytics: {e}")
        # Don't fail the request if analytics fails
        db.rollback()



@router.post("/", response_model=ResumeResponse, status_code=201)
def create_new_resume(
    resume: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new skilled worker profile with advanced AI-powered processing.
    
    Requires authentication. Automatically links profile to logged-in user.
    
    Features:
    - Multi-language support (English, Tamil, Hindi, mixed)
    - Automatic language detection
    - AI-powered extraction with confidence scoring
    - Profile quality scoring
    - Comprehensive field extraction
    
    The system extracts:
    - Basic info: name, contact, location
    - Trade info: primary trade, specializations, years of experience
    - Service details: service type, availability, travel radius
    - Work details: projects completed, tools known, expected wage
    - Languages known
    - AI-generated professional summary
    
    Returns structured skilled worker profile with quality metrics.
    """
    try:
        # Detect input language
        detected_lang = detect_language(resume.raw_input)
        logger.info(f"Processing resume in language: {detected_lang}")
        
        # Generate structured data from raw resume text using AI
        extracted_data, ai_confidence = generate_structured_resume(resume.raw_input)
        
        # Calculate resume quality score
        score_result = calculate_resume_score(extracted_data)
        resume_score = score_result["score"]
        
        logger.info(f"Resume score: {resume_score}/100, AI confidence: {ai_confidence}%")
        
        # Store skilled worker profile with all extracted fields and metrics
        db_resume = create_resume(
            db=db,
            raw_input=resume.raw_input,
            user_id=current_user.id,  # Link to authenticated user
            # Basic details
            full_name=extracted_data.get("full_name"),
            phone_number=extracted_data.get("phone_number"),
            village_or_city=extracted_data.get("village_or_city"),
            district=extracted_data.get("district"),
            state=extracted_data.get("state"),
            # Trade details
            primary_trade=extracted_data.get("primary_trade"),
            years_of_experience=extracted_data.get("years_of_experience"),
            specializations=extracted_data.get("specializations"),
            tools_handled=extracted_data.get("tools_handled"),
            # Work background
            worked_as=extracted_data.get("worked_as"),
            company_name=extracted_data.get("company_name"),
            project_types=extracted_data.get("project_types"),
            # Service details
            service_type=extracted_data.get("service_type"),
            availability=extracted_data.get("availability"),
            travel_radius=extracted_data.get("travel_radius"),
            expected_wage=extracted_data.get("expected_wage"),
            own_tools=extracted_data.get("own_tools"),
            own_vehicle=extracted_data.get("own_vehicle"),
            # Trust & credibility
            projects_completed=extracted_data.get("projects_completed"),
            reference_available=extracted_data.get("reference_available"),
            # Education
            education_level=extracted_data.get("education_level"),
            technical_training=extracted_data.get("technical_training"),
            # Languages
            languages_spoken=extracted_data.get("languages_spoken"),
            # AI-generated content
            professional_summary=extracted_data.get("professional_summary"),
            # Quality metrics
            resume_score=resume_score,
            ai_confidence_score=ai_confidence,
            detected_language=detected_lang,
            # Legacy fields for backward compatibility
            contact_number=extracted_data.get("contact_number"),
            location=extracted_data.get("location"),
            tools_known=extracted_data.get("tools_known"),
            languages=extracted_data.get("languages")
        )
        
        return db_resume
        
    except Exception as e:
        logger.error(f"Error creating resume: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")


@router.post("/structured", response_model=ResumeResponse, status_code=201)
def create_resume_from_form(
    resume: ResumeStructuredCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new skilled worker profile from structured form data.
    
    Requires authentication. Automatically links profile to logged-in user.
    
    This endpoint is used by the Easy Form interface where users
    fill out structured fields instead of providing raw text.
    
    Features:
    - Direct field mapping (no AI extraction needed)
    - Generates professional summary from structured data
    - Calculates profile quality score
    - Faster processing than text-based input
    
    Returns structured skilled worker profile with quality metrics.
    """
    try:
        # Generate a professional summary from the structured data
        summary_parts = []
        
        if resume.primary_trade and resume.years_of_experience:
            summary_parts.append(f"Experienced {resume.primary_trade} with {resume.years_of_experience} of hands-on experience")
        elif resume.primary_trade:
            summary_parts.append(f"Skilled {resume.primary_trade}")
        
        if resume.specializations:
            summary_parts.append(f"specializing in {resume.specializations}")
        
        if resume.village_or_city:
            location_str = resume.village_or_city
            if resume.district:
                location_str += f", {resume.district}"
            if resume.state:
                location_str += f", {resume.state}"
            summary_parts.append(f"Based in {location_str}")
        
        if resume.own_tools and resume.own_vehicle:
            summary_parts.append("Equipped with own tools and vehicle for efficient service delivery")
        elif resume.own_tools:
            summary_parts.append("Equipped with own professional tools")
        elif resume.own_vehicle:
            summary_parts.append("Has own vehicle for travel")
        
        if resume.service_type:
            summary_parts.append(f"Available for {resume.service_type.lower()} work")
        
        professional_summary = ". ".join(summary_parts) + "." if summary_parts else "Skilled worker profile."
        
        # Create raw_input from structured data for record keeping
        raw_input_parts = [
            f"Name: {resume.full_name}",
            f"Phone: {resume.phone_number}",
            f"Trade: {resume.primary_trade}"
        ]
        
        if resume.village_or_city:
            raw_input_parts.append(f"Location: {resume.village_or_city}")
        if resume.years_of_experience:
            raw_input_parts.append(f"Experience: {resume.years_of_experience}")
        if resume.specializations:
            raw_input_parts.append(f"Skills: {resume.specializations}")
        
        raw_input = " | ".join(raw_input_parts)
        
        # Calculate resume quality score
        extracted_data = {
            "full_name": resume.full_name,
            "phone_number": resume.phone_number,
            "village_or_city": resume.village_or_city,
            "district": resume.district,
            "state": resume.state,
            "primary_trade": resume.primary_trade,
            "years_of_experience": resume.years_of_experience,
            "specializations": resume.specializations,
            "tools_handled": resume.tools_handled,
            "worked_as": resume.worked_as,
            "company_name": resume.company_name,
            "project_types": resume.project_types,
            "service_type": resume.service_type,
            "availability": resume.availability,
            "travel_radius": resume.travel_radius,
            "expected_wage": resume.expected_wage,
            "own_tools": resume.own_tools,
            "own_vehicle": resume.own_vehicle,
            "projects_completed": resume.projects_completed,
            "reference_available": resume.reference_available,
            "education_level": resume.education_level,
            "technical_training": resume.technical_training,
            "languages_spoken": resume.languages_spoken,
            "professional_summary": professional_summary
        }
        
        score_result = calculate_resume_score(extracted_data)
        resume_score = score_result["score"]
        
        logger.info(f"Creating structured resume - Score: {resume_score}/100")
        
        # Store skilled worker profile
        db_resume = create_resume(
            db=db,
            raw_input=raw_input,
            user_id=current_user.id,  # Link to authenticated user
            # Basic details
            full_name=resume.full_name,
            phone_number=resume.phone_number,
            village_or_city=resume.village_or_city,
            district=resume.district,
            state=resume.state,
            # Trade details
            primary_trade=resume.primary_trade,
            years_of_experience=resume.years_of_experience,
            specializations=resume.specializations,
            tools_handled=resume.tools_handled,
            # Work background
            worked_as=resume.worked_as,
            company_name=resume.company_name,
            project_types=resume.project_types,
            # Service details
            service_type=resume.service_type,
            availability=resume.availability,
            travel_radius=resume.travel_radius,
            expected_wage=resume.expected_wage,
            own_tools=resume.own_tools,
            own_vehicle=resume.own_vehicle,
            # Trust & credibility
            projects_completed=resume.projects_completed,
            reference_available=resume.reference_available,
            # Education
            education_level=resume.education_level,
            technical_training=resume.technical_training,
            # Languages
            languages_spoken=resume.languages_spoken,
            # AI-generated content
            professional_summary=professional_summary,
            # Quality metrics
            resume_score=resume_score,
            ai_confidence_score=100,  # 100% confidence for structured data
            detected_language="english"
        )
        
        return db_resume
        
    except Exception as e:
        logger.error(f"Error creating structured resume: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific resume by ID.
    
    Returns complete resume data including:
    - All extracted fields
    - Quality score
    - AI confidence score
    - Detected language
    """
    db_resume = get_resume_by_id(db=db, resume_id=resume_id)
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return db_resume


@router.get("/", response_model=List[ResumeResponse])
def get_resumes(db: Session = Depends(get_db)):
    """
    Get all resumes ordered by creation date (newest first).
    
    Returns list of all resumes with complete data and metrics.
    """
    resumes = get_all_resumes(db=db)
    return resumes


@router.get("/{resume_id}/score", response_model=ResumeScoreResponse)
def get_resume_score(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Get quality score and feedback for a specific resume.
    
    Returns:
    - score: Quality score (0-100)
    - feedback: Actionable feedback for improvement
    """
    db_resume = get_resume_by_id(db=db, resume_id=resume_id)
    if db_resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Prepare data for scoring
    resume_data = {
        "full_name": db_resume.full_name,
        "primary_trade": db_resume.primary_trade,
        "years_of_experience": db_resume.years_of_experience,
        "specializations": db_resume.specializations,
        "contact_number": db_resume.contact_number,
        "location": db_resume.location,
        "projects_completed": db_resume.projects_completed,
        "service_type": db_resume.service_type
    }
    
    score_result = calculate_resume_score(resume_data)
    return score_result


@router.get("/{resume_id}/download")
def download_resume_pdf(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Download resume as a professionally formatted PDF.
    
    Generates a clean, well-structured PDF document with:
    - Professional formatting
    - Clear sections
    - Proper spacing and typography
    
    Returns PDF file for download.
    """
    try:
        # Fetch resume from database
        db_resume = get_resume_by_id(db=db, resume_id=resume_id)
        if db_resume is None:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Prepare skilled worker profile data with ALL fields
        resume_data = {
            # Basic details
            "full_name": db_resume.full_name,
            "phone_number": db_resume.phone_number,
            "profile_photo": db_resume.profile_photo,
            "village_or_city": db_resume.village_or_city,
            "district": db_resume.district,
            "state": db_resume.state,
            
            # Trade details
            "primary_trade": db_resume.primary_trade,
            "years_of_experience": db_resume.years_of_experience,
            "specializations": db_resume.specializations,
            "tools_handled": db_resume.tools_handled,
            
            # Work background
            "worked_as": db_resume.worked_as,
            "company_name": db_resume.company_name,
            "project_types": db_resume.project_types,
            
            # Service details
            "service_type": db_resume.service_type,
            "availability": db_resume.availability,
            "travel_radius": db_resume.travel_radius,
            "expected_wage": db_resume.expected_wage,
            "own_tools": db_resume.own_tools,
            "own_vehicle": db_resume.own_vehicle,
            
            # Trust & credibility
            "projects_completed": db_resume.projects_completed,
            "client_rating": db_resume.client_rating,
            "reference_available": db_resume.reference_available,
            
            # Education
            "education_level": db_resume.education_level,
            "technical_training": db_resume.technical_training,
            
            # Languages
            "languages_spoken": db_resume.languages_spoken,
            
            # AI-generated content
            "professional_summary": db_resume.professional_summary,
            "structured_work_experience": [],  # This would need to be stored separately or parsed
            
            # Template selection
            "resume_template": db_resume.resume_template or 'executive',
            
            # Legacy fields for backward compatibility
            "contact_number": db_resume.contact_number,
            "location": db_resume.location,
            "tools_known": db_resume.tools_known,
            "languages": db_resume.languages,
            "average_rating": db_resume.average_rating
        }
        
        # Generate formatted resume text
        formatted_resume = generate_formatted_resume(resume_data)
        
        # Create temp directory if it doesn't exist
        if not os.path.exists("temp"):
            os.makedirs("temp")
        
        # Generate PDF
        pdf_filename = f"resume_{resume_id}.pdf"
        pdf_path = os.path.join("temp", pdf_filename)
        generate_resume_pdf(formatted_resume, pdf_path, resume_data)
        
        # Return PDF as downloadable file
        return FileResponse(
            path=pdf_path,
            filename=f"{db_resume.full_name or 'Resume'}_{resume_id}.pdf",
            media_type="application/pdf"
        )
        
    except Exception as e:
        logger.error(f"Error generating PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")



@router.post("/{resume_id}/upload-photo", response_model=PhotoUploadResponse)
async def upload_profile_photo(
    resume_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload profile photo for a worker.
    
    Validates:
    - File type (jpg, jpeg, png only)
    - File size (max 5MB)
    - Worker exists
    
    Saves file with unique name to prevent overwriting.
    
    Args:
        resume_id: ID of the worker profile
        file: Image file to upload
    
    Returns:
        Success message and photo URL
    """
    try:
        # Check if worker exists
        worker = get_resume_by_id(db, resume_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker profile not found")
        
        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Read file content
        content = await file.read()
        
        # Validate file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Update database with file path
        worker.profile_photo = str(file_path)
        db.commit()
        
        logger.info(f"Photo uploaded for worker {resume_id}: {unique_filename}")
        
        return {
            "message": "Photo uploaded successfully",
            "photo_url": f"/uploads/{unique_filename}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading photo: {e}")
        raise HTTPException(status_code=500, detail=f"Error uploading photo: {str(e)}")


@router.get("/{resume_id}/photo")
def get_profile_photo(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Get profile photo for a worker.
    
    Args:
        resume_id: ID of the worker profile
    
    Returns:
        Image file or 404 if no photo
    """
    try:
        worker = get_resume_by_id(db, resume_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker profile not found")
        
        if not worker.profile_photo:
            raise HTTPException(status_code=404, detail="No profile photo found")
        
        photo_path = Path(worker.profile_photo)
        if not photo_path.exists():
            raise HTTPException(status_code=404, detail="Photo file not found")
        
        return FileResponse(photo_path)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving photo: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving photo: {str(e)}")


# ============================================================
# PROFILE PUBLISHING ENDPOINTS
# ============================================================

@router.patch("/{resume_id}/publish")
def publish_profile(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Publish worker profile to make it visible to companies.
    
    Args:
        resume_id: ID of the worker profile
    
    Returns:
        Success message with updated profile status
    """
    from app.models import Resume
    
    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )
    
    # Check if already published
    if resume.is_published:
        return {
            "message": "Profile is already published",
            "is_published": True
        }
    
    # Publish the profile
    resume.is_published = True
    db.commit()
    db.refresh(resume)
    
    logger.info(f"Profile {resume_id} published by worker")
    
    return {
        "message": "Profile published successfully! Companies can now see your profile.",
        "is_published": True
    }


@router.patch("/{resume_id}/unpublish")
def unpublish_profile(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Unpublish worker profile to hide it from companies.
    
    Args:
        resume_id: ID of the worker profile
    
    Returns:
        Success message with updated profile status
    """
    from app.models import Resume
    
    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )
    
    # Check if already unpublished
    if not resume.is_published:
        return {
            "message": "Profile is already unpublished",
            "is_published": False
        }
    
    # Unpublish the profile
    resume.is_published = False
    db.commit()
    db.refresh(resume)
    
    logger.info(f"Profile {resume_id} unpublished by worker")
    
    return {
        "message": "Profile unpublished successfully! Companies can no longer see your profile.",
        "is_published": False
    }


@router.get("/{resume_id}/publish-status")
def get_publish_status(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Get the publish status of a worker profile.
    
    Args:
        resume_id: ID of the worker profile
    
    Returns:
        Publish status
    """
    from app.models import Resume
    
    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )
    
    return {
        "resume_id": resume_id,
        "is_published": resume.is_published,
        "full_name": resume.full_name,
        "primary_trade": resume.primary_trade
    }


# ============================================================
# RESUME TEMPLATE UPDATE
# ============================================================

@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume_template(
    resume_id: int,
    update_data: dict,
    db: Session = Depends(get_db)
):
    """
    Update resume template selection.
    
    Allows workers to change their resume template choice.
    The selected template will be used when generating PDF downloads.
    
    Args:
        resume_id: ID of the worker profile
        update_data: Dictionary containing resume_template field
    
    Returns:
        Updated resume data
    """
    from app.models import Resume
    
    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )
    
    # Validate template choice
    valid_templates = ['executive', 'modern', 'sidebar', 'construction', 'compact']
    template = update_data.get('resume_template')
    
    if template and template not in valid_templates:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid template. Must be one of: {', '.join(valid_templates)}"
        )
    
    # Update template
    if template:
        resume.resume_template = template
        db.commit()
        db.refresh(resume)
        logger.info(f"Updated resume {resume_id} template to: {template}")
        
        # Track analytics
        track_template_action(db, resume_id, template, 'saved')
    
    return resume



# ============================================================
# TEMPLATE PREVIEW (Quick Preview without saving)
# ============================================================

@router.get("/{resume_id}/preview")
def preview_resume_with_template(
    resume_id: int,
    template: str = 'executive',
    db: Session = Depends(get_db)
):
    """
    Generate a preview PDF with any template without saving the template choice.
    
    This allows users to try different templates before committing to one.
    The template parameter is used for PDF generation but not saved to database.
    
    Args:
        resume_id: ID of the worker profile
        template: Template to use for preview (executive, modern, sidebar, construction, compact)
    
    Returns:
        PDF file with the specified template
    """
    from app.models import Resume
    import tempfile
    
    # Validate template
    valid_templates = ['executive', 'modern', 'sidebar', 'construction', 'compact']
    if template not in valid_templates:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid template. Must be one of: {', '.join(valid_templates)}"
        )
    
    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )
    
    try:
        # Prepare resume data with preview template
        resume_data = {
            "full_name": resume.full_name,
            "phone_number": resume.phone_number or resume.contact_number,
            "contact_number": resume.contact_number,
            "village_or_city": resume.village_or_city,
            "district": resume.district,
            "state": resume.state,
            "location": resume.location,
            "primary_trade": resume.primary_trade,
            "years_of_experience": resume.years_of_experience,
            "specializations": resume.specializations,
            "tools_handled": resume.tools_handled or resume.tools_known,
            "tools_known": resume.tools_known,
            "worked_as": resume.worked_as,
            "company_name": resume.company_name,
            "project_types": resume.project_types,
            "service_type": resume.service_type,
            "availability": resume.availability,
            "travel_radius": resume.travel_radius,
            "expected_wage": resume.expected_wage,
            "own_tools": resume.own_tools,
            "own_vehicle": resume.own_vehicle,
            "projects_completed": resume.projects_completed,
            "client_rating": resume.client_rating or resume.average_rating,
            "average_rating": resume.average_rating,
            "reference_available": resume.reference_available,
            "education_level": resume.education_level,
            "technical_training": resume.technical_training,
            "languages_spoken": resume.languages_spoken or resume.languages,
            "languages": resume.languages,
            "professional_summary": resume.professional_summary,
            "structured_work_experience": [],
            "profile_photo": resume.profile_photo,
            "resume_template": template  # Use preview template, not saved template
        }
        
        # Parse structured work experience if available
        if resume.professional_summary:
            work_exp_lines = [line.strip() for line in resume.professional_summary.split('\n') if line.strip().startswith('•')]
            if work_exp_lines:
                resume_data["structured_work_experience"] = [line.lstrip('• ') for line in work_exp_lines]
        
        # Generate temporary PDF file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        temp_file.close()
        
        # Generate PDF with preview template
        pdf_path = generate_resume_pdf(
            formatted_resume="",
            file_path=temp_file.name,
            resume_data=resume_data
        )
        
        # Return PDF file
        filename = f"{resume.full_name or 'profile'}_{template}_preview.pdf"
        
        logger.info(f"Generated preview PDF for resume {resume_id} with template: {template}")
        
        # Track analytics
        track_template_action(db, resume_id, template, 'previewed')
        
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=filename,
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "X-Template-Preview": template
            }
        )
    
    except Exception as e:
        logger.error(f"Error generating preview PDF: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate preview PDF: {str(e)}"
        )



# ============================================================
# TEMPLATE RECOMMENDATIONS
# ============================================================

@router.get("/{resume_id}/template-recommendations")
def get_template_recommendations(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Get AI-powered template recommendations based on worker profile.
    
    Analyzes trade, experience level, location, and other factors to suggest
    the most suitable resume templates for the worker.
    
    Args:
        resume_id: ID of the worker profile
    
    Returns:
        List of recommended templates with reasons
    """
    from app.models import Resume
    import re
    
    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )
    
    recommendations = []
    
    # Helper function to extract years from experience string
    def extract_years(exp_str):
        if not exp_str:
            return 0
        match = re.search(r'(\d+)', exp_str)
        return int(match.group(1)) if match else 0
    
    # Get experience years
    years = extract_years(resume.years_of_experience)
    
    # Get trade
    trade = (resume.primary_trade or '').lower()
    
    # Get location type (urban vs rural)
    location = (resume.village_or_city or '').lower()
    urban_keywords = ['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'pune', 'kolkata', 'ahmedabad', 'city']
    is_urban = any(keyword in location for keyword in urban_keywords)
    
    # Get projects completed
    projects = resume.projects_completed or 0
    
    # Recommendation Logic
    
    # 1. Construction Theme - For construction trades
    if any(keyword in trade for keyword in ['carpenter', 'mason', 'welder', 'construction', 'plumber', 'electrician']):
        recommendations.append({
            'template': 'construction',
            'score': 95,
            'reason': 'Perfect for construction industry professionals',
            'benefits': ['Bold design', 'Industry-focused', 'Highlights projects']
        })
    
    # 2. Executive Classic - For experienced professionals
    if years >= 15 or projects >= 200:
        recommendations.append({
            'template': 'executive',
            'score': 90,
            'reason': 'Ideal for senior professionals with extensive experience',
            'benefits': ['Corporate style', 'Professional appearance', 'Structured layout']
        })
    
    # 3. Modern Minimal - For urban workers
    if is_urban:
        recommendations.append({
            'template': 'modern',
            'score': 85,
            'reason': 'Great for urban professionals and modern companies',
            'benefits': ['Elegant design', 'Clean layout', 'Contemporary style']
        })
    
    # 4. Sidebar Professional - For quick hiring scenarios
    if projects >= 50 or years >= 5:
        recommendations.append({
            'template': 'sidebar',
            'score': 80,
            'reason': 'Excellent for recruiters who scan quickly',
            'benefits': ['Easy to scan', 'Organized layout', 'Professional look']
        })
    
    # 5. Compact - For entry-level or quick applications
    if years < 5 or projects < 20:
        recommendations.append({
            'template': 'compact',
            'score': 75,
            'reason': 'Perfect for concise, one-page resumes',
            'benefits': ['Efficient layout', 'Quick to read', 'Space-saving']
        })
    
    # Default recommendations if none matched
    if not recommendations:
        recommendations = [
            {
                'template': 'executive',
                'score': 80,
                'reason': 'Versatile professional template',
                'benefits': ['Professional', 'Well-structured', 'Widely accepted']
            },
            {
                'template': 'modern',
                'score': 75,
                'reason': 'Clean and contemporary design',
                'benefits': ['Modern look', 'Easy to read', 'Elegant']
            }
        ]
    
    # Sort by score
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    
    # Return top 3 recommendations
    return {
        'resume_id': resume_id,
        'recommendations': recommendations[:3],
        'current_template': resume.resume_template,
        'profile_summary': {
            'trade': resume.primary_trade,
            'experience_years': years,
            'projects_completed': projects,
            'location_type': 'urban' if is_urban else 'rural'
        }
    }
