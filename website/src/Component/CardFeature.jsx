import React from "react";
export default function CardFeature({ title, desc }) {
    return (
        <div className="feature-card card">
            <h3>{title}</h3>
            <p style={{ color: "var(--muted)" }}>{desc}</p>
        </div>
    );
}