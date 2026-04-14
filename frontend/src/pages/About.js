import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Exam Priority Portal</h1>
          <p>Revolutionizing how students prepare for competitive exams</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="section-content">
          <h2>Our Mission</h2>
          <p>
            We are dedicated to making competitive exam preparation smart, efficient, and accessible 
            to every student. Our platform leverages cutting-edge technology to provide personalized 
            learning experiences that help students achieve their academic goals.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-section vision-section">
        <div className="section-content">
          <h2>Our Vision</h2>
          <p>
            To democratize quality education and create a world where every student has access to 
            world-class exam preparation resources, expert guidance, and intelligent learning tools 
            that adapt to their unique learning style.
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="about-section features-section">
        <h2>Why Choose Exam Priority Portal?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Comprehensive Content</h3>
            <p>Extensive study materials covering all major competitive exams with regularly updated content</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Quizzes</h3>
            <p>Interactive quizzes with instant feedback to help you assess and improve your knowledge</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Real-time progress monitoring with detailed analytics to visualize your improvement</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <h3>Video Lectures</h3>
            <p>High-quality video content from expert instructors explaining complex concepts</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Practice Exams</h3>
            <p>Full-length practice exams with real exam patterns to boost your confidence</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Personalized Learning</h3>
            <p>Adaptive learning paths tailored to your strengths and weaknesses</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section team-section">
        <h2>Our Team</h2>
        <p className="team-intro">
          We are a dedicated team of educators, developers, and technologists passionate about 
          transforming the way students learn and prepare for exams.
        </p>
      </section>

      {/* Contact Section */}
      <section className="about-section contact-section">
        <h2>Get In Touch</h2>
        <p>Have questions? We'd love to hear from you!</p>
        <div className="contact-info">
          <p><strong>Email:</strong> support@exampriorityportal.com</p>
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>Address:</strong> 123 Learning Street, Education City, ED 12345</p>
        </div>
      </section>
    </div>
  );
};

export default About;
