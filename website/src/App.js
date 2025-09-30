// // import React, { useState, useEffect } from 'react';
// // import './App.css'; // CSS file import karein

// // // --- Components ---

// // // Loading Spinner Component
// // const Spinner = () => (
// //   <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //   </svg>
// // );

// // // Default Placeholder Icon
// // const PlaceholderIcon = () => (
// //     <div className="placeholder-content">
// //         <svg className="upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
// //             <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
// //         </svg>
// //         <p className="prompt-text"><span className="highlight">Click to upload</span> or drag and drop</p>
// //         <p className="file-types">PNG, JPG, etc.</p>
// //     </div>
// // );

// // // NEW: Sun and Moon Icons
// // const SunIcon = () => (
// //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sun-icon">
// //         <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
// //     </svg>
// // );

// // const MoonIcon = () => (
// //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="moon-icon">
// //         <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
// //     </svg>
// // );


// // // Navbar Component
// // const Navbar = ({ theme, toggleTheme }) => {
// //     const [menuOpen, setMenuOpen] = useState(false);

// //     return (
// //         <nav className="navbar">
// //             <div className="nav-title">NeoScan</div>
// //             <div className="nav-controls">
// //                 {/* UPDATED: Theme Switcher with Icons */}
// //                 <label className="theme-switch">
// //                     <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
// //                     <span className="slider">
// //                        <SunIcon />
// //                        <MoonIcon />
// //                     </span>
// //                 </label>
// //                 {/* Hamburger Menu */}
// //                 <div className="hamburger-menu">
// //                     <button className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
// //                         <svg viewBox="0 0 100 80" width="25" height="25">
// //                             <rect width="100" height="15" rx="8"></rect>
// //                             <rect y="30" width="100" height="15" rx="8"></rect>
// //                             <rect y="60" width="100" height="15" rx="8"></rect>
// //                         </svg>
// //                     </button>
// //                     {menuOpen && (
// //                         <div className="dropdown-menu">
// //                             <a href="#profile">Profile</a>
// //                             <a href="#logout">Logout</a>
// //                         </div>
// //                     )}
// //                 </div>
// //             </div>
// //         </nav>
// //     );
// // };


// // // --- Main App Component ---
// // function App() {
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [previewUrl, setPreviewUrl] = useState(null);
// //   const [prediction, setPrediction] = useState(null);
// //   const [confidence, setConfidence] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [theme, setTheme] = useState('light'); // 'light' ya 'dark'

// //   // Theme ko toggle karne ka function
// //   const toggleTheme = () => {
// //     setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
// //   };

// //   // Jab bhi theme badle, body par class lagayein
// //   useEffect(() => {
// //     document.body.className = theme;
// //   }, [theme]);


// //   const handleFileChange = (event) => {
// //     const file = event.target.files[0];
// //     if (file && file.type.startsWith('image/')) {
// //       setSelectedFile(file);
// //       setPreviewUrl(URL.createObjectURL(file));
// //       setPrediction(null);
// //       setError(null);
// //     } else {
// //       setSelectedFile(null);
// //       setPreviewUrl(null);
// //       setError("Please select a valid image file.");
// //     }
// //   };

// //   const handlePredict = async () => {
// //     if (!selectedFile) return;
// //     setIsLoading(true);
// //     setError(null);
// //     setPrediction(null);

// //     const formData = new FormData();
// //     formData.append('file', selectedFile);

// //     try {
// //       const response = await fetch('/predict', {
// //         method: 'POST',
// //         body: formData,
// //       });
// //       if (!response.ok) {
// //         throw new Error(`Server error: ${response.statusText}`);
// //       }
// //       const data = await response.json();
// //       if (data.error) {
// //         throw new Error(data.error);
// //       }
// //       setPrediction(data.prediction);
// //       setConfidence(data.confidence);
// //     } catch (err) {
// //       setError(err.message || "Prediction failed. Is the Python server running?");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };
  
// //   const resultCardClass = !prediction ? 'result-card' : `result-card ${prediction.toLowerCase()}`;
// //   const resultTextClass = !prediction ? 'prediction-text' : `prediction-text ${prediction.toLowerCase()}`;

// //   return (
// //     <div className="app-wrapper">
// //         <Navbar theme={theme} toggleTheme={toggleTheme} />
// //         <div className="app-container">
// //         <div className="card">
// //             <header className="header">
// //             <h1>NeoScan</h1>
// //             <p>Upload a CT scan image to predict if it's Benign or Malignant.</p>
// //             </header>
// //             <main>
// //             <div className="upload-section">
// //                 <div className="upload-box" onClick={() => document.getElementById('file-upload').click()}>
// //                     {previewUrl ? <img src={previewUrl} alt="Selected scan" className="preview-image"/> : <PlaceholderIcon />}
// //                     <input id="file-upload" type="file" className="hidden-input" accept="image/*" onChange={handleFileChange} />
// //                 </div>
// //                 {selectedFile && (
// //                     <button onClick={handlePredict} disabled={isLoading} className="predict-button">
// //                         {isLoading && <Spinner />}
// //                         {isLoading ? 'Analyzing...' : 'Predict'}
// //                     </button>
// //                 )}
// //             </div>

