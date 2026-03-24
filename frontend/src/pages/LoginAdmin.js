import React, { useState } from 'react';
import './LoginPage.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('admin login', email, password);
  };

  return (
    <div className="login-wrapper admin">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p>Access the dashboard</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button className="btn-login" type="submit">Log In</button>
        </form>
      </div>
      <div className="login-info">
        <h1>LUCY™ Admin</h1>
        <p>Manage learning content, users and settings</p>
      </div>
    </div>
  );
};

export default LoginAdmin;
