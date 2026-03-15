# SkillLink - Skilled Worker Hiring Platform

AI-powered platform connecting skilled workers with job opportunities. Complete with profiles, ratings, reviews, and job matching.

## 🎯 Overview

SkillLink is a comprehensive hiring platform for skilled workers like Carpenters, Plumbers, Electricians, Mechanics, and more. It uses AI to create professional profiles from raw text input and provides a complete ecosystem for worker-client connections.

## ✨ Features

### Worker Profile System
- **AI-Powered Extraction**: Automatically extracts trade, experience, specializations from text
- **Multi-language Support**: English, Tamil, Hindi, and mixed languages
- **Profile Photos**: Upload and display worker photos
- **Quality Scoring**: Profile completeness score with actionable feedback
- **PDF Generation**: Download professional PDF profiles

### Rating & Review System
- **Star Ratings**: 1-5 star rating system
- **Client Reviews**: Detailed feedback from clients
- **Average Rating**: Automatically calculated and displayed
- **Review Statistics**: Total reviews and average rating

### Job Marketplace
- **Job Posting**: Clients can post job requirements
- **Trade Filtering**: Filter jobs by trade type
- **Status Tracking**: Open, Assigned, Completed statuses
- **Worker Assignment**: Match workers to jobs
- **Budget Display**: Show job budgets

## 🚀 Quick Start

### Backend Setup

1. **Create Virtual Environment**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure Environment**
Copy `.env.example` to `.env` and update:
```
DATABASE_URL=postgresql://username:password@localhost:5432/skilllink
GROQ_API_KEY=your_groq_api_key_here
```

4. **Run Backend**
```bash
uvicorn app.main:app --reload
```
Backend runs at: http://127.0.0.1:8000

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run Frontend**
```bash
npm run dev
```
Frontend runs at: http://localhost:3000

## 📊 Supported Trades

- Carpenter
- Plumber
- Electrician
- Mechanic
- Mason
- Painter
- Welder
- And more...

## 🔧 Technology Stack

### Backend
- FastAPI (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- Groq AI (llama-3.3-70b-versatile)
- ReportLab (PDF generation)
- langdetect (Language detection)

### Frontend
- React + Vite
- Tailwind CSS
- Axios

## 📁 Project Structure

```
SkillLink/
├── app/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models (Resume, Review, JobRequest)
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Resume CRUD operations
│   ├── crud_review.py       # Review CRUD operations
│   ├── crud_job.py          # Job CRUD operations
│   ├── services.py          # AI & business logic
│   ├── middleware.py        # Logging middleware
│   └── routers/
│       ├── resume.py        # Worker profile endpoints
│       ├── review.py        # Review endpoints
│       └── job.py           # Job endpoints
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ResumeForm.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   ├── PhotoUpload.jsx
│   │   │   ├── ReviewSection.jsx
│   │   │   ├── JobPostingForm.jsx
│   │   │   └── JobList.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   └── Jobs.jsx
│   │   └── services/        # API services
│   └── package.json
├── uploads/                 # Photo storage
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
└── README.md
```

## 🌐 API Endpoints

### Worker Profiles
- `POST /resumes/` - Create new worker profile
- `GET /resumes/{id}` - Get profile by ID
- `GET /resumes/` - Get all profiles
- `GET /resumes/{id}/score` - Get profile quality score
- `GET /resumes/{id}/download` - Download PDF profile
- `POST /resumes/{id}/upload-photo` - Upload profile photo
- `GET /resumes/{id}/photo` - Get profile photo

### Reviews & Ratings
- `POST /resumes/{id}/reviews` - Add review for worker
- `GET /resumes/{id}/reviews` - Get all reviews for worker
- `GET /resumes/{id}/reviews/stats` - Get review statistics

### Job Requests
- `POST /jobs/` - Create new job request
- `GET /jobs/` - Get all jobs (filters: status, trade)
- `GET /jobs/{id}` - Get specific job
- `PATCH /jobs/{id}/assign/{worker_id}` - Assign worker to job
- `PATCH /jobs/{id}` - Update job status
- `GET /jobs/trade/{trade}` - Get jobs by trade
- `GET /jobs/worker/{worker_id}/assigned` - Get worker's assigned jobs

### Documentation
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc

## 📝 Example Usage

### Create Worker Profile
```bash
POST /resumes/
{
  "raw_input": "My name is Kumar. Phone: 9876543210. I am a Plumber with 5 years experience in Chennai. I specialize in pipe fitting, bathroom installation. Available for daily wage work. Can travel up to 10km. Completed 50+ projects."
}
```

### Response
```json
{
  "id": 1,
  "full_name": "Kumar",
  "contact_number": "9876543210",
  "primary_trade": "Plumber",
  "years_of_experience": "5 years",
  "specializations": "pipe fitting, bathroom installation",
  "service_type": "daily wage",
  "travel_radius": "10km",
  "projects_completed": 50,
  "location": "Chennai",
  "average_rating": 0.0,
  "resume_score": 100,
  "ai_confidence_score": 90
}
```

### Add Review
```bash
POST /resumes/1/reviews
{
  "client_name": "Amit",
  "rating": 5,
  "comment": "Excellent work!"
}
```

### Post Job
```bash
POST /jobs/
{
  "client_name": "Sunita",
  "phone_number": "+91-9876543210",
  "location": "Delhi",
  "required_trade": "Plumber",
  "job_description": "Bathroom renovation needed",
  "budget": "₹15000"
}
```

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/skilllink

# AI
GROQ_API_KEY=your_groq_api_key

# Application
APP_ENV=development
```

## 🧪 Testing

Run the test suite:
```bash
python test_skilled_worker.py
```

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! This system is designed specifically for skilled workers in trades, not corporate professionals.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**SkillLink** - Empowering skilled workers with professional profiles 🔧


## 🧪 Testing

Run the comprehensive test suite:
```bash
python test_hiring_platform.py
```

Tests cover:
- Worker profile creation
- Photo upload API
- Review system
- Job posting
- Worker-job assignment

## 📊 Database Schema

### Resumes Table
- Worker profiles with trade information
- Profile photo path
- Average rating (auto-calculated)

### Reviews Table
- Client reviews and ratings (1-5 stars)
- Foreign key to resumes (cascade delete)
- Automatic average rating calculation

### Job Requests Table
- Job postings from clients
- Status tracking (open/assigned/completed)
- Worker assignment capability

## 🎯 Key Features

### For Workers
- Create professional profiles with AI
- Upload profile photos
- Receive ratings and reviews
- Browse available jobs by trade
- Track assigned jobs

### For Clients
- Search workers by trade
- View worker ratings and reviews
- Post job requirements
- Assign workers to jobs
- Track job status

---

**SkillLink v3.0** - Complete Skilled Worker Hiring Platform 🔧⭐💼
