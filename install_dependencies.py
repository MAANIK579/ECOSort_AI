#!/usr/bin/env python3
"""
Installation script for EcoSortAI dependencies.
This script will install all required packages from requirements.txt
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{description}...")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {description} completed successfully")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed with error code {e.returncode}")
        if e.stderr:
            print(f"Error: {e.stderr}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error during {description}: {e}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("✗ Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✓ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def check_pip():
    """Check if pip is available"""
    try:
        import pip
        print("✓ pip is available")
        return True
    except ImportError:
        print("✗ pip is not available")
        return False

def upgrade_pip():
    """Upgrade pip to latest version"""
    return run_command(
        f"{sys.executable} -m pip install --upgrade pip",
        "Upgrading pip"
    )

def install_requirements():
    """Install packages from requirements.txt"""
    if not os.path.exists('requirements.txt'):
        print("✗ requirements.txt not found")
        return False
    
    return run_command(
        f"{sys.executable} -m pip install -r requirements.txt",
        "Installing requirements from requirements.txt"
    )

def install_individual_packages():
    """Install packages individually if requirements.txt fails"""
    packages = [
        "Flask==2.3.3",
        "Flask-CORS==4.0.0",
        "tensorflow==2.13.0",
        "opencv-python==4.8.1.78",
        "Pillow==10.0.1",
        "numpy==1.24.3",
        "pandas==2.0.3",
        "scikit-learn==1.3.0",
        "transformers==4.33.2",
        "torch==2.0.1",
        "torchvision==0.15.2",
        "matplotlib==3.7.2",
        "seaborn==0.12.2",
        "plotly==5.16.1",
        "requests==2.31.0",
        "python-dotenv==1.0.0",
        "gunicorn==21.2.0",
        "Keras==2.13.1",
        "h5py==3.8.0",
        "joblib==1.3.2"
    ]
    
    print("\nInstalling packages individually...")
    failed_packages = []
    
    for package in packages:
        if not run_command(
            f"{sys.executable} -m pip install {package}",
            f"Installing {package}"
        ):
            failed_packages.append(package)
    
    if failed_packages:
        print(f"\n✗ Failed to install {len(failed_packages)} packages:")
        for package in failed_packages:
            print(f"  - {package}")
        return False
    
    return True

def main():
    """Main installation process"""
    print("EcoSortAI Dependency Installer")
    print("=" * 40)
    
    # Check prerequisites
    if not check_python_version():
        sys.exit(1)
    
    if not check_pip():
        print("\nPlease install pip first:")
        print("https://pip.pypa.io/en/stable/installation/")
        sys.exit(1)
    
    # Upgrade pip
    upgrade_pip()
    
    # Try to install from requirements.txt first
    if install_requirements():
        print("\n✓ All dependencies installed successfully!")
    else:
        print("\n⚠ Installation from requirements.txt failed, trying individual packages...")
        if install_individual_packages():
            print("\n✓ All dependencies installed successfully!")
        else:
            print("\n✗ Failed to install some dependencies")
            print("\nTroubleshooting tips:")
            print("1. Make sure you have sufficient disk space")
            print("2. Try running as administrator (Windows) or with sudo (Linux/Mac)")
            print("3. Check your internet connection")
            print("4. Some packages might require additional system dependencies")
            sys.exit(1)
    
    print("\n" + "=" * 40)
    print("Installation completed successfully!")
    print("\nNext steps:")
    print("1. Run 'python test_dependencies.py' to verify all packages work")
    print("2. Run 'python backend/app.py' to start the Flask server")
    print("3. Open http://localhost:5000 in your browser")

if __name__ == "__main__":
    main()
