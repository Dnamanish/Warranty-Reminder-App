import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useRef } from "react";
import { handlesucess, handleerror } from "../util";

import "../Signup.css";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const signupLock = useRef(false);

  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    const copysignupInfo = { ...signupInfo };
    copysignupInfo[name] = value;
    setSignupInfo(copysignupInfo);
  };

  const handlesignup = async (e) => {
    e.preventDefault();

    if (signupLock.current) return;

    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleerror("All fields are required");
    }

    signupLock.current = true;
    setIsLoading(true);

    try {
      // const url = "https://warranty-reminder-app.onrender.com/auth/signup";

      const url = "http://localhost:8080/auth/signup";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handlesucess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error.details[0].message;
        handleerror(details);
      } else if (success === false) {
        handleerror(message);
      }
    } catch (err) {
      handleerror(err);
    } finally {
      signupLock.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handlesignup}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handlechange}
            type="text"
            name="name"
            autoFocus
            placeholder="Enter you name.."
            value={signupInfo.name}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handlechange}
            type="email"
            name="email"
            placeholder="Enter you email.."
            value={signupInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handlechange}
            type="password"
            name="password"
            placeholder="Enter you password.."
            value={signupInfo.password}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Signup"}
        </button>
        <span>
          Alreay have an account ?<Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
