@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo           Launching Swift AI OS Engine
echo ===================================================

:: 1. Check & Initialize SQLite DB Tables
echo [1/3] Initializing Database Schema...
cd /d "%~dp0backend"
python init_db.py
if errorlevel 1 (
    echo [ERROR] Database initialization failed.
    pause
    exit /b 1
)

:: 2. Launch FastAPI Backend Server in background window
echo [2/3] Starting FastAPI Backend on http://localhost:8000 ...
start /b "Swift AI OS - Backend" cmd /c "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: 3. Launch Vite Frontend Dev Server in background window
echo [3/3] Starting Vite Frontend on http://localhost:5173 ...
start /b "Swift AI OS - Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================
echo     Swift AI OS is starting up successfully!
echo     - Frontend UI:  http://localhost:5173
echo     - Backend API: http://localhost:8000/docs
echo ===================================================
echo.
