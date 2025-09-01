# EcoSortAI Troubleshooting Guide

This guide helps you resolve common issues when setting up and running EcoSortAI.

## Common Issues and Solutions

### 1. Python Version Issues

**Problem**: "Python is not recognized" or "Python version too old"

**Solution**:
- Install Python 3.8 or higher from [python.org](https://python.org)
- Make sure Python is added to your system PATH
- Verify installation: `python --version` or `python3 --version`

### 2. pip Installation Issues

**Problem**: "pip is not recognized" or "No module named pip"

**Solution**:
```bash
# Windows
python -m ensurepip --upgrade

# Linux/Mac
python3 -m ensurepip --upgrade
```

### 3. Package Installation Failures

**Problem**: "Failed to install [package]"

**Solutions**:

#### A. Upgrade pip first
```bash
python -m pip install --upgrade pip
```

#### B. Install packages individually
```bash
python -m pip install Flask==2.3.3
python -m pip install Flask-CORS==4.0.0
python -m pip install tensorflow==2.13.0
# ... continue with other packages
```

#### C. Use virtual environment (recommended)
```bash
# Create virtual environment
python -m venv ecosort_env

# Activate (Windows)
ecosort_env\Scripts\activate

# Activate (Linux/Mac)
source ecosort_env/bin/activate

# Install packages
pip install -r requirements.txt
```

### 4. TensorFlow Installation Issues

**Problem**: "Failed to install tensorflow" or "tensorflow not found"

**Solutions**:

#### A. Install CPU-only version (smaller, faster)
```bash
pip install tensorflow-cpu==2.13.0
```

#### B. Install specific version for your system
```bash
# For Windows
pip install tensorflow==2.13.0

# For Linux/Mac
pip install tensorflow==2.13.0
```

#### C. Check system requirements
- Windows: Python 3.8-3.11, 64-bit
- Linux: Python 3.8-3.11, glibc 2.17+
- Mac: Python 3.8-3.11, macOS 10.14+

### 5. OpenCV Installation Issues

**Problem**: "Failed to install opencv-python"

**Solutions**:

#### A. Install pre-built wheel
```bash
pip install opencv-python-headless==4.8.1.78
```

#### B. Install system dependencies (Linux)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3-opencv

# CentOS/RHEL
sudo yum install opencv-python
```

### 6. PyTorch Installation Issues

**Problem**: "Failed to install torch"

**Solutions**:

#### A. Install from official source
```bash
# CPU only (recommended for most users)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# CUDA support (if you have NVIDIA GPU)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

#### B. Check system compatibility
- Windows: Python 3.8-3.11
- Linux: Python 3.8-3.11
- Mac: Python 3.8-3.11

### 7. Model Import Errors

**Problem**: "No module named 'models'"

**Solution**:
```bash
# Make sure you're in the project root directory
cd ECOSort_AI

# Run from project root
python backend/app.py
```

### 8. Database Errors

**Problem**: "Database is locked" or "Permission denied"

**Solutions**:

#### A. Check file permissions
```bash
# Linux/Mac
chmod 644 ecosort.db
chmod 755 backend/
```

#### B. Close other instances
- Make sure only one instance of the app is running
- Check for other Python processes using the database

### 9. Port Already in Use

**Problem**: "Address already in use" or "Port 5000 is busy"

**Solutions**:

#### A. Find and kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

#### B. Use different port
```python
# In backend/app.py, change the port
app.run(debug=True, host='0.0.0.0', port=5001)
```

### 10. CORS Issues

**Problem**: "CORS error" in browser console

**Solutions**:

#### A. Check CORS configuration in app.py
```python
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

#### B. Add your frontend URL to origins
```python
"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://your-domain.com"]
```

### 11. Memory Issues

**Problem**: "Out of memory" or "Killed"

**Solutions**:

#### A. Reduce batch size
```python
# In models/image_classifier.py
predictions = self.model.predict(processed_img, batch_size=1)
```

#### B. Use smaller models
```python
# Use MobileNetV2 instead of larger models
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
```

### 12. Slow Performance

**Problem**: "App is very slow" or "Long response times"

**Solutions**:

#### A. Enable GPU acceleration (if available)
```bash
# Install GPU version of TensorFlow
pip install tensorflow-gpu==2.13.0
```

#### B. Optimize image processing
```python
# Reduce image size
img = img.resize((224, 224))  # Smaller than original
```

#### C. Use caching
```python
# Add simple caching for repeated requests
from functools import lru_cache

@lru_cache(maxsize=100)
def get_disposal_tips(category):
    # ... existing code
```

## Getting Help

If you're still experiencing issues:

1. **Check the logs**: Look for error messages in the console output
2. **Run the test script**: `python test_dependencies.py`
3. **Check system requirements**: Ensure your system meets all requirements
4. **Search existing issues**: Check if your problem has been reported before
5. **Create a new issue**: Provide detailed information about your problem

## System Requirements

### Minimum Requirements
- Python 3.8+
- 4GB RAM
- 2GB free disk space
- Internet connection for package installation

### Recommended Requirements
- Python 3.9+
- 8GB RAM
- 5GB free disk space
- NVIDIA GPU (for faster AI processing)

## Environment Variables

Create a `.env` file in the project root for configuration:

```env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///ecosort.db
MODEL_PATH=models/
LOG_LEVEL=INFO
```

## Performance Optimization

### For Development
```python
# In app.py
app.run(debug=True, host='0.0.0.0', port=5000)
```

### For Production
```python
# In app.py
app.run(debug=False, host='0.0.0.0', port=5000)
```

### Use Gunicorn for Production
```bash
gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app
```

## Common Commands

```bash
# Install dependencies
python -m pip install -r requirements.txt

# Test dependencies
python test_dependencies.py

# Start backend
python backend/app.py

# Start frontend (in another terminal)
cd frontend && npm start

# Run tests
python -m pytest tests/

# Check Python version
python --version

# Check pip version
pip --version

# List installed packages
pip list
```
