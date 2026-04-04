import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManageContent.css';
import Card from '../components/Card';
import { getTopicById } from '../services/examService';
import { createMaterial, deleteMaterial, getMaterialsByTopic } from '../services/materialService';
import { createVideo, deleteVideo, getVideosByTopic } from '../services/videoService';
import { createQuiz, deleteQuiz, getQuizzesByTopic } from '../services/quizService';

const ManageContent = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('material');

  // Material form
  const [materialForm, setMaterialForm] = useState({
    title: '',
    content: '',
    referenceBook: '',
    category: 'theory'
  });

  // Video form
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    instructor: 'Expert Instructor'
  });

  // Quiz form
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    type: 'interactive',
    pdfUrl: '',
    questions: []
  });

  const [materials, setMaterials] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const loadContent = useCallback(async () => {
    try {
      const topicRes = await getTopicById(topicId);
      setTopic(topicRes.data);

      const materialsRes = await getMaterialsByTopic(topicId);
      setMaterials(Array.isArray(materialsRes) ? materialsRes : []);

      const videosRes = await getVideosByTopic(topicId);
      setVideos(Array.isArray(videosRes) ? videosRes : []);

      const quizzesRes = await getQuizzesByTopic(topicId);
      setQuizzes(Array.isArray(quizzesRes) ? quizzesRes : []);

      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    loadContent();
  }, [loadContent, topicId]);

  // ============ MATERIAL HANDLERS ============
  const handleAddMaterial = async () => {
    // referenceBook is optional; user can enter "nil" or leave blank
    if (!materialForm.title || !materialForm.content) {
      alert('Please fill in title and content (reference is optional)');
      return;
    }

    // Extract subject ID from topic
    const subjectId = topic?.subject?._id || topic?.subject;
    if (!subjectId) {
      alert('Error: Subject information not found. Please refresh and try again.');
      return;
    }

    try {
      await createMaterial({
        ...materialForm,
        topic: topicId,
        subject: subjectId
      });
      setMaterialForm({ title: '', content: '', referenceBook: '', category: 'theory' });
      await loadContent();
      alert('Material added successfully!');
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Error: ' + (error.message || 'Failed to add material'));
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Delete this material?')) {
      try {
        await deleteMaterial(materialId);
        await loadContent();
        alert('Material deleted successfully!');
      } catch (error) {
        alert('Error deleting material: ' + error.message);
      }
    }
  };

  // ============ VIDEO HANDLERS ============
  const handleAddVideo = async () => {
    if (!videoForm.title || !videoForm.description || !videoForm.videoUrl) {
      alert('Please fill in title, description, and video URL');
      return;
    }
    
    if (!videoForm.videoUrl.includes('youtube') && !videoForm.videoUrl.includes('youtu.be')) {
      alert('Please use a YouTube URL');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!storedUser || storedUser.role !== 'admin') {
      alert('Only admins can add videos. Please log in as admin.');
      return;
    }

    // Extract subject ID from topic
    const subjectId = topic?.subject?._id || topic?.subject;
    if (!subjectId) {
      alert('Error: Subject information not found. Please refresh and try again.');
      return;
    }

    try {
      await createVideo({
        ...videoForm,
        topic: topicId,
        subject: subjectId
      });
      setVideoForm({
        title: '',
        description: '',
        videoUrl: '',
        duration: 0,
        instructor: 'Expert Instructor'
      });
      await loadContent();
      alert('Video added successfully!');
    } catch (error) {
      console.error('Error adding video:', error);
      const message =
        typeof error === 'string' ? error : error?.message || 'Failed to add video';
      alert('Error: ' + message);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Delete this video?')) {
      try {
        await deleteVideo(videoId);
        await loadContent();
        alert('Video deleted successfully!');
      } catch (error) {
        alert('Error deleting video: ' + error.message);
      }
    }
  };

  // ============ QUIZ HANDLERS ============
  const handleAddQuiz = async () => {
    if (!quizForm.title || !quizForm.description) {
      alert('Please fill in quiz title and description');
      return;
    }

    if (quizForm.type === 'pdf' && !quizForm.pdfUrl) {
      alert('Please provide PDF URL for PDF quiz');
      return;
    }

    if (quizForm.type === 'interactive' && (!quizForm.questions || quizForm.questions.length === 0)) {
      alert('For interactive quiz, please add at least one question');
      return;
    }

    // Extract subject ID from topic
    const subjectId = topic?.subject?._id || topic?.subject;
    if (!subjectId) {
      alert('Error: Subject information not found. Please refresh and try again.');
      return;
    }

    try {
      const quizData = {
        title: quizForm.title,
        description: quizForm.description,
        type: quizForm.type,
        topic: topicId,
        subject: subjectId
      };

      // Only add type-specific data if needed
      if (quizForm.type === 'pdf') {
        quizData.pdfUrl = quizForm.pdfUrl;
      } else {
        quizData.questions = quizForm.questions;
      }

      await createQuiz(quizData);
      setQuizForm({
        title: '',
        description: '',
        type: 'interactive',
        pdfUrl: '',
        questions: []
      });
      await loadContent();
      alert('Quiz created successfully!');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error: ' + (error.message || 'Failed to create quiz'));
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        await loadContent();
        alert('Quiz deleted successfully!');
      } catch (error) {
        alert('Error deleting quiz: ' + error.message);
      }
    }
  };

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...quizForm.questions];
    updated[index][field] = value;
    setQuizForm({ ...quizForm, questions: updated });
  };

  const removeQuestion = (index) => {
    setQuizForm({
      ...quizForm,
      questions: quizForm.questions.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="manage-loading">Loading...</div>;
  }

  return (
    <div className="manage-content-container">
      <div className="manage-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>✏️ Manage Content</h1>
        <p>Topic: <strong>{topic?.name}</strong></p>
      </div>

      <div className="content-tabs">
        <button 
          className={`tab-btn ${activeTab === 'material' ? 'active' : ''}`}
          onClick={() => setActiveTab('material')}
        >
          📚 Materials ({materials.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          🎥 Videos ({videos.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          ❓ Quizzes ({quizzes.length})
        </button>
      </div>

      <div className="manage-content-body">
        <div className="manage-content-stage">
        {/* ============ MATERIALS TAB ============ */}
        {activeTab === 'material' && (
          <div className="tab-content split-tab-layout aligned-layout">
            <Card title="➕ Add New Material">
              <div className="form-group">
                <label>Material Title</label>
                <input
                  type="text"
                  placeholder="e.g., Introduction to Algebra"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  placeholder="Enter the material content..."
                  value={materialForm.content}
                  onChange={(e) => setMaterialForm({ ...materialForm, content: e.target.value })}
                  rows="6"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Reference Book/Page (optional, 'nil' if none)</label>
                <input
                  type="text"
                  placeholder="e.g., NCERT Class 9, Chapter 2, Page 45 or leave blank"
                  value={materialForm.referenceBook}
                  onChange={(e) => setMaterialForm({ ...materialForm, referenceBook: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={materialForm.category}
                  onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
                >
                  <option value="theory">Theory</option>
                  <option value="formula">Formula</option>
                  <option value="definition">Definition</option>
                  <option value="example">Example</option>
                  <option value="note">Note</option>
                </select>
              </div>
              <button className="btn-primary btn-full" onClick={handleAddMaterial}>
                ➕ Add Material
              </button>
            </Card>

            <Card title="📚 Materials List">
              {materials.length > 0 ? (
                <div className="items-list">
                  {materials.map((material) => (
                    <div
                      key={material._id}
                      className="item-card"
                      onClick={() =>
                        navigate(`/admin/material/${material._id}`, {
                          state: { topicId }
                        })
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="item-header">
                        <h4>{material.title}</h4>
                        <span className="category-badge" style={{
                          backgroundColor: {
                            theory: 'var(--accent)',
                            formula: 'var(--accent-dark)',
                            definition: '#f39c12',
                            example: '#27ae60',
                            note: '#e74c3c'
                          }[material.category]
                        }}>
                          {material.category}
                        </span>
                      </div>
                      <p className="item-content">{material.content.substring(0, 150)}...</p>
                      <p className="item-ref">📖 {material.referenceBook || 'Nil'}</p>
                      <button 
                        className="btn-delete"
                        onClick={(e) => { e.stopPropagation(); handleDeleteMaterial(material._id); }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No materials yet. Add one above!</p>
              )}
            </Card>
          </div>
        )}

        {/* ============ VIDEOS TAB ============ */}
        {activeTab === 'videos' && (
          <div className="tab-content split-tab-layout aligned-layout">
            <Card title="➕ Add New Video">
              <div className="form-group">
                <label>Video Title</label>
                <input
                  type="text"
                  placeholder="e.g., Algebra Basics - Introduction"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Brief description of the video..."
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  rows="4"
                ></textarea>
              </div>
              <div className="form-group">
                <label>YouTube URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={videoForm.duration}
                  onChange={(e) => setVideoForm({ ...videoForm, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Instructor Name</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. John Doe"
                  value={videoForm.instructor}
                  onChange={(e) => setVideoForm({ ...videoForm, instructor: e.target.value })}
                />
              </div>
              <button className="btn-primary btn-full" onClick={handleAddVideo}>
                ➕ Add Video
              </button>
            </Card>

            <Card title="🎥 Videos List">
              {videos.length > 0 ? (
                <div className="items-list">
                  {videos.map((video) => (
                    <div key={video._id} className="item-card">
                      <div className="item-header">
                        <h4>{video.title}</h4>
                        <span className="duration-badge">⏱️ {video.duration} min</span>
                      </div>
                      <p className="item-content">{video.description}</p>
                      <p className="item-ref">👨‍🏫 {video.instructor}</p>
                      <div className="item-actions">
                        <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-view">
                          👁️ View Video
                        </a>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteVideo(video._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No videos yet. Add one above!</p>
              )}
            </Card>
          </div>
        )}

        {/* ============ QUIZZES TAB ============ */}
        {activeTab === 'quizzes' && (
          <div className="quiz-tab-modern-layout aligned-layout">
            <div className="quiz-form-modern">
              <Card title={<span><span style={{color:'#8f5be8',fontWeight:700,fontSize:'1.3rem'}}>➕</span> <span style={{fontWeight:700}}>Create New Quiz</span></span>}>
                <div className="form-group">
                  <label>Quiz Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Algebra Quiz - Topic 1"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Brief description of the quiz..."
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Quiz Type</label>
                  <select 
                    value={quizForm.type}
                    onChange={(e) => setQuizForm({ ...quizForm, type: e.target.value })}
                  >
                    <option value="interactive">Interactive (Questions)</option>
                    <option value="pdf">PDF Upload</option>
                  </select>
                </div>
                {quizForm.type === 'pdf' ? (
                  <div className="form-group">
                    <label>PDF URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/quiz.pdf"
                      value={quizForm.pdfUrl}
                      onChange={(e) => setQuizForm({ ...quizForm, pdfUrl: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <div className="questions-section">
                      <h3>Questions</h3>
                      {quizForm.questions.length > 0 && (
                        <div className="questions-list">
                          {quizForm.questions.map((q, idx) => (
                            <div key={idx} className="question-item-modern">
                              <h4>Question {idx + 1}</h4>
                              <input
                                type="text"
                                placeholder="Question text"
                                value={q.text}
                                onChange={(e) => updateQuestion(idx, 'text', e.target.value)}
                              />
                              <div className="options">
                                {q.options.map((opt, optIdx) => (
                                  <input
                                    key={optIdx}
                                    type="text"
                                    placeholder={`Option ${optIdx + 1}`}
                                    value={opt}
                                    onChange={(e) => {
                                      const updated = [...quizForm.questions];
                                      updated[idx].options[optIdx] = e.target.value;
                                      setQuizForm({ ...quizForm, questions: updated });
                                    }}
                                  />
                                ))}
                              </div>
                              <select 
                                value={q.correctAnswer}
                                onChange={(e) => updateQuestion(idx, 'correctAnswer', parseInt(e.target.value))}
                              >
                                <option value="0">Correct: Option 1</option>
                                <option value="1">Correct: Option 2</option>
                                <option value="2">Correct: Option 3</option>
                                <option value="3">Correct: Option 4</option>
                              </select>
                              <textarea
                                placeholder="Explanation (optional)"
                                value={q.explanation || ''}
                                onChange={(e) => updateQuestion(idx, 'explanation', e.target.value)}
                                rows="2"
                                style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px solid #ddd'}}
                              />
                              <button 
                                className="btn-delete"
                                onClick={() => removeQuestion(idx)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <button 
                        className="btn-secondary"
                        onClick={addQuestion}
                      >
                        ➕ Add Question
                      </button>
                    </div>
                  </>
                )}
                <button className="btn-primary btn-full" onClick={handleAddQuiz}>
                  ➕ Create Quiz
                </button>
              </Card>
            </div>
            <div className="quiz-list-modern">
              <Card title={<span><span style={{color:'#e74c3c',fontWeight:700,fontSize:'1.3rem'}}>❓</span> <span style={{fontWeight:700}}>Quizzes List</span></span>}>
                {quizzes.length > 0 ? (
                  <div className="quiz-modern-list">
                    {quizzes.map((quiz) => (
                      <div key={quiz._id} className="quiz-modern-card">
                        <div className="quiz-modern-header">
                          <span className="quiz-modern-title">{quiz.title}</span>
                          <span className={`quiz-type-badge ${quiz.type}`}>{quiz.type === 'pdf' ? '📄 PDF' : '❓ Interactive'}</span>
                        </div>
                        <div className="quiz-modern-desc">{quiz.description}</div>
                        {quiz.type === 'interactive' && (
                          <div className="quiz-modern-meta">❓ {quiz.questions?.length || 0} questions</div>
                        )}
                        <button 
                          className="btn-modern-delete"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                        >
                          <span role="img" aria-label="delete">🗑️</span> Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No quizzes yet. Create one above!</p>
                )}
              </Card>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ManageContent;
