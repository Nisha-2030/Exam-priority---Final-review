import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ManageTopics.css';
import {
  getTopicsBySubject,
  createTopic,
  deleteTopic
} from '../services/examService';

const ManageTopics = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [topicForm, setTopicForm] = useState({ name: '', priority: 'Medium' });
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    loadTopics();
  }, [subjectId]);

  const loadTopics = async () => {
    try {
      const response = await getTopicsBySubject(subjectId);
      setTopics(response.data);
      if (response.data.length > 0) {
        setSubjectName(response.data[0].subject?.name || 'Subject');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading topics:', error);
      setLoading(false);
    }
  };

  const handleAddTopic = async () => {
    if (!topicForm.name.trim()) {
      alert('Please enter topic name');
      return;
    }

    try {
      await createTopic({ name: topicForm.name, priority: topicForm.priority, subject: subjectId });
      setTopicForm({ name: '', priority: 'Medium' });
      loadTopics();
      alert('Topic created successfully!');
    } catch (error) {
      alert('Error creating topic: ' + error.message);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Delete this topic?')) {
      try {
        await deleteTopic(topicId);
        loadTopics();
        alert('Topic deleted!');
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleEditContent = (topicId) => {
    navigate(`/manage-content/${topicId}`);
  };

  if (loading) {
    return <div className="manage-loading">Loading...</div>;
  }

  return (
    <div className="manage-topics-container">
      <div className="manage-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          Back to Subjects
        </button>
        <h1>Manage Topics - {subjectName}</h1>
        <p>Create and organize topics for this subject</p>
      </div>

      <div className="manage-content">
        <div className="create-section">
          <div className="create-panel">
            <h2 className="section-title create-title">+ Create New Topic</h2>

            <div className="create-form-block">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Topic Name"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                />
              </div>
            </div>

            <div className="create-form-block">
              <div className="form-group">
                <label>Priority Level</label>
                <select
                  value={topicForm.priority}
                  onChange={(e) => setTopicForm({ ...topicForm, priority: e.target.value })}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <button className="btn-primary btn-full" onClick={handleAddTopic}>
              Create Topic
            </button>
          </div>
        </div>

        <div className="list-section">
          <h2 className="section-title topics-title">All Topics</h2>
          {topics.length > 0 ? (
            <div className="topics-grid">
              {topics.map((topic) => (
                <div key={topic._id} className={`topic-card priority-${topic.priority.toLowerCase()}`}>
                  <div className="topic-header">
                    <h3>{topic.name}</h3>
                    <span className={`priority-badge ${topic.priority.toLowerCase()}`}>
                      {topic.priority}
                    </span>
                  </div>

                  <div className="topic-info">
                    <p>Material: <strong>{topic.hasStudyMaterial ? 'Yes' : 'No'}</strong></p>
                    <p>Videos: {topic.videos?.length || 0}</p>
                    <p>Quizzes: {topic.quizzes?.length || 0}</p>
                  </div>

                  <div className="topic-actions">
                    <button className="btn-edit" onClick={() => handleEditContent(topic._id)}>
                      Edit Content
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteTopic(topic._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No topics yet. Create one to add study material!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTopics;
