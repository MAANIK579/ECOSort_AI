@echo off
echo ========================================
echo    EcoSortAI - Quick Start Script
echo ========================================
echo.

echo Starting EcoSortAI application...
echo.

echo 1. Starting Backend Server...
cd backend
start "EcoSortAI Backend" cmd /k "python app.py"
cd ..

echo 2. Starting Frontend Application...
cd frontend
start "EcoSortAI Frontend" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo    EcoSortAI is starting up!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000

echo.
echo Application opened in your browser!
echo Keep the command windows open to run the services.
echo.
pause
