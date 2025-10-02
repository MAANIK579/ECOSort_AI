import numpy as np
from PIL import Image
import os

# Check TensorFlow availability without importing it immediately
TF_AVAILABLE = False
try:
    import tensorflow
    TF_AVAILABLE = True
except ImportError:
    print("TensorFlow not available, using fallback classification")

class ImageClassifier:
    def __init__(self):
        self.model = None
        self.categories = ['biodegradable', 'recyclable', 'hazardous']
        self.tf_available = TF_AVAILABLE
        if self.tf_available:
            self.load_model()
        else:
            print("TensorFlow not available, using fallback image classification")
    
    def load_model(self):
        """Load the pre-trained model or create a new one"""
        if not self.tf_available:
            return
        
        try:
            import tensorflow as tf
        except ImportError:
            print("Failed to import TensorFlow")
            self.tf_available = False
            return
            
        model_path = 'models/waste_classifier_model.h5'
        
        if os.path.exists(model_path):
            try:
                self.model = tf.keras.models.load_model(model_path)
                print("Loaded pre-trained waste classification model")
            except Exception as e:
                print(f"Error loading model: {e}, creating new one")
                self.create_model()
        else:
            print("No pre-trained model found, creating new one")
            self.create_model()
    
    def create_model(self):
        """Create a new model based on MobileNetV2"""
        if not self.tf_available:
            return
            
        try:
            import tensorflow as tf
            from tensorflow.keras.applications import MobileNetV2
            from tensorflow.keras.models import Model
            from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
            
            # Load pre-trained MobileNetV2
            base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
            
            # Freeze the base model layers
            for layer in base_model.layers:
                layer.trainable = False
            
            # Add custom classification layers
            x = base_model.output
            x = GlobalAveragePooling2D()(x)
            x = Dense(1024, activation='relu')(x)
            x = Dropout(0.5)(x)
            x = Dense(512, activation='relu')(x)
            x = Dropout(0.3)(x)
            predictions = Dense(len(self.categories), activation='softmax')(x)
            
            self.model = Model(inputs=base_model.input, outputs=predictions)
            
            # Compile the model
            self.model.compile(
                optimizer='adam',
                loss='categorical_crossentropy',
                metrics=['accuracy']
            )
            
            print("Created new waste classification model")
        except Exception as e:
            print(f"Error creating TensorFlow model: {e}")
            self.model = None
            self.tf_available = False
    
    def preprocess_image(self, img):
        """Preprocess image for model input"""
        if not self.tf_available:
            return None
            
        try:
            from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
            
            # Resize image to 224x224
            img = img.resize((224, 224))
            
            # Convert to array and expand dimensions
            img_array = np.array(img)
            img_array = np.expand_dims(img_array, axis=0)
            
            # Preprocess for MobileNetV2
            img_array = preprocess_input(img_array)
            
            return img_array
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None
    
    def predict(self, img):
        """Predict waste category from image"""
        if not self.tf_available or self.model is None:
            return self._fallback_prediction(img)
            
        try:
            # Preprocess image
            processed_img = self.preprocess_image(img)
            
            if processed_img is None:
                return self._fallback_prediction(img)
            
            # Make prediction
            predictions = self.model.predict(processed_img, verbose=0)
            
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
            return self._fallback_prediction(img)
    
    def _fallback_prediction(self, img):
        """Fallback prediction when TensorFlow is not available"""
        # Simple rule-based prediction based on image properties
        try:
            # Get basic image statistics
            img_array = np.array(img)
            
            # Simple heuristics based on color analysis
            mean_colors = np.mean(img_array, axis=(0, 1))
            
            # Very basic classification based on color dominance
            if mean_colors[1] > mean_colors[0] and mean_colors[1] > mean_colors[2]:  # Green dominant
                category = 'biodegradable'
                confidence = 0.6
            elif mean_colors[2] > mean_colors[0] and mean_colors[2] > mean_colors[1]:  # Blue dominant
                category = 'recyclable'
                confidence = 0.55
            else:
                category = 'hazardous'
                confidence = 0.5
            
            return {
                'category': category,
                'confidence': confidence,
                'all_probabilities': {
                    'biodegradable': 0.33 if category != 'biodegradable' else confidence,
                    'recyclable': 0.33 if category != 'recyclable' else confidence,
                    'hazardous': 0.34 if category != 'hazardous' else confidence
                }
            }
        except Exception as e:
            print(f"Error in fallback prediction: {e}")
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
        if not self.tf_available or self.model is None:
            print("TensorFlow not available or model not initialized, cannot train")
            return None
            
        try:
            history = self.model.fit(
                training_data,
                validation_data=validation_data,
                epochs=epochs,
                batch_size=32,
                verbose=1
            )
            
            # Save the trained model
            os.makedirs('models', exist_ok=True)
            self.model.save('models/waste_classifier_model.h5')
            print("Model trained and saved successfully")
            
            return history
            
        except Exception as e:
            print(f"Error training model: {e}")
            return None
