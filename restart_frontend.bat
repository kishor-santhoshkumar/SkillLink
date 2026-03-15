@echo off
echo ============================================================
echo Restarting Frontend for Template Selector
echo ============================================================
echo.
echo This will restart the frontend development server
echo to show the new template selector component.
echo.
echo Press Ctrl+C in the terminal running "npm run dev" first,
echo then run this script.
echo.
pause

cd frontend
echo.
echo Starting frontend development server...
echo.
npm run dev
