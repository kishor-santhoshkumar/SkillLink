"""
Review Router
Handles worker review and rating endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.schemas import ReviewCreate, ReviewResponse
from app.crud_review import create_review, get_reviews_by_worker, get_review_count
from app.crud import get_resume_by_id
from app.database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/{worker_id}/reviews", response_model=ReviewResponse, status_code=201)
def add_review(
    worker_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    """
    Add a review for a worker.
    
    Validates:
    - Worker exists
    - Rating is between 1-5
    
    Automatically recalculates worker's average rating.
    
    Args:
        worker_id: ID of the worker being reviewed
        review: Review data (client_name, rating, comment)
    
    Returns:
        Created review with timestamp
    """
    try:
        # Check if worker exists
        worker = get_resume_by_id(db, worker_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        # Validate rating
        if review.rating < 1 or review.rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
        # Create review
        db_review = create_review(
            db=db,
            worker_id=worker_id,
            client_name=review.client_name,
            rating=review.rating,
            comment=review.comment
        )
        
        logger.info(f"Review created for worker {worker_id}: {review.rating} stars")
        return db_review
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating review: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating review: {str(e)}")


@router.get("/{worker_id}/reviews", response_model=List[ReviewResponse])
def get_worker_reviews(
    worker_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all reviews for a specific worker.
    
    Returns reviews ordered by newest first.
    
    Args:
        worker_id: ID of the worker
    
    Returns:
        List of reviews with ratings and comments
    """
    try:
        # Check if worker exists
        worker = get_resume_by_id(db, worker_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        # Get reviews
        reviews = get_reviews_by_worker(db, worker_id)
        logger.info(f"Retrieved {len(reviews)} reviews for worker {worker_id}")
        return reviews
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving reviews: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving reviews: {str(e)}")


@router.get("/{worker_id}/reviews/stats")
def get_review_stats(
    worker_id: int,
    db: Session = Depends(get_db)
):
    """
    Get review statistics for a worker.
    
    Returns:
    - Total review count
    - Average rating
    
    Args:
        worker_id: ID of the worker
    
    Returns:
        Review statistics
    """
    try:
        # Check if worker exists
        worker = get_resume_by_id(db, worker_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        # Get stats
        review_count = get_review_count(db, worker_id)
        average_rating = worker.average_rating or 0.0
        
        return {
            "worker_id": worker_id,
            "total_reviews": review_count,
            "average_rating": average_rating
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving review stats: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving stats: {str(e)}")
