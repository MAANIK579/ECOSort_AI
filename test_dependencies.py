#!/usr/bin/env python3
"""
Test script to verify all dependencies can be imported correctly.
Run this script to check if all required packages are available.
"""

import sys
import traceback

def test_import(module_name, package_name=None):
    """Test if a module can be imported"""
    try:
        if package_name:
            __import__(package_name)
            print(f"✓ {module_name} imported successfully")
        else:
            __import__(module_name)
            print(f"✓ {module_name} imported successfully")
        return True
    except ImportError as e:
        print(f"✗ Failed to import {module_name}: {e}")
        return False
    except Exception as e:
        print(f"✗ Error importing {module_name}: {e}")
        return False

def main():
    """Test all required dependencies"""
    print("Testing EcoSortAI dependencies...")
    print("=" * 50)
    
    # Core Flask dependencies
    print("\nCore Web Framework:")
    test_import("Flask", "flask")
    test_import("Flask-CORS", "flask_cors")
    
    # AI/ML dependencies
    print("\nAI/ML Libraries:")
    test_import("TensorFlow", "tensorflow")
    test_import("Keras", "keras")
    test_import("OpenCV", "cv2")
    test_import("Pillow", "PIL")
    test_import("NumPy", "numpy")
    test_import("Pandas", "pandas")
    test_import("Scikit-learn", "sklearn")
    test_import("Transformers", "transformers")
    test_import("PyTorch", "torch")
    test_import("Torchvision", "torchvision")
    
    # Visualization dependencies
    print("\nVisualization Libraries:")
    test_import("Matplotlib", "matplotlib")
    test_import("Seaborn", "seaborn")
    test_import("Plotly", "plotly")
    
    # Utility dependencies
    print("\nUtility Libraries:")
    test_import("Requests", "requests")
    test_import("Python-dotenv", "dotenv")
    test_import("Gunicorn", "gunicorn")
    test_import("H5py", "h5py")
    test_import("Joblib", "joblib")
    
    # Standard library modules
    print("\nStandard Library Modules:")
    test_import("sqlite3")
    test_import("json")
    test_import("os")
    test_import("datetime")
    test_import("uuid")
    test_import("logging")
    test_import("io")
    test_import("base64")
    test_import("pickle")
    test_import("re")
    
    print("\n" + "=" * 50)
    print("Dependency test completed!")
    
    # Test model imports
    print("\nTesting Model Imports:")
    try:
        sys.path.append('backend')
        from models.image_classifier import ImageClassifier
        print("✓ ImageClassifier imported successfully")
    except Exception as e:
        print(f"✗ Failed to import ImageClassifier: {e}")
        traceback.print_exc()
    
    try:
        from models.text_classifier import TextClassifier
        print("✓ TextClassifier imported successfully")
    except Exception as e:
        print(f"✗ Failed to import TextClassifier: {e}")
        traceback.print_exc()
    
    try:
        from models.sustainability_scorer import SustainabilityScorer
        print("✓ SustainabilityScorer imported successfully")
    except Exception as e:
        print(f"✗ Failed to import SustainabilityScorer: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main()
