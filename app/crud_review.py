"""
CRUD operations for Review model.
Handles creating and retrieving worker reviews.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Review, Resume
from typing import List, Optional


def create_review(
    db: Session,
    worker_id: int,
    client_name: str,
    rating: int,
    comment: Optional[str] = None
) -> Review:
    """
    Create a new review for a worker.
    
    Args:
        db: Database session
        worker_id: ID of the worker being reviewed
        client_name: Name of the client giving review
        rating: Rating (1-5 stars)
        comment: Optional review comment
    
    Returns:
        Created Review object
    """
    # Create review
    db_review = Review(
        worker_id=worker_id,
        client_name=client_name,
        rating=rating,
        comment=comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update worker's average rating
    update_worker_average_rating(db, worker_id)
    
    return db_review


def get_reviews_by_worker(db: Session, worker_id: int) -> List[Review]:
    """
    Get all reviews for a specific worker.
    
    Args:
        db: Database session
        worker_id: ID of the worker
    
    Returns:
        List of Review objects
    """
    return db.query(Review).filter(Review.worker_id == worker_id).order_by(Review.created_at.desc()).all()


def update_worker_average_rating(db: Session, worker_id: int) -> None:
    """
    Recalculate and update worker's average rating.
    
    Args:
        db: Database session
        worker_id: ID of the worker
    """
    # Calculate average rating
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.worker_id == worker_id).scalar()
    
    # Update worker's average_rating field
    worker = db.query(Resume).filter(Resume.id == worker_id).first()
    if worker:
        worker.average_rating = round(avg_rating, 1) if avg_rating else 0.0
        db.commit()


def get_review_count(db: Session, worker_id: int) -> int:
    """
    Get total number of reviews for a worker.
    
    Args:
        db: Database session
        worker_id: ID of the worker
    
    Returns:
        Count of reviews
    """
    return db.query(Review).filter(Review.worker_id == worker_id).count()
