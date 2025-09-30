import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
    const [preds, setPreds] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/predict/history");
                setPreds(res.data || []);
            } catch (e) { console.error(e) }
        }
        load();
    }, []);

    return (
        <div>
            <h2>Welcome, Dr. Elena Petrova!</h2>
            <section>
                <h3>Your Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="card">Full Name<br /><strong>Dr. Elena Petrova</strong></div>
                    <div className="card">Date of Birth<br /><strong>1985-03-15</strong></div>
                    <div className="card">Email<br /><strong>elena.petrova@example.com</strong></div>
                    <div className="card">Blood Group<br /><strong>A+</strong></div>
                </div>
            </section>

            <section style={{ marginTop: 28 }}>
                <h3>Previous Predictions</h3>
                <div className="card">
                    <table className="table">
                        <thead>
                            <tr><th>Date</th><th>Image Type</th><th>Result</th></tr>
                        </thead>
                        <tbody>
                            {preds.map(p => (
                                <tr key={p._id}>
                                    <td>{new Date(p.createdAt).toISOString().split("T")[0]}</td>
                                    <td>{p.imageType || "Unknown"}</td>
                                    <td>
                                        <span className={`badge ${p.predicted === 'Benign' ? 'benign' : 'malig'}`}>{p.predicted}</span>
                                    </td>
                                </tr>
                            ))}
                            {preds.length === 0 && <tr><td colSpan={3}>No predictions yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}