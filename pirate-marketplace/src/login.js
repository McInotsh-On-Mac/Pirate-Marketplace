import React from 'react';
import pmlogo from './pmlogo.png';

const Login = () => {
  const containerStyle = {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
  };

  const formContainerStyle = {
    backgroundColor: '#f0f0f0',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '350px',
    height: '500px',
  };

  const logoStyle = {
    width: '200px',
    marginBottom: '1rem',
  };

  const titleStyle = {
    color: 'royalblue',
    fontSize: '2rem',
    marginBottom: '0.5rem',
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    marginBottom: '2rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'royalblue',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  };

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'royalblue',
    cursor: 'pointer',
    padding: '0.5rem',
    textDecoration: 'underline',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
  }

  return (
    <div style={containerStyle}>
      <img src={pmlogo} alt="Pirate Marketplace Logo" style={logoStyle} />
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Pirate Marketplace</h1>
        <h2 style={subtitleStyle}>Login</h2>
        <form>
          <input type="email" placeholder="Email" style={inputStyle} />
          <input type="password" placeholder="Password" style={inputStyle} />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
          <p>Or</p>
          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>
        <div style={buttonContainerStyle}>
          <button style={linkButtonStyle}>Forgot Password</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
