import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Navigation.css';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle hash navigation to sections
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1); // Remove '#' from hash
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  // Close dropdown when a link is clicked
  const handleDropdownLinkClick = () => {
    setDropdownOpen(false);
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

          {/* Three Line Menu */}
          {user?.role !== 'admin' && (['/student-dashboard', '/', '/about', '/faq'].includes(location.pathname) ||
            location.pathname.includes('/quiz/') ||
            location.pathname.includes('/feedback/')) && (
            <div className="nav-dropdown-menu" ref={dropdownRef}>
              <button
                className="nav-dropdown-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="More options"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <div className={`nav-dropdown-content ${dropdownOpen ? 'active' : ''}`}>
                {(location.pathname.includes('/quiz/') ||
                  location.pathname.includes('/feedback/')) &&
                  user?.role === 'student' && (
                    <>
                      <a
                        href="/student-dashboard"
                        className="dropdown-link"
                        onClick={handleDropdownLinkClick}
                      >
                        📚 Move to Subject Topics
                      </a>
                      <hr className="dropdown-divider" />
                    </>
                  )}
                <a href="/about" className="dropdown-link" onClick={handleDropdownLinkClick}>
                  ℹ️ About
                </a>
                <a href="/faq" className="dropdown-link" onClick={handleDropdownLinkClick}>
                  ❓ FAQ
                </a>
                <a href="/about" className="dropdown-link" onClick={handleDropdownLinkClick}>
                  📞 Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
