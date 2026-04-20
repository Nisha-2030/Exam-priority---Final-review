import React, { useState } from 'react';
import './FeedbackComponent.css';
import apiClient from '../services/api';

/**
 * FeedbackComponent
 * Allows users to rate a topic on 4 dimensions and write a review
 * Handles both new feedback creation and updates
 */
const FeedbackComponent = ({ topicId, topicName, onSubmitSuccess, initialData = null }) => {
  const [ratings, setRatings] = useState(
    initialData
      ? initialData.ratings
      : {
          contentQuality: 0,
          usefulness: 0,
          difficulty: 0,
          explanation: 0
        }
  );

  const [review, setReview] = useState(initialData ? initialData.review : '');
  const [helpful, setHelpful] = useState(initialData ? initialData.helpful : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const ratingCategories = [
    { key: 'contentQuality', label: 'Content Quality', description: 'How well-organized and clear is the content?' },
    { key: 'usefulness', label: 'Usefulness', description: 'How helpful is this content for your learning?' },
    { key: 'difficulty', label: 'Difficulty', description: 'Rate the difficulty level of this topic' },
    { key: 'explanation', label: 'Explanation Quality', description: 'How clear are the explanations?' }
  ];

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value
    }));
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value.substring(0, 1000));
  };

  const isValidSubmission = () => {
    return (
      ratings.contentQuality > 0 &&
      ratings.usefulness > 0 &&
      ratings.difficulty > 0 &&
      ratings.explanation > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidSubmission()) {
      setErrorMessage('Please provide all ratings (1-5 stars)');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      if (!topicId) {
        setErrorMessage('Topic ID is missing.');
        setSubmitStatus('error');
        return;
      }

      const response = await apiClient.post('/feedback', {
        topicId,
        ratings,
        review,
        helpful
      });

      const data = response?.data || {};
      setSubmitStatus('success');
      setErrorMessage('');
      if (onSubmitSuccess) {
        onSubmitSuccess(data.data);
      }

      // Reset form
      setTimeout(() => {
        setRatings({
          contentQuality: 0,
          usefulness: 0,
          difficulty: 0,
          explanation: 0
        });
        setReview('');
        setHelpful(null);
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message;
      setErrorMessage(serverMessage || 'Error submitting feedback. Please try again.');
      setSubmitStatus('error');
      console.error('Feedback submission error:', error?.response?.data || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ category, value, onChange }) => {
    return (
      <div className="rating-row">
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`star ${star <= value ? 'active' : ''}`}
              onClick={() => onChange(category, star)}
              type="button"
              title={`${star} star${star > 1 ? 's' : ''}`}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
          <span className="rating-value">{value > 0 ? `${value}/5` : '-'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h2>Share Your Feedback</h2>
        <p className="feedback-topic">Topic: <strong>{topicName}</strong></p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        {/* Ratings Section */}
        <div className="feedback-section ratings-section">
          <h3>Rate Your Learning Experience</h3>
          <p className="section-description">Please rate each aspect on a scale of 1-5</p>

          {ratingCategories.map(({ key, label, description }) => (
            <div key={key} className="rating-category">
              <label className="rating-label">
                <span className="category-name">{label}</span>
                <span className="category-description">{description}</span>
              </label>
              <StarRating
                category={key}
                value={ratings[key]}
                onChange={handleRatingChange}
              />
            </div>
          ))}
        </div>

        {/* Review Section */}
        <div className="feedback-section review-section">
          <h3>Written Review (Optional)</h3>
          <textarea
            className="review-input"
            value={review}
            onChange={handleReviewChange}
            placeholder="Share your thoughts, suggestions, or any specific feedback about this topic..."
            maxLength={1000}
            rows={5}
          />
          <div className="review-info">
            <span className="char-count">{review.length}/1000</span>
          </div>
        </div>

        {/* Helpful Section */}
        <div className="feedback-section helpful-section">
          <h3>Was this topic helpful?</h3>
          <div className="helpful-options">
            <button
              type="button"
              className={`helpful-btn ${helpful === 'yes' ? 'active' : ''}`}
              onClick={() => setHelpful(helpful === 'yes' ? null : 'yes')}
            >
              👍 Yes, Very Helpful
            </button>
            <button
              type="button"
              className={`helpful-btn ${helpful === 'no' ? 'active' : ''}`}
              onClick={() => setHelpful(helpful === 'no' ? null : 'no')}
            >
              👎 Not Helpful
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className="feedback-error">
            <span className="error-icon">⚠️</span>
            {errorMessage}
          </div>
        )}

        {submitStatus === 'success' && (
          <div className="feedback-success">
            <span className="success-icon">✓</span>
            Thank you! Your feedback has been submitted successfully.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="feedback-submit"
          disabled={isSubmitting || !isValidSubmission()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

        <p className="feedback-note">
          💡 Your feedback helps us improve the content quality. You can update your feedback anytime.
        </p>
      </form>
    </div>
  );
};

export default FeedbackComponent;
