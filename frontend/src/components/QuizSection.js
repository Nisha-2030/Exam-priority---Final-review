import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzesByTopic, getQuizzesBySubject, getAllQuizzes } from '../services/quizService';
import './QuizSection.css';

const QuizSection = ({ topicId, subjectId, userAnswered = {}, onLoadingChange }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const normalizeResponseData = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    return response?.data?.data ?? response?.data ?? [];
  };

  const itemMatchesTopic = (item) =>
    item?.topic?._id === topicId || item?.topic === topicId;

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      onLoadingChange?.(true);

      let data;
      if (topicId) {
        data = normalizeResponseData(await getQuizzesByTopic(topicId));
      } else if (subjectId) {
        data = normalizeResponseData(await getQuizzesBySubject(subjectId));
      } else {
        data = normalizeResponseData(await getAllQuizzes());
      }

      setQuizzes(topicId ? data.filter(itemMatchesTopic) : data);
    } catch (err) {
      setError(err);
      console.error('Error loading quizzes:', err);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [topicId, subjectId]);

  const isQuizAnswered = (quizId) => {
    return userAnswered[quizId] === true;
  };

  if (loading) {
    return (
      <div className="quiz-section-container">
        <div className="loading-spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-section-container">
        <p className="error-message">⚠️ Failed to load quizzes</p>
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="quiz-section-container">
        <p className="empty-message">❓ No quizzes available</p>
      </div>
    );
  }

  return (
    <div className="quiz-section-container">
      <div className="quiz-section-header">
        <h3>📝 Quizzes & Assessments ({quizzes.length})</h3>
        <div className="quiz-legend">
          <span className="legend-item">
            <span className="legend-dot answered"></span> Answered
          </span>
          <span className="legend-item">
            <span className="legend-dot not-answered"></span> Not Answered
          </span>
        </div>
      </div>

      <div className="quizzes-grid">
        {quizzes.map((quiz) => {
          const answered = isQuizAnswered(quiz._id);
          return (
            <div
              key={quiz._id}
              className={`quiz-card ${answered ? 'answered' : 'not-answered'}`}
            >
              {/* Status Indicator */}
              <div className={`quiz-status-badge ${answered ? 'answered' : 'not-answered'}`}>
                {answered ? '✓ Answered' : 'Not Answered'}
              </div>

              {/* Quiz Icon */}
              <div className="quiz-icon">
                {quiz.type === 'pdf' ? '📄' : '✍️'}
              </div>

              {/* Quiz Info */}
              <h4 className="quiz-title">{quiz.title || 'Untitled Quiz'}</h4>

              {quiz.description && (
                <p className="quiz-description">{quiz.description}</p>
              )}

              {/* Quiz Details */}
              <div className="quiz-details">
                {quiz.type === 'interactive' ? (
                  <>
                    <span className="quiz-type-badge interactive-badge">
                      Interactive Quiz
                    </span>
                    <span className="quiz-questions">
                      {quiz.questions?.length || 0} Questions
                    </span>
                  </>
                ) : (
                  <span className="quiz-type-badge pdf-badge">PDF Quiz</span>
                )}
              </div>

              {/* Action Button */}
              <button
                className="take-quiz-button"
                onClick={() => {
                  if (quiz.type === 'pdf') {
                    // Open PDF in new tab
                    if (quiz.pdfUrl) window.open(quiz.pdfUrl, '_blank');
                    else navigate(`/quiz/${topicId}`);
                  } else {
                    navigate(`/quiz/${topicId}`);
                  }
                }}
              >
                {answered ? '📊 View Results' : '▶ Take Quiz'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizSection;
