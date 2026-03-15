"""
Job Request Router
Handles job posting, retrieval, worker applications, and assignment endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
import httpx
import asyncio

from app.schemas import JobRequestCreate, JobRequestResponse, JobRequestUpdate
from app.crud_job import (
    create_job_request,
    get_job_by_id,
    get_all_jobs,
    assign_worker_to_job,
    update_job_status,
    get_jobs_by_trade,
    get_worker_assigned_jobs
)
from app.crud import get_resume_by_id
from app.database import get_db
from app.models import JobRequest, JobApplication, Notification, User, Resume, Company, ApplicationLog
from app.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

# n8n Webhook Configuration
N8N_WEBHOOK_URL_APPLICATION = "https://kishorsanthoshkumar.app.n8n.cloud/webhook/worker-application"
N8N_WEBHOOK_URL_ACCEPTANCE = "https://kishorsanthoshkumar.app.n8n.cloud/webhook/job-accepted"


async def trigger_n8n_webhook(worker_data: dict, job_data: dict, company_data: dict):
    """
    Trigger n8n webhook to send email notification to company when worker applies.
    
    Returns tuple: (status_message, response_code, response_body, error_message)
    
    Args:
        worker_data: Worker information (name, email, trade, experience, location)
        job_data: Job information (title, required_trade)
        company_data: Company information (name, email, location)
    """
    try:
        payload = {
            "worker_name": worker_data.get("full_name", "Unknown"),
            "worker_email": worker_data.get("email", "no-email@example.com"),
            "trade": worker_data.get("primary_trade", "Not specified"),
            "experience": worker_data.get("years_of_experience", "Not specified"),
            "location": worker_data.get("location", "Not specified"),
            "job_title": job_data.get("required_trade", "Position"),
            "company_name": company_data.get("company_name", "Company"),
            "company_email": company_data.get("email", "no-email@example.com"),
            "company_location": company_data.get("location", "Not specified")
        }
        
        logger.info(f"🔔 Triggering n8n webhook for company: {payload['company_email']}")
        logger.debug(f"Webhook payload: {payload}")
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(N8N_WEBHOOK_URL_APPLICATION, json=payload)
            
            response_body = response.text[:500]  # Limit response body length
            
            if response.status_code == 200:
                logger.info(f"✅ n8n webhook SUCCESS - Status: {response.status_code}")
                return ("Webhook triggered successfully", response.status_code, response_body, None)
            else:
                logger.warning(f"⚠️ n8n webhook returned status {response.status_code}")
                return (f"Webhook returned status {response.status_code}", response.status_code, response_body, None)
                
    except httpx.TimeoutException as e:
        error_msg = f"Webhook timeout: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return ("Webhook timeout", None, None, error_msg)
    except Exception as e:
        error_msg = f"Webhook error: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return ("Webhook failed", None, None, error_msg)


async def trigger_job_acceptance_webhook(worker_data: dict, job_data: dict, company_data: dict):
    """
    Trigger n8n webhook to send email notification to worker when application is accepted.
    
    Returns tuple: (status_message, response_code, response_body, error_message)
    
    Args:
        worker_data: Worker information (name, email)
        job_data: Job information (title)
        company_data: Company information (name, email, location, phone)
    """
    try:
        payload = {
            "worker_name": worker_data.get("full_name", "Unknown"),
            "worker_email": worker_data.get("email", "no-email@example.com"),
            "job_title": job_data.get("required_trade", "Position"),
            "company_name": company_data.get("company_name", "Company"),
            "company_email": company_data.get("email", "no-email@example.com"),
            "company_location": company_data.get("location", "Not specified"),
            "contact_phone": company_data.get("phone", "Not specified")
        }
        
        logger.info(f"🎉 Triggering job acceptance webhook for worker: {worker_data.get('email')}")
        logger.debug(f"Acceptance webhook payload: {payload}")
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(N8N_WEBHOOK_URL_ACCEPTANCE, json=payload)
            
            response_body = response.text[:500]  # Limit response body length
            
            if response.status_code == 200:
                logger.info(f"✅ Job acceptance webhook SUCCESS - Status: {response.status_code}")
                return ("Acceptance webhook triggered successfully", response.status_code, response_body, None)
            else:
                logger.warning(f"⚠️ Job acceptance webhook returned status {response.status_code}")
                return (f"Acceptance webhook returned status {response.status_code}", response.status_code, response_body, None)
                
    except httpx.TimeoutException as e:
        error_msg = f"Acceptance webhook timeout: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return ("Acceptance webhook timeout", None, None, error_msg)
    except Exception as e:
        error_msg = f"Acceptance webhook error: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return ("Acceptance webhook failed", None, None, error_msg)


class JobApplicationResponse(BaseModel):
    id: int
    job_id: int
    worker_id: int
    worker_name: str | None
    worker_trade: str | None
    worker_phone: str | None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.post("/", response_model=JobRequestResponse, status_code=201)
def create_job(
    job: JobRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new job request (Company only).
    
    Requires authentication and company role.
    """
    try:
        # Check if user is a company
        if current_user.role != "company":
            raise HTTPException(status_code=403, detail="Only companies can post jobs")
        
        # Create job with company_id
        db_job = JobRequest(
            company_id=current_user.id,
            client_name=job.client_name,
            phone_number=job.phone_number,
            location=job.location,
            required_trade=job.required_trade,
            job_description=job.job_description,
            budget=job.budget,
            status="open"
        )
        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        
        logger.info(f"Job request created: {db_job.id} by company {current_user.id}")
        return db_job
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating job request: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating job: {str(e)}")


