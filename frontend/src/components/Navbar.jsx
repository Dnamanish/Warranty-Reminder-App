import React from "react";
import { Link ,useNavigate} from "react-router-dom";
import "../Home.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isloggedIn = localStorage.getItem("loggedInUser") !== null;

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

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
        {!isloggedIn ? (
          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>
        ) : (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
