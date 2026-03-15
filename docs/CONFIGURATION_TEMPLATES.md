# Configuration Templates - Copy & Paste Ready

Use these templates to configure your deployment. Copy, fill in your values, and save.

---

## 1. Frontend Environment Variables

**File**: `frontend/.env.production`

```env
# API Configuration
VITE_API_URL=https://skilllink-api.onrender.com
```

**Steps**:
1. Create file: `frontend/.env.production`
2. Copy content above
3. Replace `skilllink-api` with your Render app name
4. Save and commit

---

## 2. Backend Environment Variables

**File**: `.env.production`

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres

# Security
SECRET_KEY=your-very-long-random-secret-key-here-minimum-32-characters
ALGORITHM=HS256

# Email Automation
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# Optional: CORS (if needed)
ALLOWED_ORIGINS=https://skilllink.vercel.app,http://localhost:3000,http://127.0.0.1:3000
```

**Steps**:
1. Create file: `.env.production`
2. Copy content above
3. Replace placeholders:
   - `YOUR_PASSWORD`: Your Supabase database password
   - `YOUR_PROJECT`: Your Supabase project ID
   - `SECRET_KEY`: Generate random string (use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
   - `N8N_WEBHOOK_URL`: Your n8n webhook URL
4. Save (DO NOT commit to GitHub)

---

## 3. Python Requirements

**File**: `requirements.txt`

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

**Steps**:
1. Create file: `requirements.txt` (in root)
2. Copy content above
3. Save and commit to GitHub

---

## 4. Render Configuration

**File**: `render.yaml`

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
      - key: ALGORITHM
        scope: build
```

**Steps**:
1. Create file: `render.yaml` (in root)
2. Copy content above
3. Save and commit to GitHub

---

## 5. CORS Configuration

**File**: `app/main.py`

Find this section and replace:

```python
# BEFORE (current code)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AFTER (production code)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skilllink.vercel.app",  # Your Vercel URL
        "http://localhost:3000",          # Keep for local development
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Steps**:
1. Open: `app/main.py`
2. Find the CORS middleware section
3. Add your Vercel URL to `allow_origins`
4. Save and commit

---

## 6. Environment Variables for Render Dashboard

**Add these in Render Dashboard** → Your Service → Environment

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
SECRET_KEY=your-very-long-random-secret-key-here-minimum-32-characters
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
ALGORITHM=HS256
```

**Steps**:
1. Go to Render Dashboard
2. Select your service
3. Go to "Environment"
4. Add each variable
5. Click "Save"

---

## 7. Environment Variables for Vercel Dashboard

**Add these in Vercel Dashboard** → Your Project → Settings → Environment Variables

```
VITE_API_URL=https://skilllink-api.onrender.com
```

**Steps**:
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add the variable
5. Click "Save"

---

## 8. Supabase Connection String

**Format**:
```
postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres
```

**How to get**:
1. Go to Supabase Dashboard
2. Select your project
3. Go to "Settings" → "Database"
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

**Example**:
```
postgresql://postgres:abc123xyz@db.abcdefgh.supabase.co:5432/postgres
```

---

## 9. Generate Secret Key

**In Python**:
```python
import secrets
print(secrets.token_urlsafe(32))
```

**In Terminal**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Output Example**:
```
AbCdEfGhIjKlMnOpQrStUvWxYz1234567890_-
```

---

## 10. .gitignore Update

**File**: `.gitignore`

Make sure these are included:

```
# Environment variables
.env
.env.local
.env.production
.env.*.local

# Dependencies
node_modules/
__pycache__/
*.pyc
venv/
env/

# Build
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Uploads
uploads/
```

---

## 11. Vercel Configuration (Optional)

**File**: `vercel.json` (optional, in root)

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

---

## 12. Render Build Script (Optional)

**File**: `build.sh` (optional, in root)

```bash
#!/bin/bash
pip install -r requirements.txt
python add_verification_badges.py
```

---

## 📋 Checklist for Configuration

- [ ] `frontend/.env.production` created
- [ ] `.env.production` created (not committed)
- [ ] `requirements.txt` created and committed
- [ ] `render.yaml` created and committed
- [ ] `app/main.py` CORS updated
- [ ] `.gitignore` updated
- [ ] All files committed to GitHub
- [ ] Environment variables added to Render
- [ ] Environment variables added to Vercel
- [ ] Supabase connection string ready
- [ ] n8n webhook URL ready
- [ ] Secret key generated

---

## 🔒 Security Reminders

✅ **DO**:
- Store secrets in environment variables
- Use strong secret keys (32+ characters)
- Keep `.env` files in `.gitignore`
- Use HTTPS URLs only
- Rotate secrets regularly

❌ **DON'T**:
- Commit `.env` files to GitHub
- Use weak secret keys
- Hardcode URLs in code
- Share secret keys
- Use same secret for multiple services

---

## 🚀 Ready to Deploy?

1. ✅ Create all configuration files
2. ✅ Fill in all placeholders
3. ✅ Commit to GitHub
4. ✅ Add environment variables to services
5. ✅ Deploy!

**Next**: Follow `DEPLOYMENT_GUIDE_FREE_STACK.md`

Good luck! 🎉
