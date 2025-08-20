// Wait for the entire HTML document to be loaded before running the script.
document.addEventListener('DOMContentLoaded', () => {

    // Get references to all the necessary HTML elements.
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const previewText = document.getElementById('preview-text');
    const predictBtn = document.getElementById('predict-btn');
    const resultDiv = document.getElementById('result');

    let selectedFile = null;

    // 1. Event Listener for the file input
    // This part handles showing a preview of the image when the user selects one.
    imageUpload.addEventListener('change', (event) => {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            // Use FileReader to read the file and display it as an image.
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden'); // Show the image element
                previewText.classList.add('hidden');     // Hide the "Image Preview" text
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    // 2. Event Listener for the "Predict" button
    // This is the key part that was missing. It runs when the button is clicked.
    predictBtn.addEventListener('click', async () => {
        // Check if a file has been selected.
        if (!selectedFile) {
            resultDiv.innerHTML = '<p style="color: red;">Please choose an image first!</p>';
            return;
        }

        // Show a loading message.
        resultDiv.innerHTML = '<p>Analyzing image...</p>';

        // Create a FormData object to send the file.
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // Send the image to the '/predict' endpoint on your Flask server.
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Get the JSON response from the server.
            const data = await response.json();

            // Display the prediction and confidence from the server's response.
            resultDiv.innerHTML = `<p>Predicted Stage: <strong>${data.prediction}</strong></p>
                                   <p>Confidence: <strong>${(data.confidence * 100).toFixed(2)}%</strong></p>`;

        } catch (error) {
            // Display any errors that occur during the fetch request.
            console.error('Error:', error);
            resultDiv.innerHTML = `<p style="color: red;">An error occurred. Please try again.</p>`;
        }
    });
});
