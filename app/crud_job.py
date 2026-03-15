"""
CRUD operations for JobRequest model.
Handles job posting, retrieval, and assignment.
"""
from sqlalchemy.orm import Session
from app.models import JobRequest
from typing import List, Optional


def create_job_request(
    db: Session,
    client_name: str,
    phone_number: str,
    location: str,
    required_trade: str,
    job_description: str,
    budget: Optional[str] = None
) -> JobRequest:
    """
    Create a new job request.
    
    Args:
        db: Database session
        client_name: Name of client posting job
        phone_number: Client's phone number
        location: Job location
        required_trade: Trade required (Carpenter, Plumber, etc.)
        job_description: Description of the job
        budget: Optional budget
    
    Returns:
        Created JobRequest object
    """
    db_job = JobRequest(
        client_name=client_name,
        phone_number=phone_number,
        location=location,
        required_trade=required_trade,
        job_description=job_description,
        budget=budget,
        status="open"
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


def get_job_by_id(db: Session, job_id: int) -> Optional[JobRequest]:
    """
    Get a job request by ID.
    
    Args:
        db: Database session
        job_id: ID of the job request
    
    Returns:
        JobRequest object if found, None otherwise
    """
    return db.query(JobRequest).filter(JobRequest.id == job_id).first()


def get_all_jobs(db: Session, status: Optional[str] = None, trade: Optional[str] = None) -> List[JobRequest]:
    """
    Get all job requests with optional filtering.
    
    Args:
        db: Database session
        status: Optional status filter (open, assigned, completed)
        trade: Optional trade filter
    
    Returns:
        List of JobRequest objects
    """
    query = db.query(JobRequest)
    
    if status:
        query = query.filter(JobRequest.status == status)
    
    if trade:
        query = query.filter(JobRequest.required_trade == trade)
    
    return query.order_by(JobRequest.created_at.desc()).all()


def assign_worker_to_job(db: Session, job_id: int, worker_id: int) -> Optional[JobRequest]:
    """
    Assign a worker to a job request.
    
    Args:
        db: Database session
        job_id: ID of the job request
        worker_id: ID of the worker to assign
    
    Returns:
        Updated JobRequest object if found, None otherwise
    """
    job = db.query(JobRequest).filter(JobRequest.id == job_id).first()
    if job:
        job.assigned_worker_id = worker_id
        job.status = "assigned"
        db.commit()
        db.refresh(job)
    return job


def update_job_status(db: Session, job_id: int, status: str) -> Optional[JobRequest]:
    """
    Update job request status.
    
    Args:
        db: Database session
        job_id: ID of the job request
        status: New status (open, assigned, completed)
    
    Returns:
        Updated JobRequest object if found, None otherwise
    """
    job = db.query(JobRequest).filter(JobRequest.id == job_id).first()
    if job:
        job.status = status
        db.commit()
        db.refresh(job)
    return job


def get_jobs_by_trade(db: Session, trade: str) -> List[JobRequest]:
    """
    Get all open jobs for a specific trade.
    
    Args:
        db: Database session
        trade: Trade name (Carpenter, Plumber, etc.)
    
    Returns:
        List of JobRequest objects
    """
    return db.query(JobRequest).filter(
        JobRequest.required_trade == trade,
        JobRequest.status == "open"
    ).order_by(JobRequest.created_at.desc()).all()


def get_worker_assigned_jobs(db: Session, worker_id: int) -> List[JobRequest]:
    """
    Get all jobs assigned to a specific worker.
    
    Args:
        db: Database session
        worker_id: ID of the worker
    
    Returns:
        List of JobRequest objects
    """
    return db.query(JobRequest).filter(
        JobRequest.assigned_worker_id == worker_id
    ).order_by(JobRequest.created_at.desc()).all()
