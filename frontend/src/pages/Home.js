import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (user) {
    if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/student-dashboard');
    }
    return null;
  }

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="glow-element glow1"></div>
        <div className="glow-element glow2"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-hero">
            <span className="badge">✨ Welcome to Next Level Learning</span>
          </div>
          
          <h1 className="hero-title">
            Master Your Exams with
            <span className="gradient-text"> Intelligent Learning</span>
          </h1>
          
          <p className="hero-subtitle">
            Exam Priority Digital Immersive Skill Training Portal - 
            Prepare smart with priority topics and adaptive learning paths
          </p>

          <div className="hero-stats">
            <div className="stat-card">
              <h4>1000+</h4>
              <p>Questions</p>
            </div>
            <div className="stat-card">
              <h4>50+</h4>
              <p>Topics</p>
            </div>
            <div className="stat-card">
              <h4>24/7</h4>
              <p>Access</p>
            </div>
          </div>

          <div className="cta-buttons-hero">
            <button
              className="btn-hero btn-primary-hero"
              onClick={() => navigate('/student-login')}
            >
              <span className="btn-icon">👨‍🎓</span>
              Student Login
              <span className="btn-arrow">→</span>
            </button>
            <button
              className="btn-hero btn-secondary-hero"
              onClick={() => navigate('/admin-login')}
            >
              <span className="btn-icon">👨‍💼</span>
              Admin Portal
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <div className="hero-image-section">
          <div className="hero-visual">
            <div className="visual-card card-1">
              <div className="icon">📚</div>
              <div className="text">Learn</div>
            </div>
            <div className="visual-card card-2">
              <div className="icon">✓</div>
              <div className="text">Practice</div>
            </div>
            <div className="visual-card card-3">
              <div className="icon">🏆</div>
              <div className="text">Succeed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Why Choose Us?</h2>
          <p>Everything you need to excel in competitive exams</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Targeted Learning</h3>
            <p>Focus on High and Medium priority topics curated specifically for exam success</p>
            <div className="feature-highlight">Smart Priority System</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed analytics and visual progress tracking</p>
            <div className="feature-highlight">Real-time Insights</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">❓</div>
            <h3>Quiz Practice</h3>
            <p>Test knowledge with topic-wise quizzes, mock tests, and instant feedback</p>
            <div className="feature-highlight">Adaptive Difficulty</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎥</div>
            <h3>Video Learning</h3>
            <p>Expert-curated video lectures for visual learners and quick concept reviews</p>
            <div className="feature-highlight">HD Quality Videos</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Learn Anywhere</h3>
            <p>Access all content on desktop, tablet, or mobile device anytime, anywhere</p>
            <div className="feature-highlight">Fully Responsive</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is protected with enterprise-grade security and privacy measures</p>
            <div className="feature-highlight">100% Secure</div>
          </div>
        </div>
      </section>

      {/* Exams Section */}
      <section id="exams" className="exams-section">
        <div className="section-header exams-header">
          <h2>Supported Exams</h2>
          <p>Exam Details</p>
        </div>

        <div className="exams-grid">
          <div className="exam-card">
            <div className="exam-badge">Railway</div>
            <h3>RRB Exams</h3>
            <p>Railway Recruitment Board</p>
            <ul>
              <li>NTPC, Group D</li>
              <li>Senior Clerk</li>
              <li>Officer Scale</li>
            </ul>
          </div>

          <div className="exam-card">
            <div className="exam-badge">State</div>
            <h3>TNPSC</h3>
            <p>Tamil Nadu Public Service</p>
            <ul>
              <li>TNPSC Group 1, 2, 4</li>
              <li>VAO Exam</li>
              <li>Conduct Rules Test</li>
            </ul>
          </div>

          <div className="exam-card">
            <div className="exam-badge">Central</div>
            <h3>SSC Exams</h3>
            <p>Staff Selection Commission</p>
            <ul>
              <li>SSC CGL, CHSL</li>
              <li>MTS, GD Constable</li>
              <li>Stenographer</li>
            </ul>
          </div>

          <div className="exam-card">
            <div className="exam-badge">Banking</div>
            <h3>Bank Exams</h3>
            <p>IBPS, SBI & Other Banks</p>
            <ul>
              <li>PO, Clerk, SO</li>
              <li>RRB Banking</li>
              <li>NABARD, SIDBI</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-final-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of successful exam aspirants today</p>
          <div className="cta-buttons-final">
            <button
              className="btn-final btn-primary-final"
              onClick={() => navigate('/student-login')}
            >
              Get Started as Student
            </button>
            <button
              className="btn-final btn-secondary-final"
              onClick={() => navigate('/admin-login')}
            >
              Admin Access
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Exam Priority Portal</h4>
            <p>Making competitive exam preparation smart, efficient, and accessible.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#exams">Exams</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Help Center</h4>
            <ul>
              <li><a href="/about">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Exam Priority Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
