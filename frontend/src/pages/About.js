import React from "react";
import "../Home.css";
import "../About.css";
import About_HeroIMG from "../assets/About_HeroIMG.jpg";
import { FiTarget, FiHeart, FiShare2, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const About = () => {
  return (
    <div className="landing-root">
      <main className="wr-container about-root">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-text">
            <p className="about-eyebrow">ABOUT US</p>
            <h1 className="about-title">About Warranty Reminder</h1>
            <p className="about-lead">
              Warranty Reminder helps you stay organized and stress-free when
              managing appliance warranties.
            </p>
            <p className="about-subtext">
              Securely upload your warranty documents and receive timely alerts
              before your coverage expires.
            </p>
            <div className="about-hero-actions">
              <Link to="/dashboard" className="wr-btn wr-btn-dark">
                Get Started
              </Link>
              <span className="about-private">
                <FiLock /> Private to your account
              </span>
            </div>
          </div>
          <div className="about-hero-image">
            <img src={About_HeroIMG} alt="Warranty Reminder illustration" />
          </div>
        </section>

        {/* Mission, Values, How It Works */}
        <section className="about-features">
          <div className="about-feature-card">
            <span className="about-icon-box dark">
              <FiTarget className="about-icon" />
            </span>
            <h2>Our Mission</h2>
            <p>
              To make warranty management easy, accessible, and reliable—giving
              you peace of mind and control.
            </p>
          </div>
          <div className="about-feature-card">
            <span className="about-icon-box">
              <FiHeart className="about-icon" />
            </span>
            <h2>Our Values</h2>
            <p>
              We believe in privacy, simplicity, and a clean user experience.
            </p>
          </div>
          <div className="about-feature-card">
            <span className="about-icon-box">
              <FiShare2 className="about-icon" />
            </span>
            <h2>How It Works</h2>
            <p>
              Upload your warranty documents, review the extracted details, and
              receive reminders before coverage ends.
            </p>
          </div>
        </section>

        {/* Stats band */}
        <section className="about-stats">
          <div className="about-stat">
            <strong>3 steps</strong>
            <span>Upload → Review → Remind</span>
          </div>
          <div className="about-stat">
            <strong>30 days</strong>
            <span>Advance email notice</span>
          </div>
          <div className="about-stat">
            <strong>1 place</strong>
            <span>For all your warranties</span>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <span className="wr-badge wr-badge-white about-cta-badge">
            GET PROTECTED IN MINUTES
          </span>
          <h2>Ready to Stay on Top of Your Warranties?</h2>
          <p>
            Start organizing your warranty documents today and stay informed
            about important expiry dates.
          </p>
          <div className="wr-btn-row wr-center-row">
            <Link to="/dashboard" className="wr-btn wr-btn-dark cta-button">
              Get Started
            </Link>
            <Link to="/dashboard" className="wr-btn wr-btn-white">
              View Dashboard
            </Link>
          </div>
          <small>Free to start • No credit card needed</small>
        </section>
      </main>

      {/* Footer */}
      <footer className="wr-footer">
        <div className="wr-footer-grid">
          <div>
            <div className="wr-brand wr-brand-light">
              <span className="wr-brand-mark light">W</span>
              <span className="wr-brand-text">
                <strong>Warranty Reminder</strong>
              </span>
            </div>
            <p className="wr-foot-tag">Your peace of mind, always protected.</p>
            <div className="wr-social">
              <a href="#!">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#!">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#!">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#!">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div>
            <h4>Product</h4>
            <Link to="/">Home</Link>
            <Link to="/">Features</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <a href="#!">Privacy</a>
          </div>
          <div>
            <h4>Stay updated</h4>
            <p className="wr-foot-tag">
              Expiry alerts and product tips, once a month.
            </p>
            <div className="wr-subscribe">
              <input type="email" placeholder="Email address" />
              <button type="button">Join</button>
            </div>
          </div>
        </div>
        <div className="wr-footer-bottom">
          <span>© 2026 Warranty Reminder. All rights reserved.</span>
          <span>
            <a href="#!">Privacy Policy</a>
            <a href="#!">Terms of Service</a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default About;
