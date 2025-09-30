import React, { useState } from "react";
// CSS import hata diya gaya hai, isliye styling nahi hogi

// Loading spinner component (inline styles ke saath)
const Spinner = () => {
    const spinnerStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(255, 255, 255, 0.7)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    };
    const spinnerCircleStyle = {
        border: '4px solid rgba(0, 0, 0, 0.1)', width: '36px', height: '36px',
        borderRadius: '50%', borderLeftColor: '#4f46e5',
        animation: 'spin 1s ease infinite',
    };
    return (
        <div style={spinnerStyle}>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div style={spinnerCircleStyle}></div>
        </div>
    );
};


export default function Predict() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        } else {
            setFile(null);
            setPreviewUrl(null);
            setError("Please select a valid image file.");
        }
    }

    async function handlePredict() {
        if (!file) {
            setError("Please pick an image first.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }
            
            setResult(data);

        } catch (err) {
            setError(err.message || "Prediction failed. Is the Python server running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {loading && <Spinner />}
            <div>
                <h2>AI Medical Image Analysis</h2>
                <div className="main-predict" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div >
                        <p>Upload a CT scan to predict if it's Benign or Malignant.</p>
                        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <label htmlFor="file-upload" style={{ cursor: 'pointer', border: '2px dashed #ccc', padding: '2px',width:'300px',height:'235px', display: 'block', textAlign: 'center' }}>
                                {!previewUrl ? (
                                    <div>
                                        <div style={{ fontSize: 28 }}>☁️</div>
                                        <div style={{ marginTop: 8 }}>Drag 'n' drop or browse to upload</div>
                                    </div>
                                ) : (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '220px' }}
                                    />
                                )}
                            </label>
                        </div>
                        {error && !result && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                        <button onClick={handlePredict} disabled={!file || loading} style={{ width: '100%', padding: '0.75rem', marginTop: '1.5rem' }}>
                            {loading ? "Analyzing..." : "Predict"}
                        </button>
                    </div>
                    <div>
                        <h3>Prediction Result</h3>
                        <div>
                            {!result && !error && (
                                <p>
                                    Upload an image and click 'Predict' to see results.
                                </p>
                            )}
                            {result && (
                                <div>
                                    <p>
                                        <strong>Prediction:</strong>{" "}
                                        <span style={{ fontWeight: 'bold', color: result.prediction.toLowerCase() === 'benign' ? 'green' : 'red' }}>
                                            {result.prediction}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
                                    </p>
                                </div>
                            )}
                            {error && !result && (
                                <p style={{ color: 'red' }}>{error}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

