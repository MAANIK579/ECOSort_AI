#!/usr/bin/env python3
"""
Test script for image classification API
"""
import requests
import io
from PIL import Image
import numpy as np

def create_test_image():
    """Create a simple test image"""
    # Create a 100x100 RGB image with random colors
    img_array = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
    image = Image.fromarray(img_array)
    
    # Save to byte buffer
    img_buffer = io.BytesIO()
    image.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    
    return img_buffer

def test_image_classification():
    """Test the image classification API"""
    try:
        # Create test image
        test_image = create_test_image()
        
        # Prepare files for upload
        files = {'image': ('test_image.png', test_image, 'image/png')}
        
        # Send request to API
        print("Sending image classification request...")
        response = requests.post('http://localhost:5000/classify/image', files=files)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Image classification successful!")
        else:
            print("❌ Image classification failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_image_classification()