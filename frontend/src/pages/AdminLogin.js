import React, { useState } from 'react';
import './LoginPage.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, 'admin');
      navigate('/admin-dashboard');
    } catch (err) {
      alert(err || 'Login failed');
    }
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
        <h1>Welcome Administrator</h1>
        <p>Access the control panel</p>
        <img
          src="/assets/login-illustration.svg"
          alt="admin portal illustration"
          className="login-illustration"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200.png?text=Illustration'; }}
        />
      </div>
    </div>
  );
};

export default AdminLogin;
