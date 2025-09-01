#!/bin/bash

echo "========================================"
echo "    EcoSortAI - Quick Start Script"
echo "========================================"
echo

echo "Starting EcoSortAI application..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "1. Installing Python dependencies..."
cd backend
pip3 install -r requirements.txt
cd ..

echo "2. Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "3. Starting Backend Server..."
cd backend
gnome-terminal --title="EcoSortAI Backend" -- bash -c "python3 app.py; exec bash" &
cd ..

echo "4. Starting Frontend Application..."
cd frontend
gnome-terminal --title="EcoSortAI Frontend" -- bash -c "npm start; exec bash" &
cd ..

echo
echo "========================================"
echo "    EcoSortAI is starting up!"
echo "========================================"
echo
echo "Backend API: http://localhost:5000"
echo "Frontend App: http://localhost:3000"
echo
echo "Opening application in browser..."
sleep 3

# Try to open browser (works on most Linux distributions)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v gnome-open &> /dev/null; then
    gnome-open http://localhost:3000
elif command -v kde-open &> /dev/null; then
    kde-open http://localhost:3000
else
    echo "Please manually open http://localhost:3000 in your browser"
fi

echo
echo "Application started! Keep the terminal windows open to run the services."
echo "Press Ctrl+C to stop all services."
echo

# Wait for user input
read -p "Press Enter to stop all services..."
echo "Stopping services..."
pkill -f "python3 app.py"
pkill -f "npm start"
echo "Services stopped."
