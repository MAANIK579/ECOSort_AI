#!/usr/bin/env python3
"""
Training script for EcoSortAI image classification model
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt

def create_model(num_classes=3):
    """Create the image classification model"""
    # Load pre-trained MobileNetV2
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Freeze base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    # Add custom classification layers
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    return model

def generate_sample_data():
    """Generate sample training data for demonstration"""
    # Create sample directory structure
    categories = ['biodegradable', 'recyclable', 'hazardous']
    
    for category in categories:
        os.makedirs(f'data/train/{category}', exist_ok=True)
        os.makedirs(f'data/validation/{category}', exist_ok=True)
    
    print("Sample data directories created. Please add your training images to:")
    print("data/train/[category]/ and data/validation/[category]/")
    print("Where [category] is one of: biodegradable, recyclable, hazardous")

def train_model():
    """Train the image classification model"""
    # Data directories
    train_dir = 'data/train'
    validation_dir = 'data/validation'
    
    # Check if data exists
    if not os.path.exists(train_dir):
        print("Training data not found. Creating sample structure...")
        generate_sample_data()
        return
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    # Only rescaling for validation
    validation_datagen = ImageDataGenerator(rescale=1./255)
    
    # Load data
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical'
    )
    
    validation_generator = validation_datagen.flow_from_directory(
        validation_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical'
    )
    
    # Create model
    model = create_model(num_classes=len(train_generator.class_indices))
    
    # Compile model
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            'models/waste_classifier_model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7
        )
    ]
    
    # Train model
    print("Starting model training...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // 32,
        epochs=50,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // 32,
        callbacks=callbacks,
        verbose=1
    )
    
    # Save final model
    model.save('models/waste_classifier_model_final.h5')
    print("Training completed! Model saved to models/waste_classifier_model_final.h5")
    
    # Plot training history
    plot_training_history(history)

def plot_training_history(history):
    """Plot training and validation metrics"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy
    ax1.plot(history.history['accuracy'], label='Training Accuracy')
    ax1.plot(history.history['val_accuracy'], label='Validation Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Accuracy')
    ax1.legend()
    ax1.grid(True)
    
    # Loss
    ax2.plot(history.history['loss'], label='Training Loss')
    ax2.plot(history.history['val_loss'], label='Validation Loss')
    ax2.set_title('Model Loss')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Loss')
    ax2.legend()
    ax2.grid(True)
    
    plt.tight_layout()
    plt.savefig('models/training_history.png', dpi=300, bbox_inches='tight')
    plt.show()

if __name__ == "__main__":
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Check if GPU is available
    if tf.config.list_physical_devices('GPU'):
        print("GPU detected. Training will use GPU acceleration.")
    else:
        print("No GPU detected. Training will use CPU (this will be slower).")
    
    # Start training
    train_model()
