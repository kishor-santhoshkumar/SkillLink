@echo off
echo ================================================================================
echo N8N WEBHOOK STATUS CHECK
echo ================================================================================
echo.
echo Testing webhook connection...
echo.
python test_n8n_webhook.py
echo.
echo ================================================================================
echo VIEWING APPLICATION LOGS
echo ================================================================================
echo.
python view_application_logs.py
echo.
pause
