import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById } from '../services/examService';
import FeedbackComponent from '../components/FeedbackComponent';
import FeedbackAnalyticsComponent from '../components/FeedbackAnalyticsComponent';
import Card from '../components/Card';
import './FeedbackPage.css';

/**
 * FeedbackPage
 * Dedicated page for viewing feedback analytics and submitting feedback
 * Features: Analytics, form, user profile integration
 */
const FeedbackPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'feedback'
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadTopicData();
  }, [loadTopicData]);

  const loadTopicData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const topicResp = await getTopicById(topicId);
      const topicData = topicResp?.data?.data || topicResp?.data;
      setTopic(topicData);
    } catch (err) {
      console.error('Error loading topic:', err);
      setError('Failed to load topic details');
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  const handleFeedbackSubmit = () => {
    // Refresh analytics after feedback submission
    setRefreshKey(prev => prev + 1);
    // Switch to analytics tab to show updated stats
    setActiveTab('analytics');
  };

  const handleBackClick = () => {
    if (topic?.subject?._id) {
      navigate(`/materials/${topicId}`);
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="feedback-page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading feedback page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-page-container">
        <Card title="Error">
          <p className="error-message">{error}</p>
          <button onClick={loadTopicData} className="btn-retry">
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="feedback-page-container">
      {/* Header Section */}
      <div className="feedback-header-section">
        <button className="btn-back" onClick={handleBackClick}>
          ← Back
        </button>
        <div className="header-content">
          <h1>💬 Feedback & Reviews</h1>
        </div>
      </div>

      {/* Hero Section with Stats */}
      <div className="feedback-hero-section">
        <div className="hero-card">
          <div className="hero-icon">⭐</div>
          <div className="hero-text">
            <h3>Share Your Experience</h3>
            <p>Help improve content by sharing your feedback. Your insights matter!</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="feedback-tabs">
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">Analytics & Reviews</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          <span className="tab-icon">✏️</span>
          <span className="tab-label">Submit Feedback</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="feedback-content">
        {/* Analytics Tab */}
        <div className={`tab-content ${activeTab === 'analytics' ? 'active' : ''}`}>
          <Card title="">
            <FeedbackAnalyticsComponent 
              key={refreshKey}
              topicId={topicId} 
              topicName={topic?.name} 
            />
          </Card>
        </div>

        {/* Feedback Form Tab */}
        <div className={`tab-content ${activeTab === 'feedback' ? 'active' : ''}`}>
          <Card title="">
            <FeedbackComponent
              topicId={topicId}
              topicName={topic?.name}
              onSubmitSuccess={handleFeedbackSubmit}
            />
          </Card>
        </div>
      </div>

      {/* Info Section */}
      <div className="feedback-info-section">
        <div className="info-card">
          <h4>💡 Why Your Feedback Matters</h4>
          <ul>
            <li>Helps instructors understand learning effectiveness</li>
            <li>Improves content quality for future students</li>
            <li>Identifies topics that need clarification</li>
            <li>Recognizes well-explained and helpful materials</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🎯 How to Give Great Feedback</h4>
          <ul>
            <li>Be honest and specific in your review</li>
            <li>Rate all four dimensions for comprehensive feedback</li>
            <li>Mention what helped and what was confusing</li>
            <li>You can update your feedback anytime</li>
          </ul>
        </div>
      </div>

      {/* Footer Section */}
      <div className="feedback-footer">
        <p>
          Questions about giving feedback? Check our <a href="/faq">FAQ page</a> for more information.
        </p>
      </div>
    </div>
  );
};

export default FeedbackPage;
