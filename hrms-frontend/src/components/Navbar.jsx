import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

// A simple Navbar component mapped to React Router's <Link>
// This prevents page reloads (like an SPA should).
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">HRMS Lite</div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item">
                    <Link to="/employees" className="nav-link">Employees</Link>
                </li>
                <li className="nav-item">
                    <Link to="/attendance" className="nav-link">Attendance</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
