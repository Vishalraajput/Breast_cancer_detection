import React from "react";
import { NavLink } from "react-router-dom";
import main_logo from '../main_logo.png';
// import './Navbar.css'
export default function Navbar() {
    return (
        <header className="navbar">
            <div className="logo">
                <div style={{ width: 28, height: 28, borderRadius: 6,paddingLeft:'-10px' }} >
                    <img src={main_logo} alt="CT-Vision Logo" style={{ width: '180%', height: '100%', borderRadius: 6 }} />
                </div>
                <span>CT-Vision</span>
            </div>

            <nav className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/predict">Predict</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/user-info">User Info</NavLink>
                <NavLink to="/history">History</NavLink>
            </nav>

            <div className="nav-actions">
                <button style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Login</button>
                <button style={{ background: "#fff", color: "var(--primary)" }}>Sign Up</button>
            </div>
        </header>
    );
}