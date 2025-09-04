import warnings, os
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping

# --- UNIFIED CONFIGURATION ---
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
# Increased epochs because Early Stopping will find the best one automatically
EPOCHS = 50
MODEL_PATH = 'lung_cancer_model.keras'
TRAIN_DIR = 'dataset/train'
CLASS_NAMES = ['Benign', 'Malignant']
# -----------------------------

# --- 1. DATA AUGMENTATION ---
# Create a data generator for the training set with data augmentation
# This prevents overfitting by creating modified versions of your images.
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2  # Reserve 20% of data for validation
)

# Create a data generator for the validation set (no augmentation, only rescaling)
validation_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2 # Use the same split as the training generator
)


# --- 2. DATA GENERATORS ---
# Create the training data generator from the directory
train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'  # Specify this is the training subset
)

# Create the validation data generator from the directory
validation_generator = validation_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'  # Specify this is the validation subset
)


# --- 3. MODEL ARCHITECTURE ---
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3))
base_model.trainable = False

# Add custom layers, with increased dropout
x = GlobalAveragePooling2D()(base_model.output)
x = Dense(128, activation='relu')(x)
# Increased dropout rate to 0.5 for stronger regularization
x = Dropout(0.5)(x)
output_layer = Dense(len(CLASS_NAMES), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output_layer)

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()


# --- 4. EARLY STOPPING CALLBACK ---
# This will stop training when the validation loss has stopped improving
# 'patience=3' means it will wait 3 epochs before stopping.
# 'restore_best_weights=True' ensures the model is returned to its best state.
early_stopping = EarlyStopping(
    monitor='val_loss',
    patience=3,
    verbose=1,
    restore_best_weights=True
)

# --- 5. TRAIN THE MODEL ---
print("\n--- Starting Model Training with Augmentation and Early Stopping ---")
history = model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=validation_generator,
    # Pass the early stopping callback here
    callbacks=[early_stopping],
    steps_per_epoch=train_generator.samples // BATCH_SIZE,
    validation_steps=validation_generator.samples // BATCH_SIZE
)
print("--- Model Training Finished ---\n")

# Save the final model (which will be the best version thanks to restore_best_weights)
model.save(MODEL_PATH)
print(f"✅ Training done and best model saved as '{MODEL_PATH}'!")
