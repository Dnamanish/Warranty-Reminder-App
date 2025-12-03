import React from "react";
import { Link } from "react-router-dom";
import "../Home.css";
import uploadeasily from "../assets/uploadeasily.png";
import Oneplace from "../assets/Oneplace.png";
import SmartReminders from "../assets/SmartReminders.jpg";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Home = () => {
  return (
    <div className="landing-root">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1> WARRANTY CARE</h1>
          <p>
            Upload your appliance warranty documents and get timely reminders
            before expiry. Stay organized and never lose track of your
            protection plans. Simple, secure, and stress-free.
          </p>
          <Link to="/dashboard" className="cta-btn">
            Start Now
          </Link>
        </div>
        <div className="hero-leaf">
          <img src="/warr.png" alt="Organic theme leaf" />
        </div>
      </section>

      {/* Lower features/footer section */}
      <div className="info-stuff">
        <div className="info-section">
          <div className="section-text">
            <h2 className="section-heading">Upload Easily</h2>
            <p className="section-desc">
              Drag and drop documents or take a photo—your data stays private
              and safe.
            </p>
            <p className="section-desc">
              No complicated steps or extra software needed—just a smooth,
              intuitive experience.
            </p>
          </div>
          <div className="section-image">
            <img src={uploadeasily} />
          </div>
        </div>

        <div className="info-section">
          <div className="section-text">
            <h2 className="section-heading">Smart Reminders</h2>
            <p className="section-desc">
              Get automatic email alerts before any warranty is set to expire.
            </p>
            <p className="section-desc">
              Whether it’s your laptop, phone, or household appliance, we’ll
              notify you in advance to give you time to act.
            </p>
          </div>
          <div className="section-image">
            <img src={SmartReminders} />
          </div>
        </div>

        <div className="info-section">
          <div className="section-text">
            <h2 className="section-heading">All in One Place</h2>
            <p className="section-desc">
              Get automatic email alerts before any warranty is set to expire.
            </p>
            <p className="section-desc">
              Whether it’s your laptop, phone, or household appliance, we’ll
              notify you in advance to give you time to act.
            </p>
          </div>
          <div className="section-image">
            <img src={Oneplace} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
