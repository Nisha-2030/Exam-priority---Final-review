import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem('studentEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('studentEmail', email);
      } else {
        localStorage.removeItem('studentEmail');
      }
      await login(email, password, 'student');
      navigate('/student-dashboard');
    } catch (err) {
      setError(err || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper student">
      <div className="login-card">
        <h2>Log In</h2>
        <p>Welcome back, student</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your Password"
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
          <div className="options">
            <label>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember
            </label>
            <a href="#" className="forgot">Forgotten?</a>
          </div>
          <button className="btn-login" type="submit">Log In</button>
          <p className="signup-redirect">
            Don't have an account? <Link to="/student-register">Sign Up</Link>
          </p>
        </form>
      </div>
      <div className="login-info">
        <h1>Welcome to student portal</h1>
        <p>Login to access your account</p>
        <img
          src="/assets/login-illustration.svg"
          alt="student portal illustration"
          className="login-illustration"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200.png?text=Illustration'; }}
        />
      </div>
    </div>
  );
};

export default StudentLogin;
