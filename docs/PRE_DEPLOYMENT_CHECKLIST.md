# Pre-Deployment Configuration Checklist

## ✅ Must Complete Before Deployment

---

## 1️⃣ GitHub Setup

- [ ] GitHub account created
- [ ] Repository created: `skilllink`
- [ ] Project pushed to GitHub
- [ ] All files committed
- [ ] `.gitignore` configured properly
- [ ] No sensitive data in repo

**Verify**:
```bash
git remote -v
git log --oneline
```

---

## 2️⃣ Frontend Configuration

### Environment Variables

Create `frontend/.env.production`:

```
VITE_API_URL=https://skilllink-api.onrender.com
```

- [ ] `.env.production` created
- [ ] API URL set correctly
- [ ] No hardcoded URLs in code

### Build Verification

```bash
cd frontend
npm run build
```

- [ ] Build completes without errors
- [ ] `dist/` folder created
- [ ] No console warnings

### Vercel Configuration

- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Build settings configured:
  - Framework: Vite
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`

---

## 3️⃣ Backend Configuration

### Environment Variables

Create `.env.production`:

```
# Database
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres

# Security
SECRET_KEY=your-very-long-random-secret-key-here
ALGORITHM=HS256

# Email
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

- [ ] `.env.production` created
- [ ] All variables filled in
- [ ] No placeholder values
- [ ] `.env` files in `.gitignore`

### CORS Configuration

Update `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skilllink.vercel.app",
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

- [ ] CORS updated with Vercel URL
- [ ] Localhost URLs kept for development
- [ ] Changes committed to GitHub

### Requirements.txt

Create `requirements.txt`:

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

- [ ] `requirements.txt` created
- [ ] All dependencies listed
- [ ] Versions pinned
- [ ] File committed to GitHub

### Render Configuration

Create `render.yaml`:

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

- [ ] `render.yaml` created
- [ ] File committed to GitHub
- [ ] Render account created
- [ ] GitHub connected to Render

---

## 4️⃣ Database Configuration

### Supabase Setup

- [ ] Supabase account created
- [ ] Project created: `skilllink`
- [ ] Database password set
- [ ] Region selected
- [ ] Connection string copied

### Connection String Format

```
postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
```

- [ ] Connection string verified
- [ ] Password correct
- [ ] Project ID correct
- [ ] Port is 5432

### Database Migration

```bash
export DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"
python add_verification_badges.py
```

- [ ] Migration script run successfully
- [ ] All tables created
- [ ] Verification fields added
- [ ] No errors in output

### Verify Tables

In Supabase SQL Editor:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

- [ ] `users` table exists
- [ ] `resumes` table exists
- [ ] `companies` table exists
- [ ] `job_requests` table exists
- [ ] `reviews` table exists
- [ ] All verification fields present

---

## 5️⃣ Email/Automation Setup

### n8n Configuration

**Option A: n8n Cloud**
- [ ] n8n Cloud account created
- [ ] Workflow created
- [ ] Webhook URL generated
- [ ] Webhook URL added to `.env`

**Option B: Self-Hosted n8n**
- [ ] Docker installed
- [ ] n8n running locally
- [ ] Webhook URL accessible
- [ ] Webhook URL added to `.env`

### Email Workflow

- [ ] Webhook trigger configured
- [ ] Email node configured
- [ ] Gmail/SMTP credentials set
- [ ] Test email sent successfully

---

## 6️⃣ API Testing

### Local Testing

```bash
# Start backend
python start_backend.bat

# Test endpoints
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/workers/
curl http://127.0.0.1:8000/verification/workers/1/badges
```

- [ ] Health endpoint responds
- [ ] Workers endpoint responds
- [ ] Verification endpoint responds
- [ ] No errors in logs

### Database Testing

```bash
# Test database connection
python -c "from app.database import engine; engine.connect()"
```

- [ ] Database connection successful
- [ ] No connection errors
- [ ] Credentials correct

### Email Testing

```bash
# Test email notification
python test_verification_system.py
```

- [ ] Tests pass
- [ ] No errors
- [ ] Email sent successfully

---

## 7️⃣ Frontend Testing

### Build Test

```bash
cd frontend
npm run build
```

- [ ] Build succeeds
- [ ] No errors
- [ ] `dist/` folder created
- [ ] All assets included

### Local Testing

```bash
npm run dev
```

- [ ] Frontend loads
- [ ] Can navigate pages
- [ ] API calls work
- [ ] No console errors

### Environment Variables

- [ ] `VITE_API_URL` set correctly
- [ ] API calls use correct URL
- [ ] No hardcoded URLs

---

## 8️⃣ Security Checklist

### Sensitive Data

- [ ] No passwords in code
- [ ] No API keys in code
- [ ] No secrets in `.env` files
- [ ] `.env` files in `.gitignore`
- [ ] `.env.example` has placeholders only

### Environment Variables

- [ ] All secrets in environment variables
- [ ] No secrets in `render.yaml`
- [ ] No secrets in `vercel.json`
- [ ] Secrets added to Render dashboard
- [ ] Secrets added to Vercel dashboard

### CORS

- [ ] CORS configured for production URL
- [ ] Only necessary origins allowed
- [ ] Credentials enabled if needed
- [ ] Methods restricted appropriately

### Database

- [ ] Strong database password set
- [ ] Connection string not in code
- [ ] Database URL in environment variables
- [ ] SSL/TLS enabled (Supabase default)

---

## 9️⃣ Final Verification

### Code Quality

```bash
# Check for errors
python -m py_compile app/*.py
npm run build
```

- [ ] No Python syntax errors
- [ ] No JavaScript errors
- [ ] No TypeScript errors
- [ ] Build completes successfully

### Git Status

```bash
git status
git log --oneline -5
```

- [ ] All changes committed
- [ ] No uncommitted files
- [ ] Recent commits visible
- [ ] Ready to push

### Documentation

- [ ] README.md updated
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Setup instructions clear

---

## 🚀 Deployment Readiness

### Before Clicking Deploy

- [ ] All checklist items completed
- [ ] All tests passing
- [ ] All environment variables set
- [ ] Database migrated
- [ ] CORS configured
- [ ] Code committed to GitHub

### Deployment Order

1. [ ] Deploy frontend to Vercel
2. [ ] Deploy backend to Render
3. [ ] Verify database connection
4. [ ] Test all endpoints
5. [ ] Monitor logs
6. [ ] Gather feedback

---

## 📋 Quick Reference

### URLs After Deployment

```
Frontend:  https://skilllink.vercel.app
Backend:   https://skilllink-api.onrender.com
Database:  Supabase PostgreSQL
Emails:    n8n Webhook
```

### Environment Variables Needed

```
VITE_API_URL=https://skilllink-api.onrender.com
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
SECRET_KEY=your-secret-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
ALGORITHM=HS256
```

### Important Files

```
frontend/.env.production
.env.production
requirements.txt
render.yaml
app/main.py (CORS)
```

---

## ✅ Ready to Deploy?

If all items are checked, you're ready to deploy! 🚀

**Next**: Follow `DEPLOYMENT_GUIDE_FREE_STACK.md`

Good luck! 🎉
