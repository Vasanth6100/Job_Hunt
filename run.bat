@echo off
echo ========================================================
echo   Starting JobHunt Agent (Unified Frontend + Backend)
echo   Local AI Engine: all-MiniLM-L6-v2
echo ========================================================
echo.

cd /d "%~dp0\backend"

if not exist "venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found in backend\venv.
    pause
    exit /b 1
)

echo [*] Activating Python environment...
call .\venv\Scripts\activate.bat

echo [*] Launching Unified Server on http://localhost:8000 ...
echo [*] Open http://localhost:8000 in your browser.
echo.

python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
