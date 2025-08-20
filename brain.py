import warnings, os
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# --- UNIFIED CONFIGURATION ---
IMAGE_SIZE = (224, 224)  # Use 224x224 to match standard MobileNetV2 usage
BATCH_SIZE = 32          # Increase batch size for faster and more stable training
EPOCHS = 10              # Increase epochs for meaningful training
MODEL_PATH = 'lung_cancer_model.keras' # Unified model name
TRAIN_DIR = 'dataset/train'
CLASS_NAMES = ['Benign', 'Malignant', 'Normal']
# -----------------------------

# Model Architecture
# Using input_shape that matches our IMAGE_SIZE
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3))
base_model.trainable = False # Freeze the base layers

# Add custom layers for our specific task
x = GlobalAveragePooling2D()(base_model.output)
x = Dense(128, activation='relu')(x)
x = Dropout(0.3)(x)
output_layer = Dense(len(CLASS_NAMES), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output_layer)

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# Data Generator
# It's good practice to have a validation set, but we'll proceed with the training set for now.
train_datagen = ImageDataGenerator(rescale=1./255)
train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# Train the Model
print("\n--- Starting Model Training ---")
history = model.fit(
    train_generator,
    epochs=EPOCHS,
    steps_per_epoch=train_generator.samples // BATCH_SIZE
)
print("--- Model Training Finished ---\n")

# Save the final model
model.save(MODEL_PATH)
print(f"✅ Training done and model saved as '{MODEL_PATH}'!")