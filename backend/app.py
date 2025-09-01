from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import json
import base64
import numpy as np
from PIL import Image
import io
import sqlite3
from datetime import datetime
import uuid
import logging

# Import AI models
from models.image_classifier import ImageClassifier
from models.text_classifier import TextClassifier
from models.sustainability_scorer import SustainabilityScorer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize AI models
try:
    image_classifier = ImageClassifier()
    text_classifier = TextClassifier()
    sustainability_scorer = SustainabilityScorer()
    logger.info("AI models initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize AI models: {e}")
    # Set models to None if initialization fails
    image_classifier = None
    text_classifier = None
    sustainability_scorer = None

# Database initialization
def init_db():
    try:
        conn = sqlite3.connect('ecosort.db')
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS classifications (
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
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analytics (
                id TEXT PRIMARY KEY,
                date DATE,
                biodegradable_count INTEGER,
                recyclable_count INTEGER,
                hazardous_count INTEGER,
                total_classifications INTEGER
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

@app.route('/')
def home():
    return jsonify({
        "message": "EcoSortAI API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "/classify/image": "POST - Classify waste from image",
            "/classify/text": "POST - Classify waste from text",
            "/analytics": "GET - Get analytics data",
            "/tips/<category>": "GET - Get disposal tips for category"
        }
    })

@app.route('/classify/image', methods=['POST'])
def classify_image():
    try:
        # Check if AI models are available
        if image_classifier is None or sustainability_scorer is None:
            return jsonify({"error": "AI models not available"}), 503
        
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No image file selected"}), 400
        
        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
        if not file.filename.lower().endswith(tuple('.' + ext for ext in allowed_extensions)):
            return jsonify({"error": "Invalid file type. Please upload an image file."}), 400
        
        # Validate file size (max 10MB)
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            return jsonify({"error": "File too large. Maximum size is 10MB."}), 400
        
        # Read and preprocess image
        try:
            image = Image.open(file.stream)
            image = image.convert('RGB')
        except Exception as e:
            return jsonify({"error": f"Invalid image file: {str(e)}"}), 400
        
        # Classify image
        prediction = image_classifier.predict(image)
        
        # Get sustainability score and tips
        sustainability_data = sustainability_scorer.get_score(prediction['category'])
        
        # Store classification
        classification_id = str(uuid.uuid4())
        store_classification(
            classification_id, 
            'image', 
            file.filename,
            prediction['category'],
            prediction['confidence'],
            sustainability_data['score'],
            sustainability_data['tips']
        )
        
        logger.info(f"Image classified successfully: {prediction['category']} (confidence: {prediction['confidence']:.2f})")
        
        return jsonify({
            "id": classification_id,
            "category": prediction['category'],
            "confidence": prediction['confidence'],
            "sustainability_score": sustainability_data['score'],
            "disposal_tips": sustainability_data['tips'],
            "environmental_impact": sustainability_data['impact']
        })
        
    except Exception as e:
        logger.error(f"Image classification error: {e}")
        return jsonify({"error": "Internal server error during image classification"}), 500

@app.route('/classify/text', methods=['POST'])
def classify_text():
    try:
        # Check if AI models are available
        if text_classifier is None or sustainability_scorer is None:
            return jsonify({"error": "AI models not available"}), 503
        
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({"error": "Text cannot be empty"}), 400
        
        if len(text) > 1000:  # Limit text length
            return jsonify({"error": "Text too long. Maximum length is 1000 characters."}), 400
        
        # Classify text
        prediction = text_classifier.predict(text)
        
        # Get sustainability score and tips
        sustainability_data = sustainability_scorer.get_score(prediction['category'])
        
        # Store classification
        classification_id = str(uuid.uuid4())
        store_classification(
            classification_id,
            'text',
            text,
            prediction['category'],
            prediction['confidence'],
            sustainability_data['score'],
            sustainability_data['tips']
        )
        
        logger.info(f"Text classified successfully: {prediction['category']} (confidence: {prediction['confidence']:.2f})")
        
        return jsonify({
            "id": classification_id,
            "category": prediction['category'],
            "confidence": prediction['confidence'],
            "sustainability_score": sustainability_data['score'],
            "disposal_tips": sustainability_data['tips'],
            "environmental_impact": sustainability_data['impact']
        })
        
    except Exception as e:
        logger.error(f"Text classification error: {e}")
        return jsonify({"error": "Internal server error during text classification"}), 500

@app.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        # Get date range from query parameters
        start_date = request.args.get('start_date', datetime.now().strftime('%Y-%m-%d'))
        end_date = request.args.get('end_date', datetime.now().strftime('%Y-%m-%d'))
        
        # Validate date format
        try:
            datetime.strptime(start_date, '%Y-%m-%d')
            datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        conn = sqlite3.connect('ecosort.db')
        cursor = conn.cursor()
        
        # Get daily statistics
        cursor.execute('''
            SELECT 
                date,
                biodegradable_count,
                recyclable_count,
                hazardous_count,
                total_classifications
            FROM analytics
            WHERE date BETWEEN ? AND ?
            ORDER BY date
        ''', (start_date, end_date))
        
        daily_stats = cursor.fetchall()
        
        # Get category distribution
        cursor.execute('''
            SELECT 
                predicted_category,
                COUNT(*) as count
            FROM classifications
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY predicted_category
        ''', (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
        
        category_distribution = dict(cursor.fetchall())
        
        # Get total classifications
        cursor.execute('''
            SELECT COUNT(*) FROM classifications
            WHERE timestamp BETWEEN ? AND ?
        ''', (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
        
        total_classifications = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            "daily_statistics": [
                {
                    "date": row[0],
                    "biodegradable": row[1],
                    "recyclable": row[2],
                    "hazardous": row[3],
                    "total": row[4]
                } for row in daily_stats
            ],
            "category_distribution": category_distribution,
            "total_classifications": total_classifications,
            "date_range": {
                "start": start_date,
                "end": end_date
            }
        })
        
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        return jsonify({"error": "Internal server error while fetching analytics"}), 500

@app.route('/tips/<category>', methods=['GET'])
def get_disposal_tips(category):
    try:
        # Validate category
        valid_categories = ['biodegradable', 'recyclable', 'hazardous']
        if category.lower() not in valid_categories:
            return jsonify({"error": "Invalid category. Must be one of: biodegradable, recyclable, hazardous"}), 400
        
        if sustainability_scorer is None:
            return jsonify({"error": "AI models not available"}), 503
        
        sustainability_data = sustainability_scorer.get_score(category.lower())
        return jsonify({
            "category": category.lower(),
            "tips": sustainability_data['tips'],
            "score": sustainability_data['score'],
            "impact": sustainability_data['impact']
        })
    except Exception as e:
        logger.error(f"Tips error: {e}")
        return jsonify({"error": "Internal server error while fetching tips"}), 500

def store_classification(id, input_type, input_data, category, confidence, score, tips):
    try:
        conn = sqlite3.connect('ecosort.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO classifications 
            (id, timestamp, input_type, input_data, predicted_category, confidence, sustainability_score, disposal_tips)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (id, datetime.now(), input_type, input_data, category, confidence, score, tips))
        
        # Update daily analytics
        today = datetime.now().strftime('%Y-%m-%d')
        
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
        ''', (today, today, today, today, today, today))
        
        conn.commit()
        conn.close()
        logger.info(f"Classification stored successfully: {id}")
    except Exception as e:
        logger.error(f"Failed to store classification: {e}")
        # Don't raise the exception to avoid breaking the API response
        # The classification result is still returned to the user

if __name__ == '__main__':
    try:
        init_db()
        logger.info("Starting EcoSortAI Flask application...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        exit(1)
