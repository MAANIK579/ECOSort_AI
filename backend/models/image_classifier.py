import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
import numpy as np
from PIL import Image
import os

class ImageClassifier:
    def __init__(self):
        self.model = None
        self.categories = ['biodegradable', 'recyclable', 'hazardous']
        self.load_model()
    
    def load_model(self):
        """Load the pre-trained model or create a new one"""
        model_path = 'models/waste_classifier_model.h5'
        
        if os.path.exists(model_path):
            try:
                self.model = tf.keras.models.load_model(model_path)
                print("Loaded pre-trained waste classification model")
            except:
                print("Error loading model, creating new one")
                self.create_model()
        else:
            print("No pre-trained model found, creating new one")
            self.create_model()
    
    def create_model(self):
        """Create a new model based on MobileNetV2"""
        # Load pre-trained MobileNetV2
        base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        
        # Freeze the base model layers
        for layer in base_model.layers:
            layer.trainable = False
        
        # Add custom classification layers
        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dense(1024, activation='relu')(x)
        x = Dense(512, activation='relu')(x)
        predictions = Dense(len(self.categories), activation='softmax')(x)
        
        self.model = Model(inputs=base_model.input, outputs=predictions)
        
        # Compile the model
        self.model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        print("Created new waste classification model")
    
    def preprocess_image(self, img):
        """Preprocess image for model input"""
        # Resize image to 224x224
        img = img.resize((224, 224))
        
        # Convert to array and expand dimensions
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Preprocess for MobileNetV2
        img_array = preprocess_input(img_array)
        
        return img_array
    
    def predict(self, img):
        """Predict waste category from image"""
        try:
            # Preprocess image
            processed_img = self.preprocess_image(img)
            
            # Make prediction
            predictions = self.model.predict(processed_img)
            
            # Get predicted category and confidence
            predicted_class = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class])
            
            category = self.categories[predicted_class]
            
            return {
                'category': category,
                'confidence': confidence,
                'all_probabilities': {
                    cat: float(prob) for cat, prob in zip(self.categories, predictions[0])
                }
            }
            
        except Exception as e:
            print(f"Error in image prediction: {e}")
            # Return default prediction
            return {
                'category': 'recyclable',
                'confidence': 0.5,
                'all_probabilities': {
                    'biodegradable': 0.33,
                    'recyclable': 0.34,
                    'hazardous': 0.33
                }
            }
    
    def train(self, training_data, validation_data, epochs=10):
        """Train the model with custom data"""
        try:
            history = self.model.fit(
                training_data,
                validation_data=validation_data,
                epochs=epochs,
                batch_size=32
            )
            
            # Save the trained model
            self.model.save('models/waste_classifier_model.h5')
            print("Model trained and saved successfully")
            
            return history
            
        except Exception as e:
            print(f"Error training model: {e}")
            return None
