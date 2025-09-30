# brain.py (Updated to also create a .tflite model)
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
EPOCHS = 50
KERAS_MODEL_PATH = 'Breast_canmod.keras' # Path for the big model
TFLITE_MODEL_PATH = 'model.tflite' # Path for the small, deployment model
TRAIN_DIR = 'dataset/train'
CLASS_NAMES = ['Benign', 'Malignant']
# -----------------------------

# --- SECTIONS 1 & 2: DATA AUGMENTATION AND GENERATORS (No changes here) ---
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2
)
validation_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR, target_size=IMAGE_SIZE, batch_size=BATCH_SIZE, class_mode='categorical', subset='training'
)
validation_generator = validation_datagen.flow_from_directory(
    TRAIN_DIR, target_size=IMAGE_SIZE, batch_size=BATCH_SIZE, class_mode='categorical', subset='validation'
)

# --- SECTION 3: MODEL ARCHITECTURE (No changes here) ---
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3))
base_model.trainable = False
x = GlobalAveragePooling2D()(base_model.output)
x = Dense(128, activation='relu')(x)
x = Dropout(0.5)(x)
output_layer = Dense(len(CLASS_NAMES), activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=output_layer)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# --- SECTION 4: EARLY STOPPING CALLBACK (No changes here) ---
early_stopping = EarlyStopping(monitor='val_loss', patience=7, verbose=1, restore_best_weights=True)

# --- SECTION 5: TRAIN THE MODEL (No changes here) ---
print("\n--- Starting Model Training ---")
history = model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=validation_generator,
    callbacks=[early_stopping],
    steps_per_epoch=train_generator.samples // BATCH_SIZE,
    validation_steps=validation_generator.samples // BATCH_SIZE
)
print("--- Model Training Finished ---\n")

# --- SECTION 6: SAVE AND CONVERT THE FINAL MODEL (Updated Section) ---
# Save the standard Keras model
model.save(KERAS_MODEL_PATH)
print(f"✅ Training done and best Keras model saved as '{KERAS_MODEL_PATH}'!")

# # --- NEW: Convert the Keras model to a quantized TFLite model ---
# print("\n--- Starting TFLite Conversion ---")
# converter = tf.lite.TFLiteConverter.from_keras_model(model)
# converter.optimizations = [tf.lite.Optimize.DEFAULT]
# tflite_quant_model = converter.convert()

# # Save the TFLite model
# with open(TFLITE_MODEL_PATH, 'wb') as f:
#     f.write(tflite_quant_model)
# print(f"✅ Quantized TFLite model saved as '{TFLITE_MODEL_PATH}'! Use this one for deployment.")