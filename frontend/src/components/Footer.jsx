import React from "react";
import { Link } from "react-router-dom";
import "../Home.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="footer-logo">Warranty Reminder</h3>
          <p className="footer-tagline">
            Your peace of mind, always protected.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/home">Features</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/home">Privacy</Link>
        </div>

        <div className="footer-social">
          <Link to="/home">
            <i className="fab fa-twitter"></i>
          </Link>
          <Link to="#">
            <i className="fab fa-linkedin"></i>
          </Link>
          <Link to="#">
            <i className="fab fa-github"></i>
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Warranty Reminder. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
