@echo off
echo Installing Google OAuth package...
cd /d "%~dp0"
npm install @react-oauth/google
echo.
echo Installation complete!
echo Press any key to close...
pause > nul
