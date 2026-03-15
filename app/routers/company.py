"""
Company routes for SkillLink
Handles company profile creation, retrieval, and updates
Only accessible to users with role='company'
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app.models import Company, User
from app.schemas import CompanyCreate, CompanyUpdate, CompanyResponse
from app.auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


def verify_company_role(current_user: User):
    """
    Verify that the current user has company role.
    Raises 403 if user is not a company.
    """
    if current_user.role != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can access this endpoint"
        )


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a company profile.
    
    Requirements:
    - User must have role='company'
    - User can only have one company profile
    
    Returns the created company profile.
    """
    # Verify company role
    verify_company_role(current_user)
    
    # Check if company already exists for this user
    existing_company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company profile already exists for this user"
        )
    
    # Create company
    company = Company(
        user_id=current_user.id,
        **company_data.model_dump()
    )
    
    db.add(company)
    db.commit()
    db.refresh(company)
    
    logger.info(f"Company profile created: {company.company_name} (user_id: {current_user.id})")
    
    return company


@router.get("/me", response_model=CompanyResponse)
def get_my_company(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the current user's company profile.
    
    Requirements:
    - User must have role='company'
    
    Returns the company profile or 404 if not found.
    """
    # Verify company role
    verify_company_role(current_user)
    
    # Get company
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found. Please create one first."
        )
    
    return company


@router.get("/", response_model=list[CompanyResponse])
def get_all_companies(
    db: Session = Depends(get_db)
):
    """
    Get all company profiles (public endpoint).
    
    Returns list of all companies for display on homepage.
    """
    companies = db.query(Company).all()
    logger.info(f"Retrieved {len(companies)} companies")
    return companies


@router.put("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: int,
    company_data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a company profile.
    
    Requirements:
    - User must have role='company'
    - User can only update their own company profile
    
    Returns the updated company profile.
    """
    # Verify company role
    verify_company_role(current_user)
    
    # Get company
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found"
        )
    
    # Verify ownership
    if company.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own company profile"
        )
    
    # Update company
    update_data = company_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)
    
    db.commit()
    db.refresh(company)
    
    logger.info(f"Company profile updated: {company.company_name} (id: {company_id})")
    
    return company


@router.delete("/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a company profile.
    
    Requirements:
    - User must have role='company'
    - User can only delete their own company profile
    
    Returns success message.
    """
    # Verify company role
    verify_company_role(current_user)
    
    # Get company
    company = db.query(Company).filter(Company.id == company_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found"
        )
    
    # Verify ownership
    if company.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own company profile"
        )
    
    # Delete company
    db.delete(company)
    db.commit()
    
    logger.info(f"Company profile deleted: {company.company_name} (id: {company_id})")
    
    return {"message": "Company profile deleted successfully"}
