#!/usr/bin/env bash

echo "==================================================="
echo "          Launching Swift AI OS Engine"
echo "==================================================="

# 1. Initialize Database
echo "[1/3] Initializing Database Schema..."
cd "$(dirname "$0")/backend" || exit 1
python init_db.py

# 2. Start Backend
echo "[2/3] Starting FastAPI Backend on http://localhost:8000 ..."
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

# 3. Start Frontend
echo "[3/3] Starting Vite Frontend on http://localhost:5173 ..."
cd "../frontend" || exit 1
npm run dev &

echo ""
echo "==================================================="
echo "     Swift AI OS is running!"
echo "     - Frontend UI:  http://localhost:5173"
echo "     - Backend API: http://localhost:8000/docs"
echo "==================================================="
echo ""
wait
