#!/usr/bin/env python3
"""
Script to check database status and populate with test data for analytics
"""
import sqlite3
import uuid
from datetime import datetime, timedelta
import random
import os

def check_and_populate_database():
    """Check database status and add test data if needed"""
    
    # Change to backend directory
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    if os.path.exists(backend_path):
        os.chdir(backend_path)
    
    print("=== Database Status Check ===")
    print(f"Current directory: {os.getcwd()}")
    print(f"Database file exists: {os.path.exists('ecosort.db')}")
    
    # Initialize database connection
    conn = sqlite3.connect('ecosort.db')
    cursor = conn.cursor()
    
    # Check if tables exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    print(f"Tables in database: {tables}")
    
    # Initialize tables if they don't exist
    if 'classifications' not in tables:
        print("Creating classifications table...")
        cursor.execute('''
            CREATE TABLE classifications (
                id TEXT PRIMARY KEY,
                timestamp DATETIME,
                input_type TEXT,
                input_data TEXT,
                predicted_category TEXT,
                confidence REAL,
                sustainability_score REAL,
                disposal_tips TEXT
            )
        ''')
    
    if 'analytics' not in tables:
        print("Creating analytics table...")
        cursor.execute('''
            CREATE TABLE analytics (
                id TEXT PRIMARY KEY,
                date DATE,
                biodegradable_count INTEGER,
                recyclable_count INTEGER,
                hazardous_count INTEGER,
                total_classifications INTEGER
            )
        ''')
    
    # Check current data count
    cursor.execute('SELECT COUNT(*) FROM classifications')
    current_count = cursor.fetchone()[0]
    print(f"Current classifications: {current_count}")
    
    # Add sample data if database is empty
    if current_count < 10:
        print("Adding sample data for analytics...")
        
        categories = ['biodegradable', 'recyclable', 'hazardous']
        sample_items = {
            'biodegradable': ['banana peel', 'apple core', 'coffee grounds', 'vegetable scraps', 'paper towel'],
            'recyclable': ['plastic bottle', 'glass jar', 'aluminum can', 'newspaper', 'cardboard box'],
            'hazardous': ['old battery', 'paint can', 'medical waste', 'chemical container', 'fluorescent bulb']
        }
        
        # Generate data for last 30 days
        for i in range(30):
            date = datetime.now() - timedelta(days=i)
            
            # Generate 1-8 classifications per day
            daily_count = random.randint(1, 8)
            
            for j in range(daily_count):
                category = random.choice(categories)
                item = random.choice(sample_items[category])
                
                classification_id = str(uuid.uuid4())
                confidence = random.uniform(0.6, 0.95)
                sustainability_score = random.uniform(4.0, 9.5)
                
                disposal_tips = [
                    f"Proper disposal guideline for {category} items",
                    f"Follow local {category} waste management protocols",
                    f"Consider environmental impact of {category} materials"
                ]
                
                cursor.execute('''
                    INSERT INTO classifications 
                    (id, timestamp, input_type, input_data, predicted_category, confidence, sustainability_score, disposal_tips)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (classification_id, date, 'text', item, category, confidence, sustainability_score, str(disposal_tips)))
        
        # Update analytics table
        cursor.execute('DELETE FROM analytics')  # Clear existing analytics
        
        # Generate daily analytics for last 30 days
        for i in range(30):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            
            cursor.execute('''
                INSERT OR REPLACE INTO analytics 
                (id, date, biodegradable_count, recyclable_count, hazardous_count, total_classifications)
                VALUES (
                    ?,
                    ?,
                    (SELECT COUNT(*) FROM classifications WHERE predicted_category = 'biodegradable' AND DATE(timestamp) = ?),
                    (SELECT COUNT(*) FROM classifications WHERE predicted_category = 'recyclable' AND DATE(timestamp) = ?),
                    (SELECT COUNT(*) FROM classifications WHERE predicted_category = 'hazardous' AND DATE(timestamp) = ?),
                    (SELECT COUNT(*) FROM classifications WHERE DATE(timestamp) = ?)
                )
            ''', (date, date, date, date, date, date))
    
    conn.commit()
    
    # Verify final counts
    cursor.execute('SELECT COUNT(*) FROM classifications')
    final_count = cursor.fetchone()[0]
    
    cursor.execute('SELECT predicted_category, COUNT(*) FROM classifications GROUP BY predicted_category')
    category_counts = dict(cursor.fetchall())
    
    cursor.execute('SELECT COUNT(*) FROM analytics')
    analytics_count = cursor.fetchone()[0]
    
    conn.close()
    
    print(f"\n=== Final Database Status ===")
    print(f"Total classifications: {final_count}")
    print(f"Category distribution: {category_counts}")
    print(f"Analytics records: {analytics_count}")
    print("✅ Database ready for analytics!")

if __name__ == "__main__":
    check_and_populate_database()