@router.get("/", response_model=List[JobRequestResponse])
def get_jobs(
    status: Optional[str] = Query(None, regex="^(open|assigned|completed)$"),
    trade: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get job requests based on user role.
    
    Workers: See all open jobs from all companies
    Companies: See only their own posted jobs
    """
    try:
        query = db.query(JobRequest)
        
        # Filter based on role
        if current_user.role == "company":
            # Companies see only their own jobs
            query = query.filter(JobRequest.company_id == current_user.id)
        else:
            # Workers see all open jobs
            query = query.filter(JobRequest.status == "open")
        
        # Apply additional filters
        if status:
            query = query.filter(JobRequest.status == status)
        if trade:
            query = query.filter(JobRequest.required_trade == trade)
        
        jobs = query.order_by(JobRequest.created_at.desc()).all()
        logger.info(f"Retrieved {len(jobs)} job requests for user {current_user.id}")
        return jobs
        
    except Exception as e:
        logger.error(f"Error retrieving jobs: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving jobs: {str(e)}")


@router.get("/my-applications")
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all job applications submitted by the current worker.
    Returns list of applications with job details.
    """
    try:
        logger.info(f"📋 Fetching applications for user {current_user.id} ({current_user.username})")
        
        # Get worker's resume first
        worker_resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
        if not worker_resume:
            logger.warning(f"⚠️ No resume found for user {current_user.id}")
            return []  # No resume, no applications
        
        logger.info(f"✓ Found resume ID {worker_resume.id} for user {current_user.id}")
        
        # Get all applications by this worker's resume ID
        applications = db.query(JobApplication).filter(
            JobApplication.worker_id == worker_resume.id
        ).all()
        
        logger.info(f"✓ Found {len(applications)} applications for resume {worker_resume.id}")
        
        result = []
        for app in applications:
            job = db.query(JobRequest).filter(JobRequest.id == app.job_id).first()
            if job:
                result.append({
                    "id": app.id,
                    "job_id": app.job_id,
                    "status": app.status,
                    "applied_at": app.created_at,
                    "job_title": f"{job.required_trade} Position",
                    "company_name": job.client_name,
                    "location": job.location
                })
                logger.debug(f"  - Application {app.id}: Job {app.job_id} ({job.required_trade})")
        
        logger.info(f"📤 Returning {len(result)} applications")
        return result
    except Exception as e:
        logger.error(f"❌ Error fetching applications: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-workers")
def get_my_workers(
    status: str = Query("in-progress"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all workers hired by the current company, filtered by status.
    
    Status options:
    - in-progress: All workers with accepted applications (actively hired)
    - completed: Workers who completed jobs (job status = completed)
    """
    try:
        logger.info(f"📋 Fetching {status} workers for company {current_user.id}")
        
        # Validate status
        if status not in ["in-progress", "completed"]:
            raise HTTPException(status_code=400, detail="Invalid status. Must be 'in-progress' or 'completed'")
        
        # Get all accepted applications for this company's jobs
        applications = db.query(JobApplication).join(
            JobRequest, JobApplication.job_id == JobRequest.id
        ).filter(
            JobRequest.company_id == current_user.id,
            JobApplication.status == "accepted"
        ).all()
        
        result = []
        for app in applications:
            job = db.query(JobRequest).filter(JobRequest.id == app.job_id).first()
            worker = db.query(Resume).filter(Resume.id == app.worker_id).first()
            
            if job and worker:
                # Determine status: completed if job is completed, otherwise in-progress
                worker_status = "completed" if job.status == "completed" else "in-progress"
                
                # Only include workers matching the requested status
                if worker_status == status:
                    result.append({
                        "id": app.id,
                        "worker_id": worker.id,
                        "worker_name": worker.full_name,
                        "worker_trade": worker.primary_trade,
                        "worker_phone": worker.phone_number,
                        "profile_photo": worker.profile_photo,
                        "job_id": job.id,
                        "job_title": f"{job.required_trade} at {job.location}",
                        "status": worker_status,
                        "rating": worker.client_rating
                    })
        
        logger.info(f"✓ Found {len(result)} {status} workers")
        return result
        
    except Exception as e:
        logger.error(f"❌ Error fetching workers: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{job_id}", response_model=JobRequestResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific job request by ID.
    
    Args:
        job_id: ID of the job request
    
    Returns:
        Job request details
    """
    try:
        job = get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job request not found")
        
        return job
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving job: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving job: {str(e)}")


@router.patch("/{job_id}/assign/{worker_id}", response_model=JobRequestResponse)
def assign_job_to_worker(
    job_id: int,
    worker_id: int,
    db: Session = Depends(get_db)
):
    """
    Assign a worker to a job request.
    
    Validates:
    - Job exists
    - Worker exists
    - Job is in "open" status
    
    Updates job status to "assigned".
    
    Args:
        job_id: ID of the job request
        worker_id: ID of the worker to assign
    
    Returns:
        Updated job request
    """
    try:
        # Check if job exists
        job = get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job request not found")
        
        # Check if worker exists
        worker = get_resume_by_id(db, worker_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        # Check if job is open
        if job.status != "open":
            raise HTTPException(status_code=400, detail=f"Job is already {job.status}")
        
        # Assign worker
        updated_job = assign_worker_to_job(db, job_id, worker_id)
        logger.info(f"Worker {worker_id} assigned to job {job_id}")
        return updated_job
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error assigning worker to job: {e}")
        raise HTTPException(status_code=500, detail=f"Error assigning worker: {str(e)}")


@router.patch("/{job_id}", response_model=JobRequestResponse)
def update_job(
    job_id: int,
    job_update: JobRequestUpdate,
    db: Session = Depends(get_db)
):
    """
    Update job request status.
    
    Allowed status transitions:
    - open -> assigned
    - assigned -> completed
    
    Args:
        job_id: ID of the job request
        job_update: Update data (status)
    
    Returns:
        Updated job request
    """
    try:
        # Check if job exists
        job = get_job_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job request not found")
        
        # Update status if provided
        if job_update.status:
            updated_job = update_job_status(db, job_id, job_update.status)
            logger.info(f"Job {job_id} status updated to {job_update.status}")
            return updated_job
        
        return job
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating job: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating job: {str(e)}")


@router.get("/trade/{trade}", response_model=List[JobRequestResponse])
def get_jobs_for_trade(
    trade: str,
    db: Session = Depends(get_db)
):
    """
    Get all open jobs for a specific trade.
    
    Useful for workers to see available jobs in their trade.
    
    Args:
        trade: Trade name (Carpenter, Plumber, etc.)
    
    Returns:
        List of open job requests for the trade
    """
    try:
        jobs = get_jobs_by_trade(db, trade)
        logger.info(f"Retrieved {len(jobs)} open jobs for {trade}")
        return jobs
        
    except Exception as e:
        logger.error(f"Error retrieving jobs for trade: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving jobs: {str(e)}")


@router.get("/worker/{worker_id}/assigned", response_model=List[JobRequestResponse])
def get_worker_jobs(
    worker_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all jobs assigned to a specific worker.
    
    Args:
        worker_id: ID of the worker
    
    Returns:
        List of job requests assigned to the worker
    """
    try:
        # Check if worker exists
        worker = get_resume_by_id(db, worker_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        jobs = get_worker_assigned_jobs(db, worker_id)
        logger.info(f"Retrieved {len(jobs)} assigned jobs for worker {worker_id}")
        return jobs
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving worker jobs: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving jobs: {str(e)}")


@router.post("/{job_id}/apply")
async def apply_to_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Apply to a job (Worker only).
    
    Creates application, notifies company, triggers n8n webhook, and logs everything.
    """
    try:
        logger.info(f"📝 Worker {current_user.id} applying to job {job_id}")
        
        # Check if user is a worker
        if current_user.role != "worker":
            raise HTTPException(status_code=403, detail="Only workers can apply to jobs")
        
        # Check if job exists
        job = db.query(JobRequest).filter(JobRequest.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Check if job is open
        if job.status != "open":
            raise HTTPException(status_code=400, detail="Job is not open for applications")
        
        # Get worker's resume
        worker_resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
        if not worker_resume:
            raise HTTPException(status_code=400, detail="Please create your profile first")
        
        # Check if already applied
        existing_application = db.query(JobApplication).filter(
            JobApplication.job_id == job_id,
            JobApplication.worker_id == worker_resume.id
        ).first()
        
        if existing_application:
            raise HTTPException(status_code=400, detail="You have already applied for this job")
        
        logger.info(f"✅ Worker application saved to database")
        
        # Create application
        application = JobApplication(
            job_id=job_id,
            worker_id=worker_resume.id,
            status="pending"
        )
        db.add(application)
        db.flush()  # Flush to get the application ID
        
        logger.info(f"📬 Company dashboard receives application (ID: {application.id})")
        
        # Create notification for company
        notification = Notification(
            user_id=job.company_id,
            title="New Job Application",
            message=f"{worker_resume.full_name or 'A worker'} applied for your {job.required_trade} position at {job.location}",
            type="job_application",
            related_id=application.id,
            is_read=False
        )
        db.add(notification)
        
        db.commit()
        
        # Get company user and company profile for email and details
        company_user = db.query(User).filter(User.id == job.company_id).first()
        company = db.query(Company).filter(Company.user_id == job.company_id).first()
        
        company_email = company_user.email if company_user and company_user.email else "no-email@example.com"
        
        # Prepare webhook data with all required fields
        worker_data = {
            "full_name": worker_resume.full_name,
            "email": current_user.email if current_user.email else "no-email@example.com",
            "primary_trade": worker_resume.primary_trade,
            "years_of_experience": worker_resume.years_of_experience,
            "location": f"{worker_resume.village_or_city}, {worker_resume.district}" if worker_resume.village_or_city else worker_resume.location
        }
        
        job_data = {
            "required_trade": job.required_trade,
            "location": job.location
        }
        
        company_data = {
            "company_name": company.company_name if company else company_user.username if company_user else "Company",
            "email": company_email,
            "location": company.location if company else job.location
        }
        
        logger.info(f"🚀 n8n webhook triggered for company: {company_email}")
        
        # Trigger webhook and get response
        status_msg, response_code, response_body, error_msg = await trigger_n8n_webhook(
            worker_data, job_data, company_data
        )
        
        logger.info(f"📧 Email workflow started - Status: {status_msg}")
        
        # Log the webhook trigger
        app_log = ApplicationLog(
            worker_id=worker_resume.id,
            job_id=job_id,
            application_id=application.id,
            email_trigger_status=status_msg,
            webhook_response_code=response_code,
            webhook_response_body=response_body,
            error_message=error_msg
        )
        db.add(app_log)
        db.commit()
        
        logger.info(f"✅ Application process complete for job {job_id}")
        
        return {
            "message": "Application submitted successfully",
            "application_id": application.id,
            "email_trigger_status": status_msg
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error applying to job: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{job_id}/cancel-application")
def cancel_application(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a job application submitted by the current worker.
    """
    try:
        # Get worker's resume first
        worker_resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
        if not worker_resume:
            raise HTTPException(status_code=404, detail="Worker profile not found")
        
        # Find the application using worker's resume ID
        application = db.query(JobApplication).filter(
            JobApplication.job_id == job_id,
            JobApplication.worker_id == worker_resume.id
        ).first()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Delete the application
        db.delete(application)
        db.commit()
        
        return {"message": "Application cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling application: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{job_id}/applications", response_model=List[JobApplicationResponse])
def get_job_applications(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all applications for a job (Company only).
    """
    try:
        # Check if job exists and belongs to current company
        job = db.query(JobRequest).filter(
            JobRequest.id == job_id,
            JobRequest.company_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found or access denied")
        
        # Get applications with worker details
        applications = db.query(JobApplication).filter(
            JobApplication.job_id == job_id
        ).all()
        
        # Format response with worker details
        result = []
        for app in applications:
            worker = db.query(Resume).filter(Resume.id == app.worker_id).first()
            result.append({
                "id": app.id,
                "job_id": app.job_id,
                "worker_id": app.worker_id,
                "worker_name": worker.full_name if worker else None,
                "worker_trade": worker.primary_trade if worker else None,
                "worker_phone": worker.phone_number if worker else None,
                "status": app.status,
                "created_at": app.created_at
            })
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching applications: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/applications/{application_id}/accept")
async def accept_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Accept a job application (Company only).
    
    Updates application status, notifies worker, and triggers n8n webhook to send email.
    Job remains OPEN for other applicants (multiple workers can be hired).
    """
    try:
        logger.info(f"🎯 Company {current_user.id} accepting application {application_id}")
        
        # Get application
        application = db.query(JobApplication).filter(
            JobApplication.id == application_id
        ).first()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Check if job belongs to current company
        job = db.query(JobRequest).filter(
            JobRequest.id == application.job_id,
            JobRequest.company_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Update application status
        application.status = "accepted"
        
        # DO NOT change job status - keep it open for more workers
        # Multiple workers can be accepted for the same job
        
        # Get worker's resume and user info
        worker_resume = db.query(Resume).filter(Resume.id == application.worker_id).first()
        worker_user = None
        if worker_resume and worker_resume.user_id:
            worker_user = db.query(User).filter(User.id == worker_resume.user_id).first()
            
            # Create in-app notification for worker
            notification = Notification(
                user_id=worker_resume.user_id,
                title="Application Accepted!",
                message=f"Your application for {job.required_trade} position has been accepted",
                type="application_accepted",
                related_id=application.id,
                is_read=False
            )
            db.add(notification)
        
        db.commit()
        
        logger.info(f"✅ Application {application_id} accepted. In-app notification created.")
        
        # Get company user for email (use ONLY User.email, not Company.email)
        company_user = db.query(User).filter(User.id == current_user.id).first()
        
        # Get company profile for additional details (name, location, phone)
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        
        # Prepare data for webhook
        worker_data = {
            "full_name": worker_resume.full_name if worker_resume else "Unknown Worker",
            "email": worker_user.email if worker_user and worker_user.email else "no-email@example.com"
        }
        
        job_data = {
            "required_trade": job.required_trade
        }
        
        company_data = {
            "company_name": company.company_name if company else current_user.username,
            "email": current_user.email if current_user.email else "no-email@example.com",  # ONLY use User.email
            "location": company.location if company else job.location,
            "phone": company.phone if company else job.phone_number
        }
        
        logger.info(f"🚀 Triggering job acceptance webhook for worker: {worker_data['email']}")
        
        # Trigger n8n webhook (async, non-blocking)
        status_msg, response_code, response_body, error_msg = await trigger_job_acceptance_webhook(
            worker_data, job_data, company_data
        )
        
        logger.info(f"📧 Job acceptance email workflow - Status: {status_msg}")
        
        # Log the webhook trigger in ApplicationLog
        app_log = ApplicationLog(
            worker_id=worker_resume.id if worker_resume else None,
            job_id=job.id,
            application_id=application.id,
            email_trigger_status=f"ACCEPTANCE: {status_msg}",
            webhook_response_code=response_code,
            webhook_response_body=response_body,
            error_message=error_msg
        )
        db.add(app_log)
        db.commit()
        
        logger.info(f"✅ Application acceptance complete. Job remains open for more applicants.")
        
        return {
            "message": "Application accepted successfully. Job remains open for more applicants.",
            "email_trigger_status": status_msg
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error accepting application: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))



@router.patch("/{job_id}/close")
def close_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Close a job opening (Company only).
    
    Marks job as closed so no more workers can apply.
    """
    try:
        # Check if job exists and belongs to current company
        job = db.query(JobRequest).filter(
            JobRequest.id == job_id,
            JobRequest.company_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found or access denied")
        
        # Update job status to closed
        job.status = "closed"
        db.commit()
        
        logger.info(f"Job {job_id} closed by company {current_user.id}")
        return {"message": "Job closed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error closing job: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{job_id}/complete")
def complete_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a job as completed (Company only).
    
    Changes job status to completed, moving workers to completed tab.
    """
    try:
        # Check if job exists and belongs to current company
        job = db.query(JobRequest).filter(
            JobRequest.id == job_id,
            JobRequest.company_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found or access denied")
        
        # Update job status to completed
        job.status = "completed"
        db.commit()
        
        logger.info(f"Job {job_id} marked as completed by company {current_user.id}")
        return {"message": "Job marked as completed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing job: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{job_id}/reopen")
def reopen_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Reopen a closed job (Company only).
    
    Marks job as open again so workers can apply.
    """
    try:
        # Check if job exists and belongs to current company
        job = db.query(JobRequest).filter(
            JobRequest.id == job_id,
            JobRequest.company_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found or access denied")
        
        # Update job status to open
        job.status = "open"
        db.commit()
        
        logger.info(f"Job {job_id} reopened by company {current_user.id}")
        return {"message": "Job reopened successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reopening job: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))
