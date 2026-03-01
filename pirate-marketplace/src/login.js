// Brian Csehoski
import React, { useState } from 'react';
import pmlogo from './pmlogo.png';
import Listings from './listings';
import './login.css';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <Listings />;
  }

  return (
    <div className="login-container">
      <img src={pmlogo} alt="Pirate Marketplace Logo" className="login-logo" />
      <div className="form-container">
        <h1 className="login-title">Pirate Marketplace</h1>
        <h2 className="login-subtitle">Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <button type="submit" className="login-button">
            Login
          </button>
          <p>Or</p>
          <button type="button" className="login-button">
            Sign Up
          </button>
        </form>
        <div className="button-container">
          <button className="login-link-button">Forgot Password</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
