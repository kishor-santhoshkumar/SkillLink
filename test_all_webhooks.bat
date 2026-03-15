@echo off
echo ================================================================================
echo TESTING ALL N8N WEBHOOKS
echo ================================================================================
echo.
echo Testing Webhook 1: Worker Application (Company receives email)
echo --------------------------------------------------------------------------------
python test_n8n_webhook.py
echo.
echo.
echo Testing Webhook 2: Job Acceptance (Worker receives email)
echo --------------------------------------------------------------------------------
python test_job_acceptance_webhook.py
echo.
echo.
echo ================================================================================
echo VIEWING APPLICATION LOGS
echo ================================================================================
echo.
python view_application_logs.py
echo.
pause
