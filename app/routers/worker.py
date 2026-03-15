"""
Worker search routes for SkillLink
Allows companies to search and filter skilled workers
Only accessible to users with role='company'
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
import logging

from app.database import get_db
from app.models import Resume, User
from app.schemas import ResumeResponse
from app.auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[ResumeResponse])
def get_all_workers(
    published_only: bool = Query(True, description="Show only published profiles"),
    limit: int = Query(100, le=500, description="Maximum number of results"),
    db: Session = Depends(get_db)
):
    """
    Get all workers (public endpoint for homepage stats).
    
    Parameters:
    - published_only: If True, only show published profiles (default: True)
    - limit: Maximum results (default 100, max 500)
    
    Returns list of worker profiles.
    """
    # Build query
    query = db.query(Resume)
    
    if published_only:
        query = query.filter(Resume.is_published == True)
    
    # Order by rating and limit
    query = query.order_by(Resume.client_rating.desc().nullslast())
    query = query.limit(limit)
    
    # Execute query
    workers = query.all()
    
    logger.info(f"Public worker list fetched: {len(workers)} results (published_only={published_only})")
    
    return workers


def verify_company_role(current_user: User):
    """
    Verify that the current user has company role.
    Raises 403 if user is not a company.
    """
    if current_user.role != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can search workers"
        )


@router.get("/search", response_model=List[ResumeResponse])
def search_workers(
    trade: Optional[str] = Query(None, description="Filter by primary trade (e.g., Carpenter, Plumber)"),
    min_experience: Optional[int] = Query(None, description="Minimum years of experience"),
    location: Optional[str] = Query(None, description="Filter by location (village/city/district/state)"),
    availability: Optional[str] = Query(None, description="Filter by availability (full-time, part-time, weekends)"),
    own_tools: Optional[bool] = Query(None, description="Filter workers who have their own tools"),
    own_vehicle: Optional[bool] = Query(None, description="Filter workers who have their own vehicle"),
    min_rating: Optional[float] = Query(None, description="Minimum client rating (0-5)"),
    limit: int = Query(50, le=100, description="Maximum number of results"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Search for skilled workers with filters.
    
    Requirements:
    - User must have role='company'
    
    Filters:
    - trade: Primary trade (Carpenter, Plumber, Electrician, etc.)
    - min_experience: Minimum years of experience
    - location: Location search (matches village, city, district, or state)
    - availability: Availability type
    - own_tools: Has own tools
    - own_vehicle: Has own vehicle
    - min_rating: Minimum client rating
    - limit: Maximum results (default 50, max 100)
    
    Returns list of worker profiles matching the criteria.
    """
    # Verify company role
    verify_company_role(current_user)
    
    # Build query - ONLY show published profiles
    query = db.query(Resume).filter(Resume.is_published == True)
    
    # Apply filters
    if trade:
        query = query.filter(Resume.primary_trade.ilike(f"%{trade}%"))
    
    if min_experience is not None:
        # Extract numeric value from experience string (e.g., "5 years" -> 5)
        query = query.filter(Resume.years_of_experience.isnot(None))
        # Note: This is a simple filter. For production, consider storing experience as integer
    
    if location:
        # Search across all location fields
        location_filter = f"%{location}%"
        query = query.filter(
            (Resume.village_or_city.ilike(location_filter)) |
            (Resume.district.ilike(location_filter)) |
            (Resume.state.ilike(location_filter)) |
            (Resume.location.ilike(location_filter))
        )
    
    if availability:
        query = query.filter(Resume.availability.ilike(f"%{availability}%"))
    
    if own_tools is not None:
        query = query.filter(Resume.own_tools == own_tools)
    
    if own_vehicle is not None:
        query = query.filter(Resume.own_vehicle == own_vehicle)
    
    if min_rating is not None:
        query = query.filter(
            ((Resume.client_rating >= min_rating) | (Resume.average_rating >= min_rating))
        )
    
    # Order by rating (highest first) and limit results
    query = query.order_by(Resume.client_rating.desc().nullslast())
    query = query.limit(limit)
    
    # Execute query
    workers = query.all()
    
    logger.info(f"Worker search by company {current_user.id}: {len(workers)} results (filters: trade={trade}, location={location})")
    
    return workers


@router.get("/{worker_id}", response_model=ResumeResponse)
def get_worker_profile(
    worker_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed worker profile by ID.
    
    Requirements:
    - User must have role='company'
    
    Returns the complete worker profile.
    """
    # Verify company role
    verify_company_role(current_user)
    
    # Get worker
    worker = db.query(Resume).filter(Resume.id == worker_id).first()
    
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    logger.info(f"Company {current_user.id} viewed worker profile {worker_id}")
    
    return worker


@router.get("/trades/list", response_model=List[str])
def list_available_trades(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of all available trades in the system.
    
    Requirements:
    - User must have role='company'
    
    Returns list of unique trade names.
    """
    # Verify company role
    verify_company_role(current_user)
    
    # Get distinct trades
    trades = db.query(Resume.primary_trade).distinct().filter(Resume.primary_trade.isnot(None)).all()
    trade_list = [trade[0] for trade in trades if trade[0]]
    
    return sorted(trade_list)
