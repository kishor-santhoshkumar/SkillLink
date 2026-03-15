# SkillLink Deployment Guide - Free Stack

## 🥇 Recommended Free Deployment Stack

```
Frontend   → Vercel (React/Vite)
Backend    → Render (Python/FastAPI)
Database   → Supabase (PostgreSQL)
Automation → n8n (Email)
```

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Start

- [ ] GitHub account created
- [ ] Project pushed to GitHub
- [ ] Vercel account created
- [ ] Render account created
- [ ] Supabase account created
- [ ] n8n account (or self-hosted)
- [ ] Environment variables documented
- [ ] CORS configured
- [ ] Database connection string ready

---

## 🚀 Step 1: Push Project to GitHub

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - SkillLink platform"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `skilllink`
3. Copy the commands shown

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/skilllink.git
git branch -M main
git push -u origin main
```

### 1.4 Verify on GitHub

- Visit: https://github.com/YOUR_USERNAME/skilllink
- Confirm all files are there

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 2.2 Import Project

1. Click "New Project"
2. Select your GitHub repository: `skilllink`
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Environment Variables

Add in Vercel dashboard:

```
VITE_API_URL=https://skilllink-api.onrender.com
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your frontend URL: `https://skilllink.vercel.app`

### 2.5 Verify Frontend

- Visit your Vercel URL
- Check if it loads
- Open browser console for errors

---

## ⚙️ Step 3: Deploy Backend to Render

### 3.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render

### 3.2 Create requirements.txt

In root directory, create `requirements.txt`:

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
pydantic==2.5.0
python-multipart==0.0.6
pyjwt==2.8.1
passlib==1.7.4
bcrypt==4.1.1
python-jose==3.3.0
aiofiles==23.2.1
requests==2.31.0
```

### 3.3 Create Render Configuration

Create `render.yaml` in root:

```yaml
services:
  - type: web
    name: skilllink-api
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        scope: build
      - key: SECRET_KEY
        scope: build
      - key: N8N_WEBHOOK_URL
        scope: build
```

### 3.4 Deploy on Render

1. Go to https://dashboard.render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository
5. Configure:
   - **Name**: `skilllink-api`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

### 3.5 Add Environment Variables

In Render dashboard, add:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your-secret-key-here
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
ALGORITHM=HS256
```

### 3.6 Deploy

1. Click "Create Web Service"
2. Wait for deployment
3. Your backend URL: `https://skilllink-api.onrender.com`

### 3.7 Verify Backend

```bash
curl https://skilllink-api.onrender.com/health
```

---

## 🗄️ Step 4: Setup Database on Supabase

### 4.1 Create Supabase Account

1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project

### 4.2 Create Project

1. Click "New Project"
2. **Project Name**: `skilllink`
3. **Database Password**: Create strong password
4. **Region**: Choose closest to you
5. Click "Create new project"

### 4.3 Get Connection String

1. Go to "Settings" → "Database"
2. Copy connection string
3. Format: `postgresql://user:password@host:port/dbname`

### 4.4 Update Backend Environment

In Render dashboard, update:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
```

### 4.5 Run Migrations

Connect to Supabase and run:

```bash
# From your local machine
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
python add_verification_badges.py
```

### 4.6 Verify Database

1. Go to Supabase dashboard
2. Click "SQL Editor"
3. Run: `SELECT * FROM resumes LIMIT 1;`
4. Verify tables exist

---

## 🔧 Step 5: Configure CORS

### 5.1 Update Backend CORS

In `app/main.py`, update:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skilllink.vercel.app",  # Your Vercel URL
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5.2 Deploy Backend Again

```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-redeploy.

---

## 📧 Step 6: Configure n8n

### 6.1 Option A: Use n8n Cloud (Free Trial)

1. Go to https://n8n.cloud
2. Sign up
3. Create workflow for email notifications
4. Get webhook URL

### 6.2 Option B: Self-Host n8n

