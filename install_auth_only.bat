@echo off
echo Installing authentication packages only...
echo.

pip install python-jose
pip install cryptography
pip install passlib
pip install bcrypt
pip install python-multipart
pip install google-auth

echo.
echo Installation complete!
echo.
echo Now run: python create_users_table.py
echo Then run: uvicorn app.main:app --reload
echo.
pause
