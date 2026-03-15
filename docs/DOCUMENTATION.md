# SkillLink Platform - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Database](#database)
6. [Authentication](#authentication)
7. [Key Features](#key-features)
8. [API Reference](#api-reference)
9. [Deployment](#deployment)

---

## Overview

**SkillLink** is an AI-powered hiring platform connecting skilled blue-collar workers (carpenters, plumbers, electricians, etc.) with companies. The platform is designed for semi-literate users with icon-driven, visual interfaces.

### Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: OpenAI GPT for resume extraction
- **PDF Generation**: ReportLab
- **Email**: n8n webhook integration
- **Authentication**: JWT tokens

### Ports
- Backend: `http://127.0.0.1:8000`
- Frontend: `http://localhost:3000`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HomePage   │  │ Worker Pages │  │ Company Pages│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │  Resume  │  │   Jobs   │  │ Company  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                     │
│  Users │ Resumes │ Jobs │ Companies │ Notifications         │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend

### Directory Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx           # Landing page
│   │   ├── ParagraphPage.jsx      # Voice/text input
│   │   ├── FormPage.jsx           # Step-by-step form
│   │   ├── Profile.jsx            # Worker profile view
│   │   ├── Jobs.jsx               # Job listings
│   │   └── company/               # Company-specific pages
│   ├── components/
│   │   ├── Header.jsx             # Navigation header
│   │   ├── LoginModal.jsx         # Login popup
│   │   ├── RegisterModal.jsx      # Registration popup
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── RoleContext.jsx        # User role (worker/company)
│   └── services/
│       └── api.js                 # API calls
```

### Key Pages

#### 1. HomePage (`/`)
**Purpose**: Landing page with platform overview

**Features**:
- **Hero Section**: 
  - Dynamic worker carousel (auto-rotates every 3 seconds)
  - Shows published worker profiles with photos
  - Clickable to view worker details (requires login)
  
- **How It Works** (3 interactive cards):
  - **Create Profile**: Opens modal with 2 options
    - "Describe Your Work" → `/paragraph`
    - "Fill Through Forms" → `/form`
  - **AI Resume Generated**: Smart routing
    - No profile → Create profile modal
    - Has profile → `/profile` page
  - **Get Hired**: Navigate to `/jobs`

- **Worker Features Carousel**: 9 features, 3 visible at a time
- **Company Features Carousel**: 7 features, 3 visible at a time
- **Trust & Safety**: 3 cards with emoji icons
- **Stats Section**: Dynamic worker/company counts

**State Management**:
```javascript
const [publishedWorkers, setPublishedWorkers] = useState([]);
const [currentWorkerIndex, setCurrentWorkerIndex] = useState(0);
const [showProfileOptionsModal, setShowProfileOptionsModal] = useState(false);
```

**API Calls**:
- `GET /workers/` - Fetch published workers

---

#### 2. ParagraphPage (`/paragraph`)
**Purpose**: Create profile by describing work (text or voice)

**Features**:
- Text area for manual input
- Voice recorder component
- Multi-language support (English, Tamil, Hindi)
- AI extracts structured data from description

**Flow**:
1. User writes/speaks about their work
2. Submit to backend
3. AI processes and extracts fields
4. Navigate to profile page

---

#### 3. FormPage (`/form`)
**Purpose**: Step-by-step guided form

**Features**:
- Trade selector with icons
- Experience input
- Skills/specializations
- Location details
- Photo upload
- Availability settings

---

#### 4. Profile (`/profile`)
**Purpose**: View/edit worker profile

**Features**:
- Profile photo display
- Personal details
- Trade and skills
- Work history
- Template selector (5 PDF styles)
- Download resume button
- Publish/unpublish toggle
- Rating display

---

#### 5. Jobs (`/jobs`)
**Purpose**: Browse and apply for jobs

**Features**:
- Job listings filtered by trade
- Apply button
- Application status tracking
- Email notifications on acceptance

---

### Components

#### Header
- Logo (128px height, centered)
- Navigation links
- Login/Register buttons
- Role switcher (Worker ↔ Company)
- Notification bell

#### LoginModal
- Email/phone + password
- Google OAuth option
- Switch to register link

#### RegisterModal
- Username, phone, email, password
- Role selection (worker/company)
- Switch to login link

#### FeaturesCarousel
- Reusable carousel component
- Shows 3 cards at a time
- Page-by-page navigation
- Auto-loop
- Dot indicators

---

### Context Providers

#### AuthContext
```javascript
{
  isAuthenticated: boolean,
  user: object,
  login: (credentials) => Promise,
  logout: () => void,
  register: (data) => Promise
}
```

#### RoleContext
```javascript
{
  role: 'worker' | 'company',
  switchRole: (newRole) => void
}
```

---

### Styling

**Design System**:
- Primary Color: `#1e40af` (blue-800)
- Secondary: `#3b82f6` (blue-500)
- Gradient: `from-[#3b82f6] to-[#1e40af]`

**Key Classes**:
- `.premium-card`: Elevated card with shadow
- `.step-card`: How It Works cards
- `.feature-card`: Feature carousel cards
- `.animate-float`: Floating animation
- `.animate-fade-in`: Fade in animation
- `.animate-scale-in`: Scale in animation

**Hover Effects**:
- `-translate-y-2`: Lift up
- `hover:shadow-2xl`: Enhanced shadow
- `hover:scale-110`: Icon scale
- `hover:border-blue-400`: Border color change

---

## Backend

### Directory Structure
```
app/
├── routers/
│   ├── auth.py              # Authentication endpoints
│   ├── resume.py            # Resume CRUD
│   ├── job.py               # Job postings
│   ├── company.py           # Company profiles
│   ├── worker.py            # Worker search
│   ├── review.py            # Ratings/reviews
│   └── notification.py      # Notifications
├── services_pdf/
│   ├── base_pdf.py          # Base PDF generator
│   ├── executive_pdf.py     # Executive template
│   ├── modern_pdf.py        # Modern template
│   ├── sidebar_pdf.py       # Sidebar template
│   ├── construction_pdf.py  # Construction template
│   └── compact_pdf.py       # Compact template
├── models.py                # Database models
├── schemas.py               # Pydantic schemas
├── database.py              # DB connection
├── auth.py                  # JWT utilities
├── services.py              # AI resume extraction
└── main.py                  # FastAPI app
```

---

### Key Routers

#### 1. Authentication (`/auth`)

**POST /auth/register**
- Create new user account
- Body: `{ username, phone_number, email, password, role }`
- Returns: JWT token

**POST /auth/login**
- Login with credentials
- Body: `{ username, password }`
- Returns: JWT token

**POST /auth/google**
- Google OAuth login
- Body: `{ token }`
- Returns: JWT token

**GET /auth/me**
- Get current user info
- Requires: Bearer token
- Returns: User object

---

#### 2. Resume (`/resumes`)

**POST /resumes/**
- Create resume from raw text
- Body: `{ raw_input: string }`
- AI extracts structured data
- Returns: Resume object

**GET /resumes/me**
- Get current user's resume
- Requires: Authentication
- Returns: Resume object

**GET /resumes/{id}**
- Get specific resume
- Returns: Resume object

**PUT /resumes/{id}**
- Update resume
- Body: Resume fields
- Returns: Updated resume

**PATCH /resumes/{id}/publish**
- Publish profile (make visible to companies)
- Returns: `{ is_published: true }`

**PATCH /resumes/{id}/unpublish**
- Unpublish profile
- Returns: `{ is_published: false }`

**GET /resumes/{id}/download**
- Download resume as PDF
- Query: `?template=executive`
- Returns: PDF file

**POST /resumes/{id}/upload-photo**
- Upload profile photo
- Body: FormData with file
- Returns: `{ photo_url }`

**GET /resumes/{id}/photo**
- Get profile photo
- Returns: Image file

---

#### 3. Worker Search (`/workers`)

**GET /workers/**
- Get all published workers (public endpoint)
- Query params:
  - `published_only`: boolean (default: true)
  - `limit`: int (default: 100)
- Returns: Array of workers

**GET /workers/search**
- Search workers with filters (company only)
- Query params:
  - `trade`: string
  - `min_experience`: int
  - `location`: string
  - `availability`: string
  - `own_tools`: boolean
  - `own_vehicle`: boolean
  - `min_rating`: float
  - `limit`: int
- Returns: Filtered workers

**GET /workers/{worker_id}**
- Get worker profile (company only)
- Returns: Worker object

**GET /workers/trades/list**
- Get list of all trades
- Returns: Array of trade names

---

#### 4. Jobs (`/jobs`)

**POST /jobs/**
- Create job posting (company only)
- Body: `{ client_name, phone_number, location, required_trade, job_description, budget }`
- Returns: Job object

**GET /jobs/**
- Get all jobs
- Query params:
  - `status`: open/closed
  - `trade`: string
- Returns: Array of jobs

**GET /jobs/{job_id}**
- Get specific job
- Returns: Job object

**POST /jobs/{job_id}/apply**
- Apply for job (worker only)
- Creates application and notification
- Sends email via n8n webhook
- Returns: Application object

**PATCH /jobs/{job_id}/applications/{application_id}/accept**
- Accept application (company only)
- Sends acceptance email
- Returns: Updated application

**PATCH /jobs/{job_id}/applications/{application_id}/reject**
- Reject application (company only)
- Returns: Updated application

---

#### 5. Company (`/companies`)

**POST /companies/**
- Create company profile
- Body: `{ company_name, company_type, location, contact_person, phone, email }`
- Returns: Company object

**GET /companies/me**
- Get current user's company
- Returns: Company object

**PUT /companies/{id}**
- Update company profile
- Returns: Updated company

---

#### 6. Reviews (`/resumes/{worker_id}/reviews`)

**POST /resumes/{worker_id}/reviews**
- Add review for worker
- Body: `{ client_name, rating, comment }`
- Returns: Review object

**GET /resumes/{worker_id}/reviews**
- Get all reviews for worker
- Returns: Array of reviews

**GET /resumes/{worker_id}/reviews/stats**
- Get review statistics
- Returns: `{ count, average }`

---

#### 7. Notifications (`/notifications`)

**GET /notifications/**
- Get user notifications
- Query: `?unread_only=true`
- Returns: Array of notifications

**PATCH /notifications/{id}/read**
- Mark notification as read
- Returns: Updated notification

**DELETE /notifications/{id}**
- Delete notification
- Returns: Success message

---

### AI Resume Extraction

**Service**: `app/services.py`

**Function**: `extract_resume_data(raw_input: str)`

**Process**:
1. Send raw text to OpenAI GPT-4
2. Extract structured fields:
   - Full name
   - Phone number
   - Location (village, district, state)
   - Primary trade
   - Years of experience
   - Specializations
   - Tools handled
   - Work background
   - Service type
   - Availability
   - Expected wage
   - Education level
   - Languages spoken
3. Generate professional summary
4. Calculate resume score (0-100)
5. Return structured JSON

**Prompt Engineering**:
- Handles multiple languages (English, Tamil, Hindi)
- Extracts from unstructured text
- Handles voice transcriptions
- Fills missing fields with defaults

---

### PDF Generation

**Templates**:
1. **Executive**: Professional, clean layout
2. **Modern**: Colorful, modern design
3. **Sidebar**: Two-column with sidebar
4. **Construction**: Industry-specific
5. **Compact**: Single-page condensed

**Features**:
- Profile photo integration
- QR code with contact info
- Rating stars display
- Multi-language support
- Professional formatting
- Downloadable as PDF

---

## Database

### Models

#### User
```python
{
  id: int,
  username: string,
  phone_number: string,
  email: string,
  hashed_password: string,
  is_google_user: boolean,
  google_id: string,
  role: 'worker' | 'company',
  created_at: datetime,
  updated_at: datetime
}
```

#### Resume
```python
{
  id: int,
  user_id: int,
  raw_input: text,
  full_name: string,
  phone_number: string,
  profile_photo: string,
  village_or_city: string,
  district: string,
  state: string,
  primary_trade: string,
  years_of_experience: string,
  specializations: text,
  tools_handled: text,
  worked_as: string,
  company_name: string,
  project_types: text,
  service_type: string,
  availability: string,
  travel_radius: string,
  expected_wage: string,
  own_tools: boolean,
  own_vehicle: boolean,
  projects_completed: int,
  client_rating: float,
  reference_available: boolean,
  is_published: boolean,
  education_level: string,
  technical_training: string,
  languages_spoken: text,
  professional_summary: text,
  resume_score: int,
  ai_confidence_score: int,
  detected_language: string,
  resume_template: string,
  created_at: datetime,
  updated_at: datetime
}
```

#### JobRequest
```python
{
  id: int,
  company_id: int,
  client_name: string,
  phone_number: string,
  location: string,
  required_trade: string,
  job_description: text,
  budget: string,
  status: 'open' | 'closed',
  created_at: datetime,
  updated_at: datetime
}
```

#### JobApplication
```python
{
  id: int,
  job_id: int,
  worker_id: int,
  status: 'pending' | 'accepted' | 'rejected',
  created_at: datetime,
  updated_at: datetime
}
```

#### Company
```python
{
  id: int,
  user_id: int,
  company_name: string,
  company_type: string,
  location: string,
  contact_person: string,
  phone: string,
  email: string,
  created_at: datetime,
  updated_at: datetime
}
```

#### Review
```python
{
  id: int,
  worker_id: int,
  client_name: string,
  rating: int (1-5),
  comment: text,
  created_at: datetime
}
```

#### Notification
```python
{
  id: int,
  user_id: int,
  title: string,
  message: text,
  type: string,
  related_id: int,
  is_read: boolean,
  created_at: datetime
}
```

#### ApplicationLog
```python
{
  id: int,
  worker_id: int,
  job_id: int,
  application_id: int,
  email_trigger_status: string,
  webhook_response_code: int,
  webhook_response_body: text,
  error_message: text,
  created_at: datetime
}
```

---

## Authentication

### JWT Token System

**Token Generation**:
```python
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
```

**Token Verification**:
```python
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    user_id = payload.get("sub")
    return get_user_by_id(user_id)
```

**Storage**:
- Frontend: `localStorage.getItem('token')`
- Header: `Authorization: Bearer <token>`

**Protected Routes**:
- All `/resumes/me` endpoints
- All `/jobs/apply` endpoints
- All `/companies` endpoints
- All `/workers/search` endpoints (company only)

---

## Key Features

### 1. Dual Role System
- Users can be **workers** or **companies**
- Role switcher in header
- Different dashboards and features per role
- Role-based route protection

### 2. AI Resume Generation
- Natural language input (text or voice)
- Multi-language support
- Automatic field extraction
- Professional summary generation
- Quality scoring

### 3. Profile Publishing
- Workers can publish/unpublish profiles
- Only published profiles visible to companies
- Privacy control

### 4. Job Application System
- Companies post jobs
- Workers apply
- Status tracking (pending/accepted/rejected)
- Email notifications via n8n

### 5. Email Notifications
- Application received (to company)
- Application accepted (to worker)
- Uses n8n webhook integration
- Sends to user's login email (`User.email`)

### 6. Worker Search
- Filter by trade, location, experience
- Filter by tools/vehicle ownership
- Filter by rating
- Pagination support

### 7. Rating System
- Companies rate workers after job completion
- 1-5 star rating
- Comments/reviews
- Average rating calculation
- Verified worker badges (20+ projects, 4+ rating)

### 8. PDF Resume Templates
- 5 professional templates
- Customizable design
- Profile photo integration
- QR code with contact
- Downloadable

### 9. Photo Upload
- Profile photo support
- Image optimization
- Fallback to initials avatar
- Display in carousel and profile

### 10. Responsive Design
- Mobile-first approach
- Icon-driven for semi-literate users
- Touch-friendly buttons
- Smooth animations

---

## API Reference

### Base URL
```
http://127.0.0.1:8000
```

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

### Common Response Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

### Example API Calls

#### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "john_carpenter",
  "phone_number": "9876543210",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "worker"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### Create Resume
```bash
POST /resumes/
Authorization: Bearer <token>
Content-Type: application/json

{
  "raw_input": "I am Ravi, a carpenter with 10 years experience. I can make furniture, doors, windows. I have my own tools. Contact: 9876543210"
}

Response:
{
  "id": 1,
  "full_name": "Ravi",
  "primary_trade": "Carpenter",
  "years_of_experience": "10 years",
  "phone_number": "9876543210",
  "own_tools": true,
  ...
}
```

#### Search Workers
```bash
GET /workers/search?trade=Carpenter&location=Chennai&min_rating=4
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "full_name": "Ravi Kumar",
    "primary_trade": "Carpenter",
    "location": "Chennai",
    "client_rating": 4.5,
    "is_published": true
  },
  ...
]
```

#### Apply for Job
```bash
POST /jobs/5/apply
Authorization: Bearer <token>

Response:
{
  "id": 10,
  "job_id": 5,
  "worker_id": 1,
  "status": "pending",
  "created_at": "2024-03-07T10:30:00"
}
```

---

## Deployment

### Environment Variables

**Backend (.env)**:
```env
DATABASE_URL=postgresql://user:password@localhost/skilllink
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=sk-...
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
```

**Frontend (.env)**:
```env
VITE_API_URL=http://127.0.0.1:8000
```

### Running Locally

**Backend**:
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python create_users_table.py
python create_companies_table.py
python add_role_to_users.py
python add_is_published_field.py

# Start server
python -m uvicorn app.main:app --reload --port 8000
# OR
start_backend.bat
```

**Frontend**:
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# OR
restart_frontend.bat
```

### Database Setup

**PostgreSQL**:
```sql
CREATE DATABASE skilllink;
CREATE USER skilllink_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE skilllink TO skilllink_user;
```

### Production Deployment

**Backend**:
- Use Gunicorn with Uvicorn workers
- Set up HTTPS with SSL certificate
- Configure CORS for production domain
- Use environment variables for secrets
- Set up database backups

**Frontend**:
- Build: `npm run build`
- Deploy to Vercel/Netlify/AWS S3
- Configure environment variables
- Set up CDN for assets

**Database**:
- Use managed PostgreSQL (AWS RDS, DigitalOcean)
- Enable automated backups
- Set up read replicas for scaling
- Configure connection pooling

---

## Testing

### Backend Tests
```bash
# Test authentication
python test_auth_packages.py

# Test company features
python test_company_backend.py

# Test worker profile
python debug_worker_profile.py

# Test jobs system
python test_full_application_flow.py

# Test webhooks
python test_n8n_webhook.py
```

### Frontend Testing
- Manual testing in browser
- Check responsive design
- Test authentication flow
- Verify API integration
- Test file uploads

---

## Troubleshooting

### Common Issues

**1. Backend won't start**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check port 8000 is available

**2. Frontend can't connect to backend**
- Verify backend is running on port 8000
- Check CORS settings in main.py
- Verify VITE_API_URL in frontend/.env

**3. Authentication fails**
- Check SECRET_KEY is set
- Verify token is being sent in headers
- Check token expiration

**4. AI resume extraction fails**
- Verify OPENAI_API_KEY is valid
- Check API quota/billing
- Review input text format

**5. Email notifications not working**
- Verify N8N_WEBHOOK_URL is correct
- Check n8n workflow is active
- Review application logs

**6. Photos not uploading**
- Check uploads/ directory exists
- Verify file size limits
- Check file permissions

---

## Future Enhancements

1. **Mobile App**: React Native version
2. **Video Profiles**: Workers can upload video introductions
3. **Chat System**: Real-time messaging between workers and companies
4. **Payment Integration**: Escrow system for job payments
5. **Geolocation**: Map-based worker search
6. **Analytics Dashboard**: Insights for companies
7. **Skill Tests**: Verification tests for trades
8. **Referral System**: Worker referral rewards
9. **Multi-language UI**: Full UI translation
10. **Advanced Filters**: More search criteria

---

## Support

For issues or questions:
- Check this documentation
- Review code comments
- Check existing test files
- Review .txt documentation files in root

---

## License

Proprietary - All rights reserved

---

**Last Updated**: March 7, 2026
**Version**: 3.0.0
