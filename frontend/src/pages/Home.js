import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Home.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Home_Hero from "../assets/Home_Hero.jpg";
import Home_UploadEasily from "../assets/Home_UploadEasily.jpg";
import Home_SmartReminder from "../assets/Home_SmartReminder.jpg";
import Home_All1 from "../assets/Home_All1.jpg";
import Home_Ref from "../assets/Home_Ref.jpg";
import Home_Laptop from "../assets/Home_Laptop.jpg";

const faqs = [
  {
    q: "What types of documents can I upload?",
    a: "You can upload common warranty documents such as scanned invoices, receipts and warranty cards as PDF, JPG or PNG files. The app extracts product name, purchase date and warranty period automatically.",
  },
  {
    q: "How do warranty reminders work?",
    a: "We send you an email 30 days before your warranty expires, so you have enough time to take action.",
  },
  {
    q: "Can I edit extracted warranty information?",
    a: "Yes. You can review the extracted details and correct anything before saving.",
  },
  {
    q: "Is my uploaded information private?",
    a: "Yes. Your documents and details are kept private and stored securely.",
  },
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="landing-root">
      <main className="wr-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="wr-badge">
              <i className="fa-solid fa-circle"></i> Trusted warranty tracker
            </span>
            <h1>Never Miss a Warranty Expiry Again.</h1>
            <p>
              Upload your appliance warranty documents and get timely reminders
              before expiry. Stay organized and never lose track of your
              protection plans. Simple, secure, and stress-free.
            </p>
            <div className="wr-btn-row">
              <Link to="/dashboard" className="cta-btn wr-btn wr-btn-dark">
                Start Now
              </Link>
              <a href="#how" className="wr-btn wr-btn-light">
                How it works
              </a>
            </div>
            <div className="wr-avatars">
              <span className="av av1"></span>
              <span className="av av2"></span>
              <span className="av av3"></span>
              <small>Manage your warranties. Stay protected.</small>
            </div>
          </div>

          <div className="hero-leaf">
            <img src={Home_Hero} alt="Warranty protection illustration" />
            <div className="wr-stats">
              <div className="wr-stat">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <strong>12 active</strong>
                  <small>Warranties tracked</small>
                </div>
              </div>
              <div className="wr-stat">
                <i className="fa-regular fa-bell"></i>
                <div>
                  <strong>30 days before</strong>
                  <small>Smart email alerts</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="wr-section wr-center">
          <p className="wr-eyebrow">WHY WARRANTY REMINDER?</p>
          <h2 className="wr-title">Everything in one calm place</h2>
          <p className="wr-sub">
            Stop digging through drawers for invoices. Keep coverage organized
            and act in time.
          </p>
          <div className="wr-cards-3">
            {[
              {
                icon: "fa-regular fa-folder-open",
                t: "Save Time",
                d: "Keep warranty information organized in one place instead of searching through paper invoices and documents.",
              },
              {
                icon: "fa-regular fa-bell",
                t: "Stay Informed",
                d: "Receive email reminders before warranties expire so you have time to take action.",
              },
              {
                icon: "fa-solid fa-shield-halved",
                t: "Stay Protected",
                d: "Keep important warranty records accessible and reduce the chances of missing warranty coverage deadlines.",
              },
            ].map((c) => (
              <div className="wr-card" key={c.t}>
                <span className="wr-icon">
                  <i className={c.icon}></i>
                </span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <a href="#how" className="wr-more">
                  Learn more <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="wr-section wr-center">
          <p className="wr-eyebrow">FEATURES</p>
          <h2 className="wr-title">Built for real paperwork</h2>
        </section>

        <div className="info-stuff">
          <div className="info-section">
            <div className="section-text">
              <span className="wr-tag">
                <i className="fa-solid fa-cloud-arrow-up"></i> 01 — UPLOAD
              </span>
              <h2 className="section-heading">Upload Easily</h2>
              <p className="section-desc">
                Drag and drop documents or take a photo—your data stays private
                and safe.
              </p>
              <p className="section-desc">
                No complicated steps or extra software needed—just a smooth,
                intuitive experience.
              </p>
              <ul className="wr-checks">
                <li>
                  <i className="fa-solid fa-check"></i> Drag &amp; drop PDF, JPG
                  or PNG
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Works on desktop and
                  mobile
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> One invoice per
                  appliance
                </li>
              </ul>
            </div>
            <div className="section-image">
              <img src={Home_UploadEasily} alt="Uploading warranty documents" />
            </div>
          </div>

          <div className="info-section wr-reverse">
            <div className="section-text">
              <span className="wr-tag">
                <i className="fa-regular fa-calendar-check"></i> 02 — REMINDERS
              </span>
              <h2 className="section-heading">Smart Reminders</h2>
              <p className="section-desc">
                Get automatic email alerts before any warranty is set to expire.
              </p>
              <p className="section-desc">
                Whether it’s your laptop, phone, or household appliance, we’ll
                notify you in advance to give you time to act.
              </p>
              <ul className="wr-checks">
                <li>
                  <i className="fa-solid fa-check"></i> Alerts 30 days before
                  expiry
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> One email per warranty
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Never miss a deadline
                </li>
              </ul>
            </div>
            <div className="section-image wr-cream">
              <img src={Home_SmartReminder} alt="Warranty expiry reminders" />
            </div>
          </div>

          <div className="info-section">
            <div className="section-text">
              <span className="wr-tag">
                <i className="fa-solid fa-table-cells-large"></i> 03 — ORGANIZE
              </span>
              <h2 className="section-heading">All in One Place</h2>
              <p className="section-desc">
                Keep your warranty information organized in one place. Easily
                manage important details about your appliances and electronics.
              </p>
              <ul className="wr-checks">
                <li>
                  <i className="fa-solid fa-check"></i> Product, date &amp;
                  duration at a glance
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Review and correct
                  details
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Confirm and save
                  securely
                </li>
              </ul>
            </div>
            <div className="section-image wr-cream">
              <img src={Home_All1} alt="Organized warranty documents" />
            </div>
          </div>
        </div>

        {/* How it works */}
        <section className="wr-how" id="how">
          <p className="wr-eyebrow wr-light">HOW IT WORKS</p>
          <h2 className="wr-title wr-light">Three steps to peace of mind</h2>
          <div className="wr-cards-3">
            {[
              {
                n: "01",
                icon: "fa-regular fa-file-lines",
                t: "Upload Your Invoice",
                d: "Upload your warranty document or invoice.",
              },
              {
                n: "02",
                icon: "fa-solid fa-expand",
                t: "Review Warranty Details",
                d: "The application extracts warranty information. Users can review and correct the extracted details.",
              },
              {
                n: "03",
                icon: "fa-regular fa-envelope",
                t: "Get Timely Reminders",
                d: "Receive email notifications before your warranty expires.",
              },
            ].map((s) => (
              <div className="wr-step" key={s.n}>
                <span className="wr-num">{s.n}</span>
                <span className="wr-icon wr-icon-dark">
                  <i className={s.icon}></i>
                </span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Audience */}
        <section className="wr-section">
          <p className="wr-eyebrow">WHO IS IT FOR?</p>
          <h2 className="wr-title wr-left">For everyday purchases</h2>
          <div className="wr-row-between">
            <p className="wr-sub wr-left">
              Organize warranties for the appliances and devices you already
              own. No new habits needed.
            </p>
            <Link to="/dashboard" className="wr-more">
              Browse dashboard <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          <div className="wr-cards-2">
            <div className="wr-card wr-aud">
              <span className="wr-icon">
                <i className="fa-solid fa-blender-phone"></i>
              </span>
              <h3>Home Appliances</h3>
              <p>
                Refrigerators, washing machines, televisions and other household
                appliances.
              </p>
              <div className="wr-pills">
                <span>Fridge</span>
                <span>Washer</span>
                <span>TV</span>
              </div>
              {/* <i className="fa-solid fa-soap wr-aud-art"></i> */}
              <img src={Home_Ref} alt="Warranty management illustration" />
            </div>
            <div className="wr-card wr-aud">
              <span className="wr-icon">
                <i className="fa-solid fa-laptop"></i>
              </span>
              <h3>Personal Electronics</h3>
              <p>Laptops, smartphones, tablets and other electronic devices.</p>
              <div className="wr-pills">
                <span>Laptop</span>
                <span>Phone</span>
                <span>Tablet</span>
              </div>
              {/* <i className="fa-solid fa-laptop wr-aud-art"></i> */}
              <img
                className="wr-laptop-image"
                src={Home_Laptop}
                alt="Personal electronics"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="wr-faq">
          <div className="wr-faq-left">
            <p className="wr-eyebrow">FAQ</p>
            <h2 className="wr-title wr-left">Questions, answered</h2>
            <p className="wr-sub wr-left">
              Everything you need to know about uploads, reminders and privacy.
            </p>
          </div>
          <div className="wr-faq-list">
            {faqs.map((f, i) => (
              <div
                className={`wr-faq-item ${openFaq === i ? "open" : ""}`}
                key={f.q}
              >
                <button
                  type="button"
                  className="wr-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {f.q}
                  <span className="wr-toggle">
                    <i
                      className={`fa-solid ${openFaq === i ? "fa-minus" : "fa-plus"}`}
                    ></i>
                  </span>
                </button>
                {openFaq === i && <p className="wr-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="wr-cta">
          <span className="wr-badge wr-badge-white">
            GET PROTECTED IN MINUTES
          </span>
          <h2>Don't Let Your Warranties Expire Unnoticed.</h2>
          <p>
            Start organizing your warranty documents today and stay informed
            about important expiry dates.
          </p>

          <div className="wr-btn-row wr-center-row">
            <Link to="/dashboard" className="wr-btn wr-btn-dark">
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
            <a href="#how">Features</a>
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

export default Home;
