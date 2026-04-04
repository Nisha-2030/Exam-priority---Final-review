import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ManageTopics.css';
import Card from '../components/Card';
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
    return <div className="manage-topics-loading">Loading...</div>;
  }

  return (
    <div className="manage-topics-container">
      <div className="manage-topics-header">
        <button className="manage-topics-back-btn" onClick={() => navigate(-1)}>
          Back to Subjects
        </button>
        <h1>Manage Topics - {subjectName}</h1>
        <p>Create and organize topics for this subject</p>
      </div>

      <div className="manage-topics-content">
        <div className="manage-topics-create-section">
          <Card title="Create New Topic" className="manage-topics-create-card">
            <div className="manage-topics-form-group">
              <input
                type="text"
                placeholder="Topic Name"
                value={topicForm.name}
                onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
              />
            </div>

            <div className="manage-topics-form-group">
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

            <button className="manage-topics-btn-primary manage-topics-btn-full" onClick={handleAddTopic}>
              Create Topic
            </button>
          </Card>
        </div>

        <div className="manage-topics-list-section">
          <Card title="All Topics" className="manage-topics-list-card">
            {topics.length > 0 ? (
              <div className="manage-topics-list">
                {topics.map((topic) => (
                  <div key={topic._id} className="manage-topic-item">
                    <div className="manage-topic-item-info">
                      <h3>{topic.name}</h3>
                      <p>
                        Priority: <strong>{topic.priority}</strong>
                      </p>
                      <p>
                        Material: <strong>{topic.hasStudyMaterial ? 'Yes' : 'No'}</strong>
                      </p>
                      <p>
                        Videos: {topic.videos?.length || 0} | Quizzes: {topic.quizzes?.length || 0}
                      </p>
                    </div>
                    <div className="manage-topic-item-actions">
                      <button className="manage-topics-btn-manage" onClick={() => handleEditContent(topic._id)}>
                        Manage Content
                      </button>
                      <button className="manage-topics-btn-delete" onClick={() => handleDeleteTopic(topic._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="manage-topics-empty-state">
                <p>No topics yet. Create one to add study material!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageTopics;
