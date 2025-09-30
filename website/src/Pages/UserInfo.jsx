import React, { useState, useEffect } from "react";
import api from "../api/api";

export default function UserInfo() {
    const [form, setForm] = useState({ name: "John Doe", dob: "1990-01-15", email: "john.doe@example.com", blood: "O+" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // fetch user info
        async function fetchUser() {
            try {
                const res = await api.get("/auth/me");
                if (res.data) setForm(res.data);
            } catch (e) { console.log("no user") };
        }
        fetchUser();
    }, []);

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/update", form);
            alert("Saved.");
        } catch (err) {
            console.error(err);
            alert("Save failed.");
        } finally { setLoading(false) }
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <form onSubmit={handleSave} style={{ width: 720 }}>
                <div className="card">
                    <h2>Personal Information</h2>
                    <div style={{ marginTop: 12 }}>
                        <label>Name</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" />
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label>Date of Birth</label>
                            <input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} className="input" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Email</label>
                            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input" />
                        </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <label>Blood Group</label>
                        <input value={form.blood} onChange={e => setForm(f => ({ ...f, blood: e.target.value }))} className="input" />
                    </div>

                    <button className="predict-btn" type="submit" disabled={loading} style={{ width: "100%", marginTop: 16 }}>
                        {loading ? "Saving..." : "Save Information"}
                    </button>
                </div>
            </form>
        </div>
    );
}