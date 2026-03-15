@echo off
echo Stopping backend server...
taskkill /F /IM uvicorn.exe 2>nul
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend server...
start "SkillLink Backend" cmd /k "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Backend restarted!
echo Check the new window for backend logs.
pause
