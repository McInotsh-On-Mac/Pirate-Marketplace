// Brian Csehoski
import React, { useEffect, useState } from 'react';
import pmlogo from './pmlogo.png';
import Listings from './listings';
import { loginUser } from './api';
import './login.css';

const AUTH_STORAGE_KEY = 'pirate-marketplace-session';

const getStoredSession = () => {
  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    return null;
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(getStoredSession);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const authSession = await loginUser({ email, password });
      setSession(authSession);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (session) {
    return <Listings />;
  }

  return (
    <div className="login-container">
      <img src={pmlogo} alt="Pirate Marketplace Logo" className="login-logo" />
      <div className="form-container">
        <h1 className="login-title">Pirate Marketplace</h1>
        <h2 className="login-subtitle">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
          {errorMessage ? <p className="login-error">{errorMessage}</p> : null}
          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Logging In...' : 'Login'}
          </button>
          <p>Or</p>
          <button type="button" className="login-button" disabled={isSubmitting}>
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
