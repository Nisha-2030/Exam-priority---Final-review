import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizByTopic } from '../services/quizService';
import { getMaterialsByTopic } from '../services/materialService';
import QuizComponent from '../components/QuizComponent';
import Card from '../components/Card';
import './QuizPage.css';

const QuizPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [topicId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getQuizByTopic(topicId);
      // API either returns raw quiz or wrapped object
      let quizData;
      if (res?.data) {
        // response from axios
        quizData = res.data.data || res.data;
      } else {
        // might already be quiz object
        quizData = res;
      }

      if (quizData) {
        setQuiz(quizData);
      } else {
        setError('Quiz not found for this topic.');
      }

      // also load materials references for this topic
      try {
        const mats = await getMaterialsByTopic(topicId);
        const mList = mats || [];
        setMaterials(mList);
      } catch (mErr) {
        console.warn('Failed to load materials for references', mErr);
        setMaterials([]);
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
      // if axios 404, show not found message
      if (err.response && err.response.status === 404) {
        setQuiz(null);
      } else {
        setError('Failed to load quiz. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const [submittedResult, setSubmittedResult] = useState(null);
  const handleSubmit = (result) => {
    console.log('Quiz submitted with result:', result);
    setSubmittedResult(result);
    // do not auto navigate, allow student to review
  };

  if (loading) {
    return (
      <div className="quiz-page-container">
        <div className="loading-spinner">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page-container">
        <div className="error-container">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <Card title="Error">
            <p className="error-message">{error}</p>
            <button onClick={loadQuiz} className="btn-retry">Retry</button>
          </Card>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-page-container">
        <div className="no-quiz-container">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <Card title="No Quiz Available">
            <p>No quiz is currently available for this topic.</p>
            <button onClick={() => navigate(-1)} className="btn-home">Return to Dashboard</button>
          </Card>
        </div>
      </div>
    );
  }

  // if quiz is pdf type, show link directly
  if (quiz.type === 'pdf') {
    return (
      <div className="quiz-page-container">
        <div className="quiz-page-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <h1>📄 {quiz.title}</h1>
            <p>{quiz.description}</p>
          </div>
        </div>
        <div className="quiz-page-content">
          {quiz.pdfUrl ? (
            <a
              href={quiz.pdfUrl && (quiz.pdfUrl.startsWith('http') ? quiz.pdfUrl : 'https://' + quiz.pdfUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="filter-btn"
            >
              Open PDF Quiz
            </a>
          ) : (
            <p>No PDF available.</p>
          )}
        </div>
      </div>
    );
  }

  // if quiz has been submitted we show results + references
  if (submittedResult) {
    return (
      <div className="quiz-page-container">
        <div className="quiz-page-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <h1>Quiz Results</h1>
            <p>{quiz.title}</p>
          </div>
        </div>
        <div className="quiz-page-content">
          <div className="quiz-result">
            <div className="result-summary">
              <p>
                <strong>Score: {submittedResult.score}/{submittedResult.totalQuestions}</strong>
              </p>
              <p>
                <strong>Percentage: {submittedResult.percentage}%</strong>
              </p>
            </div>
            {/* Show explanations already rendered by QuizComponent last state? */}
          </div>
          {materials && materials.length > 0 && (
            <Card title="📖 Reference Textbooks">
              <ul>
                {materials.map((m) => (
                  <li key={m._id}>{m.referenceBook || 'Nil'}</li>
                ))}
              </ul>
            </Card>
          )}
          <button className="btn-primary" onClick={() => navigate(`/materials/${topicId}`)}>
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page-container">
      <div className="quiz-page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div>
          <h1>📝 Quiz</h1>
          <p>{quiz.title}</p>
        </div>
      </div>

      <div className="quiz-page-content">
        <QuizComponent quiz={quiz} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default QuizPage;
