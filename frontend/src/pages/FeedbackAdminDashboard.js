import React, { useState, useEffect } from 'react';
import './FeedbackAdminDashboard.css';
import apiClient from '../services/api';

/**
 * FeedbackAdminDashboard
 * Admin-only dashboard for viewing aggregated feedback analytics across all topics
 * Displays overall performance metrics similar to student feedback view
 */
const FeedbackAdminDashboard = () => {
  const [topicsData, setTopicsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTopicsAnalytics();
  }, [sortBy]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchTopicsAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiClient.get(
        `/feedback/analytics/all-topics?sort=${sortBy}`
      );

      const data = response?.data;
      console.log('Topics Analytics Data:', data.data);
      setTopicsData(data.data || []);
    } catch (err) {
      const serverMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message;
      setError(serverMessage || 'Failed to load topic analytics');
      console.error('Analytics fetch error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregated statistics from topics data
  const aggregatedStats = (() => {
    if (topicsData.length === 0) {
      return {
        totalFeedbacks: 0,
        overallRating: 0,
        avgContentQuality: 0,
        avgUsefulness: 0,
        avgDifficulty: 0,
        avgExplanation: 0,
        helpfulYes: 0,
        helpfulNo: 0,
        totalQuizScore: 0,
        totalAttempts: 0,
        avgQuizScore: 0,
        avgContentScore: 0
      };
    }

    // Calculate totals across all topics
    let totalFeedbacks = 0;
    let totalRating = 0;
    let totalContentQuality = 0;
    let totalUsefulness = 0;
    let totalDifficulty = 0;
    let totalExplanation = 0;
    let totalContentScore = 0;
    let totalQuizScore = 0;
    let totalAttempts = 0;
    let totalHelpfulYes = 0;
    let totalHelpfulNo = 0;

    const topicsWithFeedback = topicsData.filter(t => t.feedbackCount > 0);
    const topicsWithAnyData = topicsData.filter(
      (t) => t.feedbackCount > 0 || t.quizAttempts > 0
    );

    topicsWithAnyData.forEach((topic) => {
      totalQuizScore += (topic.avgQuizScore || 0) * (topic.quizAttempts || 0);
      totalAttempts += (topic.quizAttempts || 0);
      totalHelpfulYes += (topic.helpfulYes || 0);
      totalHelpfulNo += (topic.helpfulNo || 0);
    });

    topicsWithFeedback.forEach((topic) => {
      const feedCount = topic.feedbackCount || 1;

      totalFeedbacks += feedCount;
      totalRating += ((topic.avgRating || 0) * feedCount);
      totalContentQuality += ((topic.contentQuality || topic.avgRating || 0) * feedCount);
      totalUsefulness += ((topic.usefulness || topic.avgRating || 0) * feedCount);
      totalDifficulty += ((topic.difficulty || topic.avgRating || 0) * feedCount);
      totalExplanation += ((topic.explanation || topic.avgRating || 0) * feedCount);
      totalContentScore += ((topic.contentScore || 0) * feedCount);
    });

    if (topicsWithAnyData.length === 0) {
      return {
        totalFeedbacks: 0,
        overallRating: 0,
        avgContentQuality: 0,
        avgUsefulness: 0,
        avgDifficulty: 0,
        avgExplanation: 0,
        helpfulYes: 0,
        helpfulNo: 0,
        totalQuizScore: 0,
        totalAttempts: 0,
        avgQuizScore: 0,
        avgContentScore: 0
      };
    }

    const overallRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0;
    const avgContentQuality = totalFeedbacks > 0 ? totalContentQuality / totalFeedbacks : 0;
    const avgUsefulness = totalFeedbacks > 0 ? totalUsefulness / totalFeedbacks : 0;
    const avgDifficulty = totalFeedbacks > 0 ? totalDifficulty / totalFeedbacks : 0;
    const avgExplanation = totalFeedbacks > 0 ? totalExplanation / totalFeedbacks : 0;
    const avgQuizScore = totalAttempts > 0 ? totalQuizScore / totalAttempts : 0;
    const avgContentScore = totalFeedbacks > 0 ? totalContentScore / totalFeedbacks : 0;

    console.log('Aggregated Stats:', {
      totalFeedbacks,
      overallRating,
      avgContentQuality,
      avgUsefulness,
      avgDifficulty,
      avgExplanation,
      avgContentScore
    });

    return {
      totalFeedbacks,
      overallRating,
      avgContentQuality,
      avgUsefulness,
      avgDifficulty,
      avgExplanation,
      helpfulYes: totalHelpfulYes,
      helpfulNo: totalHelpfulNo,
      totalQuizScore,
      totalAttempts,
      avgQuizScore,
      avgContentScore
    };
  })();

  const filteredData = topicsData
    .filter((topic) => {
      if (filterStatus !== 'all') {
        return topic.status === filterStatus;
      }
      return true;
    })
    .filter((topic) => {
      if (searchQuery) {
        return topic.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter((topic) => topic.feedbackCount > 0 || topic.quizAttempts > 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Highly Effective':
        return 'status-excellent';
      case 'Moderate':
        return 'status-good';
      case 'Needs Improvement':
        return 'status-poor';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Highly Effective':
        return '✨';
      case 'Moderate':
        return '⚠️';
      case 'Needs Improvement':
        return '⛔';
      default:
        return '•';
    }
  };

  const getScoreStatus = (score) => {
    if (score > 4) return { text: 'Highly Effective', color: 'status-excellent' };
    if (score >= 3) return { text: 'Moderate', color: 'status-good' };
    return { text: 'Needs Improvement', color: 'status-poor' };
  };

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

  const stats = {
    totalTopics: filteredData.length,
    highlyEffective: filteredData.filter((t) => t.status === 'Highly Effective').length,
    moderate: filteredData.filter((t) => t.status === 'Moderate').length,
    needsImprovement: filteredData.filter((t) => t.status === 'Needs Improvement').length,
    avgContentScore:
      filteredData.length > 0
        ? (
            filteredData.reduce((sum, t) => sum + t.contentScore, 0) /
            filteredData.length
          ).toFixed(2)
        : 0
  };

  const scoreStatus = getScoreStatus(aggregatedStats.avgContentScore);

  if (loading) {
    return <div className="dashboard-loading">Loading feedback analytics...</div>;
  }

  return (
    <div className="admin-dashboard feedback-admin-view">
      <div className="dashboard-header">
        <h1>📊 Feedback Analytics</h1>
        <p>Platform-wide feedback analytics and insights</p>
      </div>

      {error && (
        <div className="dashboard-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Aggregated Summary Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-label">Total Feedbacks</div>
            <div className="stat-value">{aggregatedStats.totalFeedbacks}</div>
            <div className="stat-subtitle">User reviews</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-label">Overall Rating</div>
            <div className="stat-value">{aggregatedStats.overallRating.toFixed(1)}</div>
            <div className="stat-subtitle">out of 5.0</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Content Score</div>
            <div className={`stat-value ${scoreStatus.color}`}>
              {aggregatedStats.avgContentScore.toFixed(2)}
            </div>
            <div className="stat-subtitle">{scoreStatus.text}</div>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="analytics-section ratings-breakdown">
        <h3>Rating Breakdown</h3>
        <div className="ratings-grid">
          <RatingDisplay
            label="Content Quality"
            value={aggregatedStats.avgContentQuality}
          />
          <RatingDisplay
            label="Usefulness"
            value={aggregatedStats.avgUsefulness}
          />
          <RatingDisplay
            label="Difficulty Level"
            value={aggregatedStats.avgDifficulty}
          />
          <RatingDisplay
            label="Explanation Quality"
            value={aggregatedStats.avgExplanation}
          />
        </div>
      </div>

      {/* Helpfulness Stats */}
      <div className="analytics-section helpful-stats">
        <h3>Helpfulness</h3>
        <div className="helpful-chart">
          <div className="helpful-stat">
            <div className="stat-label">
              <span className="stat-icon">👍</span> Helpful
            </div>
            <div className="stat-bar">
              <div className="stat-fill helpful">
                {aggregatedStats.helpfulYes > 0 && (
                  <span className="stat-percentage">
                    {Math.round(
                      (aggregatedStats.helpfulYes /
                        (aggregatedStats.helpfulYes + aggregatedStats.helpfulNo)) *
                        100
                    )}%
                  </span>
                )}
              </div>
            </div>
            <div className="stat-count">{aggregatedStats.helpfulYes} users</div>
          </div>

          <div className="helpful-stat">
            <div className="stat-label">
              <span className="stat-icon">👎</span> Not Helpful
            </div>
            <div className="stat-bar">
              <div className="stat-fill not-helpful">
                {aggregatedStats.helpfulNo > 0 && (
                  <span className="stat-percentage">
                    {Math.round(
                      (aggregatedStats.helpfulNo /
                        (aggregatedStats.helpfulYes + aggregatedStats.helpfulNo)) *
                        100
                    )}%
                  </span>
                )}
              </div>
            </div>
            <div className="stat-count">{aggregatedStats.helpfulNo} users</div>
          </div>
        </div>
      </div>

      {/* Quiz Performance */}
      <div className="analytics-section quiz-stats">
        <h3>Quiz Performance</h3>
        <div className="quiz-info">
          <div className="quiz-stat">
            <span className="stat-title">Avg Quiz Score</span>
            <span className="stat-value">
              {aggregatedStats.avgQuizScore.toFixed(1)}/20
            </span>
          </div>
          <div className="quiz-stat">
            <span className="stat-title">Total Attempts</span>
            <span className="stat-value">{aggregatedStats.totalAttempts}</span>
          </div>
        </div>
      </div>

      {/* Topics Table */}
      <div className="analytics-section topics-section">
        <div className="section-header">
          <h3>Topics Performance</h3>
          <div className="section-controls">
            <input
              type="text"
              placeholder="Search topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="Highly Effective">Highly Effective</option>
              <option value="Moderate">Moderate</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="desc">Highest First</option>
              <option value="asc">Lowest First</option>
            </select>
          </div>
        </div>

        <div className="topics-table-container">
          <table className="topics-table">
            <thead>
              <tr>
                <th>Topic Name</th>
                <th>Avg Rating</th>
                <th>Avg Quiz Score</th>
                <th>Attempts</th>
                <th>Content Score</th>
                <th>Feedbacks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((topic) => (
                  <tr key={topic._id} className={`row-${getStatusColor(topic.status)}`}>
                    <td className="topic-name">{topic.name}</td>
                    <td className="rating-cell">
                      <div className="rating-pill">
                        <span className="rating-value">{topic.avgRating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="score-cell">
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{
                            width: `${(topic.avgQuizScore / 20) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="score-text">{topic.avgQuizScore.toFixed(1)}/20</span>
                    </td>
                    <td className="attempts-cell">
                      <span className="attempts-badge">{topic.quizAttempts}</span>
                    </td>
                    <td className="content-score-cell">
                      <div className={`score-badge ${getStatusColor(topic.status)}`}>
                        {topic.contentScore.toFixed(2)}
                      </div>
                    </td>
                    <td className="feedback-cell">
                      {topic.feedbackCount > 0 ? (
                        <span className="feedback-badge">{topic.feedbackCount}</span>
                      ) : (
                        <span className="feedback-badge empty">0</span>
                      )}
                    </td>
                    <td className="status-cell">
                      <div className={`status-badge ${getStatusColor(topic.status)}`}>
                        <span className="status-icon">{getStatusIcon(topic.status)}</span>
                        <span className="status-text">{topic.status}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-data">
                  <td colSpan="7">No topics with feedback data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAdminDashboard;
