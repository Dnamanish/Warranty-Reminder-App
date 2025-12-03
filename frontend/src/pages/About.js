import React from "react";
import "../About.css";
import AboutImg from "../assets/AboutImg.svg";
import { FiCloud, FiShield, FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import "../Home.css";

const About = () => {
  return (
    <div>

      <div className="about-root">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-text">
            <h1 className="about-title">About Warranty Reminder</h1>
            <p className="about-subtext">
              Warranty Reminder helps you stay organized and stress-free when
              managing appliance warranties.
            </p>
            <p className="about-subtext">
              Securely upload your warranty documents and receive timely alerts
              before your coverage expires.
            </p>
          </div>
          <div className="about-hero-image">
            <img src={AboutImg} alt="Warranty Reminder illustration" />
          </div>
        </section>

        {/* Mission, Values, How It Works */}
        <section className="about-features">
          <div className="about-feature-card">
            <FiCloud className="about-icon" />
            <h2>Our Mission</h2>
            <p>
              To make warranty management easy, accessible, and reliable—giving
              you peace of mind and control.
            </p>
          </div>
          <div className="about-feature-card">
            <FiShield className="about-icon" />
            <h2>Our Values</h2>
            <p>
              We believe in privacy, simplicity, and a clean user experience.
              Your data is secure, always.
            </p>
          </div>
          <div className="about-feature-card">
            <FiBell className="about-icon" />
            <h2>How It Works</h2>
            <p>
              Upload any warranty, and our platform tracks expiry dates and
              notifies you before coverage ends.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <h2>Ready to stay on top of your warranties?</h2>
          <Link to="/dashboard" className="cta-button">
            Get Started
          </Link>
        </section>

      </div>
    </div>
  );
};

export default About;
