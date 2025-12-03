import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { handlesucess, handleerror } from "../util";
import  '../Login.css'

const Login = () => {
  const [LoginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...LoginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };
  console.log("LoginInfo ->", LoginInfo);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = LoginInfo;
    if (!email || !password) {
      return handleerror("All fields are required");
    }
    // api call

    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(LoginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handlesucess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", JSON.stringify({ email, name }));
        navigate("/dashboard");
      } else if (error) {
        const details = error.details[0].message;
        handleerror(details);
      } else if (success === false) {
        handleerror(message);
      }
      console.log(result);
    } catch (err) {
      handleerror(err);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handlechange}
            type="email"
            name="email"
            placeholder="Enter you email.."
            value={LoginInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handlechange}
            type="text"
            name="password"
            placeholder="Enter you password.."
            value={LoginInfo.password}
          />
        </div>
        <button type="submit">Login</button>
        <span>
          Don't have an account ?<Link to="/signup">Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