```bash
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 6.3 Configure Webhook

1. In n8n, create workflow
2. Add "Webhook" trigger
3. Copy webhook URL
4. Add to Render environment: `N8N_WEBHOOK_URL`

---

## 🔐 Step 7: Environment Variables Setup

### 7.1 Create .env.production

```
# Database
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres

# Security
SECRET_KEY=your-very-long-random-secret-key-here
ALGORITHM=HS256

# Email
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# Frontend
VITE_API_URL=https://skilllink-api.onrender.com
```

### 7.2 Add to Render

1. Go to Render dashboard
2. Select your service
3. Go to "Environment"
4. Add all variables

### 7.3 Add to Vercel

1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add: `VITE_API_URL=https://skilllink-api.onrender.com`

---

## ✅ Step 8: Verify Deployment

### 8.1 Test Frontend

```bash
# Visit your Vercel URL
https://skilllink.vercel.app

# Check:
- Page loads
- No console errors
- Can navigate
```

### 8.2 Test Backend

```bash
# Health check
curl https://skilllink-api.onrender.com/health

# Get workers
curl https://skilllink-api.onrender.com/workers/

# Get badges
curl https://skilllink-api.onrender.com/verification/workers/1/badges
```

### 8.3 Test Database

```bash
# From Supabase dashboard
SELECT COUNT(*) FROM resumes;
SELECT COUNT(*) FROM users;
```

### 8.4 Test Email

1. Create a job
2. Apply for job
3. Check if email is sent
4. Verify in n8n logs

---

## 🚨 Troubleshooting

### Frontend Not Loading

**Problem**: Blank page or 404
**Solution**:
```bash
# Check build
npm run build

# Check environment variables
echo $VITE_API_URL

# Check browser console for errors
```

### Backend Not Responding

**Problem**: 502 Bad Gateway
**Solution**:
```bash
# Check Render logs
# Go to Render dashboard → Logs

# Verify database connection
# Check DATABASE_URL in environment

# Restart service
# Click "Manual Deploy" in Render
```

### Database Connection Failed

**Problem**: Cannot connect to Supabase
**Solution**:
```bash
# Verify connection string
# Format: postgresql://user:password@host:port/dbname

# Check password
# Go to Supabase → Settings → Database

# Test connection
psql "postgresql://postgres:PASSWORD@host:5432/postgres"
```

### CORS Errors

**Problem**: Frontend can't reach backend
**Solution**:
```python
# Update CORS in app/main.py
allow_origins=["https://skilllink.vercel.app"]

# Redeploy backend
git push
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                       │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │  Vercel (Frontend)     │
        │  skilllink.vercel.app  │
        └────────────┬───────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │  Render (Backend)      │
        │  skilllink-api.onrender│
        └────────────┬───────────┘
                     │
        ┌────────────┴───────────┐
        ↓                        ↓
   ┌─────────────┐      ┌──────────────┐
   │  Supabase   │      │    n8n       │
   │ PostgreSQL  │      │   Emails     │
   └─────────────┘      └──────────────┘
```

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | Unlimited | Free |
| Render | 750 hours/month | Free |
| Supabase | 500MB DB | Free |
| n8n Cloud | 30-day trial | Free |
| **Total** | | **Free** |

---

## 🎯 Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy frontend to Vercel
3. ✅ Deploy backend to Render
4. ✅ Setup database on Supabase
5. ✅ Configure n8n
6. ✅ Test all endpoints
7. ✅ Monitor logs
8. ✅ Gather user feedback

---

## 📞 Support

### Vercel Support
- Docs: https://vercel.com/docs
- Status: https://www.vercelstatus.com

### Render Support
- Docs: https://render.com/docs
- Status: https://status.render.com

### Supabase Support
- Docs: https://supabase.com/docs
- Status: https://status.supabase.com

### n8n Support
- Docs: https://docs.n8n.io
- Community: https://community.n8n.io

---

## ✨ You're Ready to Deploy!

Follow the steps above and your SkillLink platform will be live on the internet! 🚀

**Estimated time**: 30-45 minutes
**Cost**: Free
**Scalability**: Can upgrade anytime

Good luck! 🎉
