import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isTokenExpired, logout } from "../utils/tokenUtils";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("loggedInUser");

      // console.log("Navbar auth check:", {
      //   hasToken: !!token,
      //   hasUser: !!user,
      //   tokenExpired: token ? isTokenExpired(token) : "No token",
      // });

      setIsLoggedIn(Boolean(token && user && !isTokenExpired(token)));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout("/home");
  };

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
          {isLoggedIn ? (
            <button
              type="button"
              className="wr-link wr-nav-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="wr-link">
              Login
            </Link>
          )}

          <Link to="/dashboard" className="wr-btn wr-btn-dark">
            Start Now
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