// //             {error && (
// //                 <div className="error-box">
// //                 <p className="error-title">Error</p>
// //                 <p>{error}</p>
// //                 </div>
// //             )}

// //             {prediction && !isLoading && (
// //                 <div className={resultCardClass}>
// //                 <h2>Prediction Result</h2>
// //                 <div className="result-details">
// //                     <p className={resultTextClass}>{prediction}</p>
// //                     <p className="confidence-text">
// //                     Confidence: <span>{(confidence * 100).toFixed(2)}%</span>
// //                     </p>
// //                 </div>
// //                 </div>
// //             )}
// //             </main>
// //         </div>
// //         </div>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState } from "react";
// import './App.css'; // Nayi CSS file import karein

// // Loading spinner component
// const Spinner = () => (
//     <div className="spinner-overlay">
//         <div className="spinner"></div>
//     </div>
// );

// export default function App() {
//     // State variables ko theek kiya gaya hai
//     const [file, setFile] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [result, setResult] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     function handleFileChange(e) {
//         const selectedFile = e.target.files[0];
//         if (selectedFile && selectedFile.type.startsWith("image/")) {
//             setFile(selectedFile);
//             setPreviewUrl(URL.createObjectURL(selectedFile));
//             setResult(null); // Purana result hata dein
//             setError(null); // Purana error hata dein
//         } else {
//             setFile(null);
//             setPreviewUrl(null);
//             setError("Please select a valid image file.");
//         }
//     }

//     const handlePredict = async () => {
//         if (!file) return; // 'file' ka istemaal karein
        
//         setLoading(true);
//         setError(null);
//         setResult(null);

//         const formData = new FormData();
//         formData.append('file', file); // 'file' ka istemaal karein

//         try {
//             const response = await fetch('/predict', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error(`Server error: ${response.statusText}`);
//             }

//             const data = await response.json();

//             if (data.error) {
//                 throw new Error(data.error);
//             }
            
//             // 'setResult' ka istemaal karke result set karein
//             setResult({
//                 prediction: data.prediction,
//                 confidence: data.confidence,
//             });

//         } catch (err) {
//             setError(err.message || "Prediction failed. Is the Python server running?");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="app-container">
//             {loading && <Spinner />}
//             <div className="main-content">
//                 <h2>Upload Medical Image</h2>
//                 <div className="predict-grid">
//                     <div className="card upload-card">
//                         <p>Upload a CT scan to predict if it's Benign or Malignant.</p>

//                         <div className="upload-box">
//                             <input
//                                 id="file-upload"
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 style={{ display: "none" }}
//                             />
//                             <label htmlFor="file-upload" className="upload-label">
//                                 {!previewUrl ? (
//                                     <div className="placeholder-content">
//                                         <div style={{ fontSize: 28 }}>☁️</div>
//                                         <div style={{ marginTop: 8 }}>Drag 'n' drop or browse to upload</div>
//                                     </div>
//                                 ) : (
//                                     <img
//                                         src={previewUrl}
//                                         alt="preview"
//                                         className="preview-image"
//                                     />
//                                 )}
//                             </label>
//                         </div>
//                          {error && <p className="error-text">{error}</p>}
                        
//                         <button className="predict-btn" onClick={handlePredict} disabled={!file || loading}>
//                             {loading ? "Analyzing..." : "Predict"}
//                         </button>
//                     </div>

//                     <div className="card result-card">
//                         <h3>Prediction Result</h3>
//                         <div className="result-content">
//                             {!result && !error && (
//                                 <p className="muted-text">
//                                     Upload an image and click 'Predict' to see results.
//                                 </p>
//                             )}
//                             {result && (
//                                 <div className="result-details">
//                                     <p>
//                                         <strong>Prediction:</strong>{" "}
//                                         <span
//                                             className={`badge ${
//                                                 result.prediction.toLowerCase() === "benign" ? "benign" : "malignant"
//                                             }`}
//                                         >
//                                             {result.prediction}
//                                         </span>
//                                     </p>
//                                     <p>
//                                         <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
//                                     </p>
//                                 </div>
//                             )}
//                             {error && !result && (
//                                 <p className="error-text result-error">{error}</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import Home from "./Pages/Home";
import Predict from "./Pages/Predict";
import Dashboard from "./Pages/Dashboard";
import UserInfo from "./Pages/UserInfo";
import History from "./Pages/History";

export default function App() {

  const isloggedIn = !!localStorage.getItem("email");
  return (
    <div className="app-root">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict"
           element={isloggedIn ? <Predict /> : <navigate to="/login"/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}