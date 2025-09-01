@echo off
echo EcoSortAI Dependency Installer for Windows
echo ===========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo Python found. Checking version...
python --version

echo.
echo Installing dependencies...
echo.

REM Upgrade pip first
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo Installing requirements from requirements.txt...
python -m pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo WARNING: Some packages failed to install from requirements.txt
    echo Trying to install packages individually...
    echo.
    
    REM Install packages individually
    python -m pip install Flask==2.3.3
    python -m pip install Flask-CORS==4.0.0
    python -m pip install tensorflow==2.13.0
    python -m pip install opencv-python==4.8.1.78
    python -m pip install Pillow==10.0.1
    python -m pip install numpy==1.24.3
    python -m pip install pandas==2.0.3
    python -m pip install scikit-learn==1.3.0
    python -m pip install transformers==4.33.2
    python -m pip install torch==2.0.1
    python -m pip install torchvision==0.15.2
    python -m pip install matplotlib==3.7.2
    python -m pip install seaborn==0.12.2
    python -m pip install plotly==5.16.1
    python -m pip install requests==2.31.0
    python -m pip install python-dotenv==1.0.0
    python -m pip install gunicorn==21.2.0
    python -m pip install Keras==2.13.1
    python -m pip install h5py==3.8.0
    python -m pip install joblib==1.3.2
)

echo.
echo ===========================================
echo Installation completed!
echo.
echo Next steps:
echo 1. Run 'python test_dependencies.py' to verify all packages work
echo 2. Run 'python backend/app.py' to start the Flask server
echo 3. Open http://localhost:5000 in your browser
echo.
pause
