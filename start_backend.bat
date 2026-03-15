@echo off
echo Starting SkillLink Backend...
echo.

REM Set environment variables
set GOOGLE_CLIENT_ID=480432487640-i2vq1bm9s1svprejijai1i2jjat063kn.apps.googleusercontent.com
set JWT_SECRET_KEY=skilllink-super-secret-jwt-key-2024-production-ready-min-32-characters
set DATABASE_URL=postgresql://postgres:Kiss1234@localhost:5432/skilllink

echo Environment variables set
echo Google Client ID: %GOOGLE_CLIENT_ID:~0,20%...
echo.

REM Start backend
echo Starting uvicorn...
uvicorn app.main:app --reload

pause
