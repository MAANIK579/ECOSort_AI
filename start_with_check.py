#!/usr/bin/env python3
"""
Startup script for EcoSortAI that checks dependencies before starting the app.
This script will verify all required packages are available and then start the Flask server.
"""

import sys
import os
import importlib
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("✗ Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✓ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def check_required_packages():
    """Check if all required packages are available"""
    required_packages = [
        ('flask', 'Flask'),
        ('flask_cors', 'Flask-CORS'),
        ('tensorflow', 'TensorFlow'),
        ('cv2', 'OpenCV'),
        ('PIL', 'Pillow'),
        ('numpy', 'NumPy'),
        ('pandas', 'Pandas'),
        ('sklearn', 'Scikit-learn'),
        ('transformers', 'Transformers'),
        ('torch', 'PyTorch'),
        ('torchvision', 'Torchvision'),
        ('matplotlib', 'Matplotlib'),
        ('seaborn', 'Seaborn'),
        ('plotly', 'Plotly'),
        ('requests', 'Requests'),
        ('dotenv', 'Python-dotenv'),
        ('gunicorn', 'Gunicorn'),
        ('keras', 'Keras'),
        ('h5py', 'H5py'),
        ('joblib', 'Joblib')
    ]
    
    missing_packages = []
    
    for package, display_name in required_packages:
        try:
            importlib.import_module(package)
            print(f"✓ {display_name} is available")
        except ImportError:
            print(f"✗ {display_name} is missing")
            missing_packages.append(display_name)
    
    if missing_packages:
        print(f"\n✗ Missing packages: {', '.join(missing_packages)}")
        print("\nTo install missing packages, run:")
        print("  python install_dependencies.py")
        print("  or")
        print("  pip install -r requirements.txt")
        return False
    
    print("\n✓ All required packages are available")
    return True

def check_model_files():
    """Check if model files exist"""
    model_files = [
        'backend/models/image_classifier.py',
        'backend/models/text_classifier.py',
        'backend/models/sustainability_scorer.py'
    ]
    
    missing_files = []
    
    for file_path in model_files:
        if os.path.exists(file_path):
            print(f"✓ {file_path} exists")
        else:
            print(f"✗ {file_path} is missing")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n✗ Missing model files: {', '.join(missing_files)}")
        return False
    
    print("\n✓ All model files are available")
    return True

def check_database_permissions():
    """Check if we can create/write to the database directory"""
    try:
        # Try to create a test file in the current directory
        test_file = 'test_write_permission.tmp'
        with open(test_file, 'w') as f:
            f.write('test')
        os.remove(test_file)
        print("✓ Database write permissions are OK")
        return True
    except Exception as e:
        print(f"✗ Database write permission error: {e}")
        return False

def start_flask_app():
    """Start the Flask application"""
    try:
        print("\n🚀 Starting EcoSortAI Flask application...")
        print("=" * 50)
        
        # Change to backend directory and start the app
        os.chdir('backend')
        
        # Import and run the app
        from . import app
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except ImportError as e:
        print(f"✗ Failed to import Flask app: {e}")
        print("Make sure you're running this script from the project root directory")
        return False
    except Exception as e:
        print(f"✗ Failed to start Flask app: {e}")
        return False

def main():
    """Main startup process"""
    print("EcoSortAI Startup Check")
    print("=" * 30)
    
    # Check prerequisites
    if not check_python_version():
        sys.exit(1)
    
    print("\nChecking required packages...")
    if not check_required_packages():
        print("\nPlease install missing packages before starting the application.")
        print("You can use the installation scripts provided:")
        print("  - Windows: install_dependencies.bat")
        print("  - Linux/Mac: ./install_dependencies.sh")
        print("  - Python: python install_dependencies.py")
        sys.exit(1)
    
    print("\nChecking model files...")
    if not check_model_files():
        print("\nPlease ensure all model files are present.")
        sys.exit(1)
    
    print("\nChecking database permissions...")
    if not check_database_permissions():
        print("\nPlease check file permissions in the current directory.")
        sys.exit(1)
    
    print("\n✓ All checks passed! Starting application...")
    
    # Start the Flask app
    start_flask_app()

if __name__ == "__main__":
    main()
