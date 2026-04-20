import React, { useState, useEffect } from 'react';
import './FeedbackAnalyticsComponent.css';
import apiClient from '../services/api';

/**
 * FeedbackAnalyticsComponent
 * Displays analytics for feedback on a specific topic
 * Shows average ratings, content score, and review list
 */
const FeedbackAnalyticsComponent = ({ topicId, topicName }) => {
  const [analytics, setAnalytics] = useState(null);
  const [helpfulData, setHelpfulData] = useState(null);
  const [contentScore, setContentScore] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');

        const results = await Promise.allSettled([
          apiClient.get(`/feedback/analytics/topic/${topicId}`),
          apiClient.get(`/feedback/analytics/helpful/${topicId}`),
          apiClient.get(`/feedback/analytics/content-score/${topicId}`),
          apiClient.get(`/feedback/topic/${topicId}?page=${currentPage}&limit=5`)
        ]);

        const [analyticsRes, helpfulRes, scoreRes, feedbackRes] = results;
        let successCount = 0;

        if (analyticsRes.status === 'fulfilled') {
          const data = analyticsRes.value?.data;
          if (data?.data && data.data.totalFeedbacks > 0) {
            setAnalytics(data.data);
          } else {
            setAnalytics(null);
          }
          successCount += 1;
        } else {
          setAnalytics(null);
        }

        if (helpfulRes.status === 'fulfilled') {
          setHelpfulData(helpfulRes.value?.data?.data || null);
          successCount += 1;
        } else {
          setHelpfulData(null);
        }

        if (scoreRes.status === 'fulfilled') {
          setContentScore(scoreRes.value?.data?.data || null);
          successCount += 1;
        } else {
          setContentScore(null);
        }

        if (feedbackRes.status === 'fulfilled') {
          const data = feedbackRes.value?.data;
          setFeedbacks(data?.data || []);
          setTotalPages(data?.pages || 1);
          successCount += 1;
        } else {
          setFeedbacks([]);
          setTotalPages(1);
        }

        if (successCount === 0) {
          setError('Failed to load analytics');
        }
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [topicId, currentPage]);

  const RatingDisplay = ({ label, value, max = 5 }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="rating-display">
        <div className="rating-label">{label}</div>
        <div className="rating-bar">
          <div className="rating-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="rating-text">
          <span className="rating-score">{value.toFixed(2)}</span>
          <span className="rating-max">/ {max}</span>
        </div>
      </div>
    );
  };

  const getScoreStatus = (score) => {
    if (score > 4) return { text: 'Highly Effective', color: 'status-excellent' };
    if (score >= 3) return { text: 'Moderate', color: 'status-good' };
    return { text: 'Needs Improvement', color: 'status-poor' };
  };

  if (loading) {
    return <div className="analytics-loading">Loading feedback analytics...</div>;
  }

  const scoreStatus = contentScore ? getScoreStatus(contentScore.contentScore) : null;
  const hasFeedback = feedbacks && feedbacks.length > 0;
  const hasAnalytics = analytics && analytics.totalFeedbacks > 0;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Feedback & Analytics</h2>
        <p className="analytics-topic">
          Topic: <strong>{topicName}</strong>
        </p>
      </div>

      {error && (
        <div className="analytics-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Show feedback message when no feedback exists */}
      {!hasFeedback && !hasAnalytics && !error && (
        <div className="no-feedback">
          <p>📝 No feedback yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Summary Cards */}
      {hasAnalytics && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-title">Total Feedbacks</div>
            <div className="card-value">{analytics.totalFeedbacks}</div>
            <div className="card-subtitle">User reviews</div>
          </div>

          <div className="summary-card">
            <div className="card-title">Overall Rating</div>
            <div className="card-value">{analytics.overallRating.toFixed(1)}</div>
            <div className="card-subtitle">out of 5.0</div>
          </div>

          {contentScore && (
            <div className="summary-card">
              <div className="card-title">Content Score</div>
              <div className={`card-value ${scoreStatus.color}`}>
                {contentScore.contentScore.toFixed(2)}
              </div>
              <div className="card-subtitle">{scoreStatus.text}</div>
            </div>
          )}
        </div>
      )}

      {/* Rating Breakdown */}
      {analytics && (
        <div className="analytics-section ratings-breakdown">
          <h3>Rating Breakdown</h3>
          <div className="ratings-grid">
            <RatingDisplay
              label="Content Quality"
              value={analytics.avgContentQuality}
            />
            <RatingDisplay
              label="Usefulness"
              value={analytics.avgUsefulness}
            />
            <RatingDisplay
              label="Difficulty Level"
              value={analytics.avgDifficulty}
            />
            <RatingDisplay
              label="Explanation Quality"
              value={analytics.avgExplanation}
            />
          </div>
        </div>
      )}

      {/* Helpful vs Not Helpful */}
      {helpfulData && (
        <div className="analytics-section helpful-stats">
          <h3>Helpfulness</h3>
          <div className="helpful-chart">
            <div className="helpful-stat">
              <div className="stat-label">
                <span className="stat-icon">👍</span> Helpful
              </div>
              <div className="stat-bar">
                <div className="stat-fill helpful">
                  {helpfulData.yes > 0 && (
                    <span className="stat-percentage">
                      {Math.round((helpfulData.yes / (helpfulData.yes + helpfulData.no)) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="stat-count">{helpfulData.yes} users</div>
            </div>

            <div className="helpful-stat">
              <div className="stat-label">
                <span className="stat-icon">👎</span> Not Helpful
              </div>
              <div className="stat-bar">
                <div className="stat-fill not-helpful">
                  {helpfulData.no > 0 && (
                    <span className="stat-percentage">
                      {Math.round((helpfulData.no / (helpfulData.yes + helpfulData.no)) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="stat-count">{helpfulData.no} users</div>
            </div>

            {helpfulData.notVoted > 0 && (
              <div className="helpful-stat">
                <div className="stat-label">
                  <span className="stat-icon">❓</span> Not Voted
                </div>
                <div className="stat-count">{helpfulData.notVoted} users</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz Performance */}
      {contentScore && (
        <div className="analytics-section quiz-stats">
          <h3>Quiz Performance</h3>
          <div className="quiz-info">
            <div className="quiz-stat">
              <span className="stat-title">Avg Quiz Score</span>
              <span className="stat-value">
                {contentScore.avgQuizScore.toFixed(1)}/20
              </span>
            </div>
            <div className="quiz-stat">
              <span className="stat-title">Total Attempts</span>
              <span className="stat-value">{contentScore.totalQuizAttempts}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {feedbacks.length > 0 && (
        <div className="analytics-section reviews-section">
          <h3>Recent Feedback ({feedbacks.length})</h3>
          <div className="reviews-list">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    {feedback.userId?.name || 'Anonymous'}
                  </div>
                  <div className="review-ratings">
                    <span className="mini-rating">
                      ⭐ {(
                        (feedback.ratings.contentQuality +
                          feedback.ratings.usefulness +
                          feedback.ratings.difficulty +
                          feedback.ratings.explanation) /
                        4
                      ).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="review-ratings-breakdown">
                  <span title="Content Quality">CQ: {feedback.ratings.contentQuality}</span>
                  <span title="Usefulness">U: {feedback.ratings.usefulness}</span>
                  <span title="Difficulty">D: {feedback.ratings.difficulty}</span>
                  <span title="Explanation">EX: {feedback.ratings.explanation}</span>
                </div>

                {feedback.review && (
                  <div className="review-text">{feedback.review}</div>
                )}

                <div className="review-footer">
                  {feedback.helpful && (
                    <span className={`helpful-badge ${feedback.helpful}`}>
                      {feedback.helpful === 'yes' ? '👍 Helpful' : '👎 Not Helpful'}
                    </span>
                  )}
                  <span className="review-date">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackAnalyticsComponent;
