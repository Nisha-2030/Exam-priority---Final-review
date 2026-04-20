import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMaterialsByTopic } from '../services/materialService';
import { getTopicById } from '../services/examService';
import { getVideosByTopic } from '../services/videoService';
import { getQuizzesByTopic } from '../services/quizService';
import Card from '../components/Card';
import MaterialPreview from '../components/MaterialPreview';
import './MaterialDetails.css';

const MaterialDetails = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const normalizeResponseData = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    return response?.data?.data ?? response?.data ?? [];
  };

  const itemMatchesTopic = (item) =>
    item?.topic?._id === topicId || item?.topic === topicId;

  useEffect(() => {
    loadData();
  }, [topicId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get topic details
      const topicResp = await getTopicById(topicId);
      const topicData = topicResp?.data?.data ?? topicResp?.data ?? topicResp;
      setTopic(topicData);

      // Get materials for this topic
      const materialsData = normalizeResponseData(await getMaterialsByTopic(topicId));
      console.log('materialsData', materialsData);
      setMaterials(materialsData.filter(itemMatchesTopic));

      // Get videos and quizzes for this topic
      try {
        const videosData = normalizeResponseData(await getVideosByTopic(topicId));
        console.log('videosData', videosData);
        setVideos(videosData.filter(itemMatchesTopic));
      } catch (vErr) {
        console.warn('No videos for this topic', vErr.response || vErr.message);
        setVideos([]);
      }

      try {
        const quizzesData = normalizeResponseData(await getQuizzesByTopic(topicId));
        console.log('quizzesData', quizzesData);
        setQuizzes(quizzesData.filter(itemMatchesTopic));
      } catch (qErr) {
        console.warn('No quizzes for this topic', qErr.response || qErr.message);
        setQuizzes([]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load materials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  const filteredMaterials = categoryFilter === 'all' 
    ? materials 
    : materials.filter(m => m.category === categoryFilter);

  if (loading) {
    return (
      <div className="material-details-container">
        <div className="loading-spinner">Loading materials...</div>
      </div>
    );
  }

  return (
    <div className="material-details-container">
      <div className="details-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div>
          <h1>📚 {topic?.name || 'Materials'}</h1>
          <p>{topic?.subject?.name || 'Study Materials'}</p>
        </div>
      </div>

      {error && (
        <Card title="Error">
          <p className="error-message">{error}</p>
          <button onClick={loadData} className="btn-retry">Retry</button>
        </Card>
      )}

      {/* Videos Section */}
      {videos && videos.length > 0 && (
        <Card title="🎬 Videos">
          <div className="videos-list">
            {videos.map((v) => (
              <div key={v._id} className="video-item">
                <strong>{v.title}</strong>
                <p className="muted">{v.description}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="filter-btn" onClick={() => window.open(v.videoUrl, '_blank')}>
                    ▶ Watch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quizzes Section */}
      {quizzes && quizzes.length > 0 && (
        <Card title="📝 Quizzes & Assessments">
          <div className="quizzes-list">
            {quizzes.map((q) => (
              <div key={q._id} className="quiz-item">
                <strong>{q.title}</strong>
                <p className="muted">{q.description}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  {q.type === 'pdf' && q.pdfUrl ? (
                    <a
                      href={q.pdfUrl && (q.pdfUrl.startsWith('http') ? q.pdfUrl : 'https://' + q.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="filter-btn"
                    >
                      📄 Open PDF
                    </a>
                  ) : (
                    <button className="filter-btn" onClick={() => navigate(`/quiz/${topicId}`)}>
                      ▶ Start Quiz
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {materials.length > 0 && (
        <div className="category-filter">
          <button
            className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('all')}
          >
            All ({materials.length})
          </button>
          <button
            className={`filter-btn ${categoryFilter === 'theory' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('theory')}
          >
            Theory ({materials.filter(m => m.category === 'theory').length})
          </button>
          <button
            className={`filter-btn ${categoryFilter === 'formula' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('formula')}
          >
            Formulas ({materials.filter(m => m.category === 'formula').length})
          </button>
          <button
            className={`filter-btn ${categoryFilter === 'definition' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('definition')}
          >
            Definitions ({materials.filter(m => m.category === 'definition').length})
          </button>
          <button
            className={`filter-btn ${categoryFilter === 'example' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('example')}
          >
            Examples ({materials.filter(m => m.category === 'example').length})
          </button>
          <button
            className={`filter-btn ${categoryFilter === 'note' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('note')}
          >
            Notes ({materials.filter(m => m.category === 'note').length})
          </button>
        </div>
      )}

      <div className="materials-list">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <MaterialPreview key={material._id} material={material} />
          ))
        ) : (
          <Card title="No Materials">
            <p className="empty-message">No materials available with selected filter.</p>
          </Card>
        )}
      </div>

      {/* Feedback Section */}
      {topic && (
        <Card title="💬 Feedback & Reviews">
          <div className="feedback-cta-section">
            <div className="feedback-cta-content">
              <h3>Share Your Feedback</h3>
              <p>Help improve this topic by sharing your thoughts, ratings, and suggestions. View analytics and see what other students think!</p>
              <button 
                className="btn-feedback"
                onClick={() => navigate(`/feedback/${topicId}`)}
              >
                <span className="btn-icon">💬</span>
                Go to Feedback Page
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MaterialDetails;
