
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="wr-nav-shell">
      <header className="wr-nav">
        <Link to="/home" className="wr-brand">
          <span className="wr-brand-mark">W</span>

          <span className="wr-brand-text">
            <strong>Warranty Reminder</strong>
            <small>Stay protected, always</small>
          </span>
        </Link>

        <nav className="wr-nav-pill">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <div className="wr-nav-actions">
          <Link to="/login" className="wr-link">
            Login
          </Link>

          <Link to="/dashboard" className="wr-btn wr-btn-dark">
            Start Now
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
