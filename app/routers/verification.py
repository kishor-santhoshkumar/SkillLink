"""
Worker verification management routes.
Allows admins to manage worker verification badges.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import Resume, User
from app.schemas import ResumeResponse
from app.auth import get_current_user

router = APIRouter(prefix="/verification", tags=["verification"])


def verify_admin_role(current_user: User):
    """Verify that the current user is an admin."""
    # For now, we'll check if user is a company (can be extended to actual admin role)
    if current_user.role not in ["admin", "company"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can manage verifications"
        )


@router.patch("/workers/{worker_id}/email", response_model=ResumeResponse)
def verify_email(
    worker_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark worker's email as verified."""
    verify_admin_role(current_user)
    
    worker = db.query(Resume).filter(Resume.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    worker.is_email_verified = True
    db.commit()
    db.refresh(worker)
    return worker


@router.patch("/workers/{worker_id}/phone", response_model=ResumeResponse)
def verify_phone(
    worker_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark worker's phone as verified."""
    verify_admin_role(current_user)
    
    worker = db.query(Resume).filter(Resume.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    worker.is_phone_verified = True
    db.commit()
    db.refresh(worker)
    return worker


@router.patch("/workers/{worker_id}/identity", response_model=ResumeResponse)
def verify_identity(
    worker_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark worker's identity as verified."""
    verify_admin_role(current_user)
    
    worker = db.query(Resume).filter(Resume.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    worker.is_identity_verified = True
    db.commit()
    db.refresh(worker)
    return worker


@router.patch("/workers/{worker_id}/background", response_model=ResumeResponse)
def verify_background(
    worker_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark worker's background check as passed."""
    verify_admin_role(current_user)
    
    worker = db.query(Resume).filter(Resume.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    worker.is_background_checked = True
    db.commit()
    db.refresh(worker)
    return worker


@router.patch("/workers/{worker_id}/revoke/{badge_type}", response_model=ResumeResponse)
def revoke_verification(
    worker_id: int,
    badge_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Revoke a verification badge from a worker."""
    verify_admin_role(current_user)
    
    worker = db.query(Resume).filter(Resume.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    badge_map = {
        "email": "is_email_verified",
        "phone": "is_phone_verified",
        "identity": "is_identity_verified",
        "background": "is_background_checked"
    }
    
    if badge_type not in badge_map:
        raise HTTPException(status_code=400, detail="Invalid badge type")
    
    setattr(worker, badge_map[badge_type], False)
    db.commit()
    db.refresh(worker)
    return worker


@router.get("/workers/{worker_id}/badges")
def get_worker_badges(
    worker_id: int,
    db: Session = Depends(get_db)
):
    """Get all verification badges for a worker."""
    worker = db.query(Resume).filter(Resume.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    badges = {
        "email_verified": worker.is_email_verified,
        "phone_verified": worker.is_phone_verified,
        "identity_verified": worker.is_identity_verified,
        "background_checked": worker.is_background_checked,
        "verified_worker": (worker.projects_completed or 0) >= 20 and (worker.client_rating or 0) >= 4.0
    }
    
    return {
        "worker_id": worker_id,
        "badges": badges,
        "total_verified": sum(badges.values())
    }
