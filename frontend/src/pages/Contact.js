import React from "react";
import "../Contact.css"; // separate stylesheet
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const Contact = () => {
  return (
    <div className="contact-root">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtext">
          Have questions or feedback? We’d love to hear from you.
        </p>
      </section>

      {/* Contact Info */}
      <section className="contact-info">
        <div className="info-card">
          <FiPhone className="info-icon" />
          <h3>Phone</h3>
          <p>+91 98765 43210</p>
        </div>
        <div className="info-card">
          <FiMail className="info-icon" />
          <h3>Email</h3>
          <p>support@warrantyreminder.com</p>
        </div>
        <div className="info-card">
          <FiMapPin className="info-icon" />
          <h3>Address</h3>
          <p>Ghaziabad, Uttar Pradesh, India</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <h2>Send us a message</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit" className="contact-btn">Submit</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
