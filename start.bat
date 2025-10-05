@echo off
echo Starting Comla App...

REM Start backend in background
start "Backend" cmd /c "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 5 /nobreak > nul

REM Start frontend
start "Frontend" cmd /c "set PORT=3000 && npm start"

echo Both backend and frontend are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000