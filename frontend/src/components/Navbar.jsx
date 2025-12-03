import React from "react";
import { Link } from "react-router-dom";
import "../Home.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Warranty Reminder</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
      <div className="auth-buttons">
        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
