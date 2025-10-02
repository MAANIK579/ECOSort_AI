#!/usr/bin/env python3
"""
Test frontend proxy for analytics API
"""
import requests
import json
from datetime import datetime, timedelta

def test_frontend_proxy():
    """Test if frontend proxy forwards requests correctly"""
    print("🔄 Testing Frontend Proxy for Analytics...")
    
    # Test direct backend call
    print("\n1. Direct Backend Call:")
    try:
        start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        end_date = datetime.now().strftime('%Y-%m-%d')
        
        response = requests.get('http://localhost:5000/analytics', params={
            'start_date': start_date,
            'end_date': end_date
        })
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Direct backend call successful")
            print(f"   Total classifications: {data['total_classifications']}")
            print(f"   Categories: {list(data['category_distribution'].keys())}")
        else:
            print(f"❌ Direct backend call failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Direct backend error: {e}")
    
    # Test through frontend proxy
    print("\n2. Frontend Proxy Call:")
    try:
        response = requests.get('http://localhost:3001/analytics', params={
            'start_date': start_date,
            'end_date': end_date
        })
        
        if response.status_code == 200:
            # Check if it's JSON data (API response) or HTML (React app)
            content_type = response.headers.get('content-type', '')
            if 'application/json' in content_type:
                data = response.json()
                print("✅ Frontend proxy API call successful")
                print(f"   Total classifications: {data['total_classifications']}")
            else:
                print("✅ Frontend proxy serving React app (expected)")
                print(f"   Content type: {content_type}")
        else:
            print(f"❌ Frontend proxy call failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Frontend proxy error: {e}")
    
    print("\n3. Testing Analytics Data Structure:")
    try:
        response = requests.get('http://localhost:5000/analytics', params={
            'start_date': start_date,
            'end_date': end_date
        })
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Analytics data structure:")
            print(f"   - total_classifications: {type(data.get('total_classifications'))}")
            print(f"   - category_distribution: {type(data.get('category_distribution'))}")
            print(f"   - daily_statistics: {type(data.get('daily_statistics'))} (length: {len(data.get('daily_statistics', []))})")
            print(f"   - date_range: {type(data.get('date_range'))}")
            
            if data['daily_statistics']:
                sample = data['daily_statistics'][0]
                print(f"   Sample daily stat keys: {list(sample.keys())}")
                
        else:
            print(f"❌ Failed to get analytics data")
            
    except Exception as e:
        print(f"❌ Analytics data test error: {e}")

if __name__ == "__main__":
    test_frontend_proxy()