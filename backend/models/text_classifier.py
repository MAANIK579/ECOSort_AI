import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import pickle
import os

class TextClassifier:
    def __init__(self):
        self.model = None
        self.categories = ['biodegradable', 'recyclable', 'hazardous']
        self.waste_keywords = self._load_waste_keywords()
        self.load_model()
    
    def _load_waste_keywords(self):
        """Define waste keywords for each category"""
        return {
            'biodegradable': [
                'banana', 'apple', 'orange', 'fruit', 'vegetable', 'food', 'organic',
                'paper', 'cardboard', 'wood', 'leaves', 'grass', 'compost', 'tea bag',
                'coffee ground', 'egg shell', 'bread', 'pasta', 'rice', 'meat',
                'fish', 'dairy', 'garden waste', 'yard waste', 'plant', 'flower'
            ],
            'recyclable': [
                'plastic', 'bottle', 'container', 'bag', 'glass', 'aluminum', 'can',
                'metal', 'steel', 'tin', 'paper', 'newspaper', 'magazine', 'book',
                'cardboard', 'box', 'envelope', 'carton', 'milk jug', 'soda can',
                'beer bottle', 'wine bottle', 'jar', 'lotion bottle', 'shampoo',
                'detergent', 'fabric', 'cloth', 'textile', 'electronics', 'battery'
            ],
            'hazardous': [
                'battery', 'chemical', 'paint', 'solvent', 'oil', 'gasoline',
                'pesticide', 'herbicide', 'medicine', 'pharmaceutical', 'syringe',
                'needle', 'medical waste', 'toxic', 'poison', 'mercury', 'lead',
                'asbestos', 'radioactive', 'infectious', 'corrosive', 'flammable',
                'explosive', 'aerosol', 'spray can', 'light bulb', 'fluorescent',
                'thermometer', 'thermostat', 'electronics', 'computer', 'phone'
            ]
        }
    
    def load_model(self):
        """Load the pre-trained model or create a new one"""
        model_path = 'models/text_classifier_model.pkl'
        
        if os.path.exists(model_path):
            try:
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                print("Loaded pre-trained text classification model")
            except:
                print("Error loading model, creating new one")
                self.create_model()
        else:
            print("No pre-trained model found, creating new one")
            self.create_model()
    
    def create_model(self):
        """Create a new text classification model"""
        # Create a simple pipeline with TF-IDF and Naive Bayes
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(
                max_features=1000,
                stop_words='english',
                ngram_range=(1, 2)
            )),
            ('classifier', MultinomialNB())
        ])
        
        # Train with keyword-based data
        self._train_with_keywords()
        
        print("Created new text classification model")
    
    def _train_with_keywords(self):
        """Train the model using keyword-based synthetic data"""
        training_texts = []
        training_labels = []
        
        for category, keywords in self.waste_keywords.items():
            for keyword in keywords:
                # Create variations of the keyword
                variations = [
                    keyword,
                    f"used {keyword}",
                    f"old {keyword}",
                    f"broken {keyword}",
                    f"{keyword} waste",
                    f"empty {keyword}",
                    f"dirty {keyword}",
                    f"clean {keyword}"
                ]
                
                for variation in variations:
                    training_texts.append(variation)
                    training_labels.append(category)
        
        # Train the model
        self.model.fit(training_texts, training_labels)
        
        # Save the model
        os.makedirs('models', exist_ok=True)
        with open('models/text_classifier_model.pkl', 'wb') as f:
            pickle.dump(self.model, f)
    
    def preprocess_text(self, text):
        """Preprocess text for classification"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters
        text = re.sub(r'[^a-zA-Z\s]', ' ', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def predict(self, text):
        """Predict waste category from text"""
        try:
            # Preprocess text
            processed_text = self.preprocess_text(text)
            
            # Make prediction
            predicted_category = self.model.predict([processed_text])[0]
            
            # Get prediction probabilities
            probabilities = self.model.predict_proba([processed_text])[0]
            
            # Find confidence for predicted category
            category_index = self.categories.index(predicted_category)
            confidence = float(probabilities[category_index])
            
            # Create result with all probabilities
            all_probabilities = {
                cat: float(prob) for cat, prob in zip(self.categories, probabilities)
            }
            
            return {
                'category': predicted_category,
                'confidence': confidence,
                'all_probabilities': all_probabilities,
                'processed_text': processed_text
            }
            
        except Exception as e:
            print(f"Error in text prediction: {e}")
            # Fallback to keyword-based classification
            return self._fallback_classification(text)
    
    def _fallback_classification(self, text):
        """Fallback classification using keyword matching"""
        text_lower = text.lower()
        
        category_scores = {category: 0 for category in self.categories}
        
        for category, keywords in self.waste_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    category_scores[category] += 1
        
        # Find category with highest score
        predicted_category = max(category_scores, key=category_scores.get)
        
        # Calculate confidence based on score
        total_score = sum(category_scores.values())
        confidence = category_scores[predicted_category] / max(total_score, 1)
        
        return {
            'category': predicted_category,
            'confidence': confidence,
            'all_probabilities': {
                cat: score / max(total_score, 1) for cat, score in category_scores.items()
            },
            'processed_text': text.lower(),
            'method': 'keyword_fallback'
        }
    
    def add_keywords(self, category, new_keywords):
        """Add new keywords to improve classification"""
        if category in self.waste_keywords:
            self.waste_keywords[category].extend(new_keywords)
            # Retrain the model with new keywords
            self._train_with_keywords()
            print(f"Added {len(new_keywords)} keywords to {category} category")
        else:
            print(f"Invalid category: {category}")
    
    def get_keywords(self, category=None):
        """Get keywords for a specific category or all categories"""
        if category:
            return self.waste_keywords.get(category, [])
        return self.waste_keywords
