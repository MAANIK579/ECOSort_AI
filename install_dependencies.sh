#!/bin/bash

echo "EcoSortAI Dependency Installer for Unix/Linux/Mac"
echo "=================================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ from https://python.org"
    exit 1
fi

echo "Python found. Checking version..."
python3 --version

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "ERROR: pip3 is not installed"
    echo "Please install pip3 first"
    exit 1
fi

echo "pip3 found. Installing dependencies..."
echo

# Upgrade pip first
echo "Upgrading pip..."
python3 -m pip install --upgrade pip

# Install requirements
echo "Installing requirements from requirements.txt..."
if python3 -m pip install -r requirements.txt; then
    echo "All dependencies installed successfully!"
else
    echo
    echo "WARNING: Some packages failed to install from requirements.txt"
    echo "Trying to install packages individually..."
    echo
    
    # Install packages individually
    python3 -m pip install Flask==2.3.3
    python3 -m pip install Flask-CORS==4.0.0
    python3 -m pip install tensorflow==2.13.0
    python3 -m pip install opencv-python==4.8.1.78
    python3 -m pip install Pillow==10.0.1
    python3 -m pip install numpy==1.24.3
    python3 -m pip install pandas==2.0.3
    python3 -m pip install scikit-learn==1.3.0
    python3 -m pip install transformers==4.33.2
    python3 -m pip install torch==2.0.1
    python3 -m pip install torchvision==0.15.2
    python3 -m pip install matplotlib==3.7.2
    python3 -m pip install seaborn==0.12.2
    python3 -m pip install plotly==5.16.1
    python3 -m pip install requests==2.31.0
    python3 -m pip install python-dotenv==1.0.0
    python3 -m pip install gunicorn==21.2.0
    python3 -m pip install Keras==2.13.1
    python3 -m pip install h5py==3.8.0
    python3 -m pip install joblib==1.3.2
fi

echo
echo "=================================================="
echo "Installation completed!"
echo
echo "Next steps:"
echo "1. Run 'python3 test_dependencies.py' to verify all packages work"
echo "2. Run 'python3 backend/app.py' to start the Flask server"
echo "3. Open http://localhost:5000 in your browser"
echo
