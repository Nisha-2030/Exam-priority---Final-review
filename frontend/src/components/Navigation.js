import React, { useState } from 'react';
import './Navigation.css';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <a href="/" className="logo-link">
            <span className="logo-icon">📚</span>
            <span className="logo-text">Exam Priority</span>
          </a>
        </div>

        <button
          className={`nav-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <div className="nav-main-links">
            <a href="/about" className="nav-link">About</a>
            <a href="/faq" className="nav-link">FAQ</a>
          </div>
          {user ? (
            <div className="nav-user-section">
              <div className="user-badge">
                <span className="user-icon">👤</span>
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-role">{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                <span>🚪</span> Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-links">
              <a href="/student-login" className="nav-link student-link">
                <span>👨‍🎓</span> Student
              </a>
              <a href="/admin-login" className="nav-link admin-link">
                <span>👨‍💼</span> Admin
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
