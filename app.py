# import warnings, os
# warnings.filterwarnings("ignore", category=UserWarning)
# warnings.filterwarnings("ignore", category=FutureWarning)
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# from flask import Flask, request, jsonify, render_template
# from tensorflow.keras.models import load_model
# from PIL import Image
# import numpy as np

# # --- UNIFIED CONFIGURATION ---
# IMAGE_SIZE = (224, 224) # Must match the training script.
# MODEL_PATH = 'lung_cancer_model.keras' # Must match the training script.
# CLASS_NAMES = ['Benign', 'Malignant']
# # -----------------------------

# app = Flask(__name__)

# # Load the trained model
# print("[INFO] Loading model...")
# if not os.path.exists(MODEL_PATH):
#     raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Please run brain.py to train and save the model first.")
# model = load_model(MODEL_PATH)
# print("[INFO] Model loaded successfully.")


# def preprocess_image(image):
#     """Preprocesses the image for the model."""
#     # Resize to the correct IMAGE_SIZE
#     image = image.resize(IMAGE_SIZE)
#     if image.mode != "RGB":
#         image = image.convert("RGB")
#     image_array = np.array(image) / 255.0
#     image_array = np.expand_dims(image_array, axis=0) # Add batch dimension
#     return image_array

# # --- Routes ---

# @app.route('/')
# def home():
#     """Serves the main page."""
#     return render_template('index.html')

# @app.route('/predict', methods=['POST'])
# def predict():
#     """Handles the prediction request."""
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part in the request'}), 400
    
#     file = request.files['file']
    
#     if file.filename == '':
#         return jsonify({'error': 'No image selected for uploading'}), 400

#     try:
#         image = Image.open(file.stream)
#         processed_image = preprocess_image(image)

#         # Get model prediction
#         prediction_probabilities = model.predict(processed_image)[0]
#         predicted_class_index = np.argmax(prediction_probabilities)
        
#         result = CLASS_NAMES[predicted_class_index]
#         confidence = float(prediction_probabilities[predicted_class_index])

#         return jsonify({
#             'prediction': result,
#             'confidence': confidence
#         })

#     except Exception as e:
#         print(f"[ERROR] {e}") # Log the error for debugging
#         return jsonify({'error': f'An error occurred: {str(e)}'}), 500

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=False) # Set debug=False for production



import warnings, os
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
# CORS ko handle karne ke liye yeh import karein
from flask_cors import CORS

# --- UNIFIED CONFIGURATION ---
IMAGE_SIZE = (224, 224)
# Naye, halke model ka path istemaal karein
MODEL_PATH = 'Breast_canmod.keras'
CLASS_NAMES = ['Benign', 'Malignant']
# -----------------------------

app = Flask(__name__)
# CORS ko enable karein taaki React app connect kar sake
CORS(app)

# --- TFLITE MODEL LOAD KAREIN ---

print("[INFO] Loading Keras model...")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Please run brain.py to create it first.")
from tensorflow.keras.models import load_model
model = load_model(MODEL_PATH)
print("[INFO] Model loaded successfully.")


def preprocess_image(image):
    """Image ko model ke liye process karta hai."""
    image = image.resize(IMAGE_SIZE)
    if image.mode != "RGB":
        image = image.convert("RGB")
    image_array = np.array(image, dtype=np.float32) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

# --- Routes ---

@app.route('/predict', methods=['POST'])
def predict():
    """Prediction request ko handle karta hai."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No image selected for uploading'}), 400

    try:
        image = Image.open(file.stream)
        processed_image = preprocess_image(image)


        # --- KERAS MODEL SE PREDICT KAREIN ---
        prediction_probabilities = model.predict(processed_image)[0]
        predicted_class_index = int(np.argmax(prediction_probabilities))
        result = CLASS_NAMES[predicted_class_index]
        confidence = float(prediction_probabilities[predicted_class_index])

        return jsonify({
            'prediction': result,
            'confidence': confidence
        })

    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    # Port 5000 par server chalayein
    app.run(host='0.0.0.0', port=5000, debug=True)

