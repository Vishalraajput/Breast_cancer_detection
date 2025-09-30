import React from "react";
import CardFeature from "../Component/CardFeature";

export default function Home() {
    return (
        <>
            <section className="hero">
                <div className="left">
                    <h1>Empowering Health with AI-Powered Cancer Prediction</h1>
                    <p>
                        Our advanced system leverages cutting-edge AI to analyze medical scans,
                        providing accurate and trustworthy predictions for early cancer detection.
                    </p>
                    <a className="cta" href="/predict">Get Started with a Prediction</a>
                </div>
                <div className="right" style={{ width: 420 }}>
                    <div style={{ background: "#e6eef6", height: 240, borderRadius: 12 }} />
                </div>
            </section>

            <section className="features">
                <h2>Explore Our Core Features</h2>
                <div className="feature-grid">
                    <CardFeature title="Make a New Prediction" desc="Upload your medical scan images and receive instant cancer predictions with confidence scores." />
                    <CardFeature title="Access Your Dashboard" desc="View your personal information, manage your profile, and review your prediction history." />
                </div>
            </section>
        </>
    );
}