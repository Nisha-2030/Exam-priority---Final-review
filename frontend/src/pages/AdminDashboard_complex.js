import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Card from '../components/Card';
import { 
  getAllExams, 
  createExam, 
  deleteExam
} from '../services/examService';
import { 
  getAllStudents, 
  blockStudent, 
  unblockStudent, 
  deleteStudent 
} from '../services/progressService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('exams');
  const [loading, setLoading] = useState(true);

  // Form states
  const [examForm, setExamForm] = useState({ name: '', description: '' });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'exams') {
        const response = await getAllExams();
        setExams(response.data);
      } else if (activeTab === 'students') {
        const response = await getAllStudents();
        setStudents(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  // Exam handlers
  const handleAddExam = async () => {
    try {
      await createExam(examForm);
      setExamForm({ name: '', description: '' });
      loadData();
      alert('Exam created successfully!');
    } catch (error) {
      alert('Error creating exam: ' + error.message);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteExam(examId);
        setSelectedExam(null);
        loadData();
        alert('Exam deleted successfully!');
      } catch (error) {
        alert('Error deleting exam: ' + error.message);
      }
    }
  };

  const handleSelectExam = async (examId) => {
    try {
      setSelectedExam(examId);
      setSelectedSubject(null);
      setSelectedTopic(null);
      const response = await getSubjectsByExam(examId);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  // Subject handlers
  const handleAddSubject = async () => {
    if (!selectedExam) {
      alert('Please select an exam first');
      return;
    }
    try {
      await createSubject({ name: subjectForm.name, exam: selectedExam });
      setSubjectForm({ name: '' });
      handleSelectExam(selectedExam);
      alert('Subject created successfully!');
    } catch (error) {
      alert('Error creating subject: ' + error.message);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteSubject(subjectId);
        handleSelectExam(selectedExam);
        alert('Subject deleted successfully!');
      } catch (error) {
        alert('Error deleting subject: ' + error.message);
      }
    }
  };

  const handleSelectSubject = async (subjectId) => {
    try {
      setSelectedSubject(subjectId);
      setSelectedTopic(null);
      const response = await getTopicsBySubject(subjectId);
      setTopics(prev => ({ ...prev, [subjectId]: response.data }));
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  // Topic handlers
  const handleAddTopic = async () => {
    if (!selectedSubject) {
      alert('Please select a subject first');
      return;
    }
    try {
      await createTopic({ ...topicForm, subject: selectedSubject });
      setTopicForm({ name: '', priority: 'Medium', studyMaterial: '' });
      handleSelectSubject(selectedSubject);
      alert('Topic created successfully!');
    } catch (error) {
      alert('Error creating topic: ' + error.message);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteTopic(topicId);
        handleSelectSubject(selectedSubject);
        alert('Topic deleted successfully!');
      } catch (error) {
        alert('Error deleting topic: ' + error.message);
      }
    }
  };

  const handleSelectTopic = async (topicId) => {
    try {
      setSelectedTopic(topicId);
      const response = await getQuizByTopic(topicId);
      setQuizzes(prev => ({ ...prev, [topicId]: response.data }));
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  // Quiz handlers
  const handleAddQuiz = async () => {
    if (!selectedTopic) {
      alert('Please select a topic first');
      return;
    }
    try {
      await createQuiz({ ...quizForm, topic: selectedTopic });
      setQuizForm({ title: '', questions: '', answers: '' });
      handleSelectTopic(selectedTopic);
      alert('Quiz created successfully!');
    } catch (error) {
      alert('Error creating quiz: ' + error.message);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteQuiz(quizId);
        handleSelectTopic(selectedTopic);
        alert('Quiz deleted successfully!');
      } catch (error) {
        alert('Error deleting quiz: ' + error.message);
      }
    }
  };

  // Video handlers
  const handleAddVideo = async () => {
    if (!selectedTopic) {
      alert('Please select a topic first');
      return;
    }
    try {
      setVideos(prev => ({
        ...prev,
        [selectedTopic]: [
          ...(prev[selectedTopic] || []),
          { ...videoForm, _id: Date.now(), topic: selectedTopic }
        ]
      }));
      setVideoForm({ title: '', url: '', duration: '' });
      alert('Video added successfully!');
    } catch (error) {
      alert('Error adding video: ' + error.message);
    }
  };

  const handleDeleteVideo = (topicId, videoId) => {
    if (window.confirm('Are you sure?')) {
      setVideos(prev => ({
        ...prev,
        [topicId]: prev[topicId].filter(v => v._id !== videoId)
      }));
      alert('Video deleted successfully!');
    }
  };

  // Student handlers
  const handleBlockStudent = async (studentId) => {
    try {
      await blockStudent(studentId);
      loadData();
      alert('Student blocked successfully!');
    } catch (error) {
      alert('Error blocking student: ' + error.message);
    }
  };

  const handleUnblockStudent = async (studentId) => {
    try {
      await unblockStudent(studentId);
      loadData();
      alert('Student unblocked successfully!');
    } catch (error) {
      alert('Error unblocking student: ' + error.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
        loadData();
        alert('Student deleted successfully!');
      } catch (error) {
        alert('Error deleting student: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          📚 Exams & Curriculum
        </button>
        <button
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👥 Manage Students
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'exams' && (
          <div className="exams-section">
            <Card title="➕ Create New Exam">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Exam Name (e.g., RRB, TNPSC, SSC, Banking)"
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  rows="3"
                ></textarea>
              </div>
              <button className="btn-primary" onClick={handleAddExam}>
                Create Exam
              </button>
            </Card>

            <Card title="📋 All Exams">
              <div className="exam-list-admin">
                {exams.map((exam) => (
                  <div key={exam._id} className="exam-item-admin">
                    <div>
                      <h4>{exam.name}</h4>
                      <p>{exam.description}</p>
                      <small>{exam.subjects?.length || 0} subjects</small>
                    </div>
                    <div className="item-actions">
                      <button
                        className="btn-small btn-view"
                        onClick={() => handleSelectExam(exam._id)}
                      >
                        Manage
                      </button>
                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleDeleteExam(exam._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {selectedExam && (
              <>
                <Card title="➕ Create Subject in Selected Exam">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Subject Name (e.g., Maths, English, Reasoning)"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    />
                  </div>
                  <button className="btn-primary" onClick={handleAddSubject}>
                    Add Subject
                  </button>
                </Card>

                <Card title="📖 Subjects">
                  <div className="subject-list-admin">
                    {subjects.map((subject) => (
                      <div key={subject._id}>
                        <div className="subject-item-admin">
                          <div>
                            <h4>{subject.name}</h4>
                            <small>{subject.topics?.length || 0} topics</small>
                          </div>
                          <div className="item-actions">
                            <button
                              className="btn-small btn-view"
                              onClick={() => handleSelectSubject(subject._id)}
                            >
                              {selectedSubject === subject._id ? 'Hide Topics' : 'Manage Topics'}
                            </button>
                            <button
                              className="btn-small btn-danger"
                              onClick={() => handleDeleteSubject(subject._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {selectedSubject === subject._id && (
                          <div style={{ marginTop: '2rem', paddingLeft: '2rem', borderLeft: '3px solid var(--accent)' }}>
                            <Card title={`➕ Add Topic to ${subject.name}`}>
                              <div className="form-group">
                                <input
                                  type="text"
                                  placeholder="Topic Name"
                                  value={topicForm.name}
                                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <select
                                  value={topicForm.priority}
                                  onChange={(e) => setTopicForm({ ...topicForm, priority: e.target.value })}
                                >
                                  <option value="High">High Priority</option>
                                  <option value="Medium">Medium Priority</option>
                                  <option value="Low">Low Priority</option>
                                </select>
                              </div>
                              <button className="btn-primary" onClick={handleAddTopic}>
                                Add Topic
                              </button>
                            </Card>

                            <Card title={`📌 Topics in ${subject.name}`}>
                              <div className="topic-list-admin">
                                {(topics[subject._id] || []).map((topic) => (
                                  <div key={topic._id}>
                                    <div className="topic-item-admin">
                                      <div>
                                        <h4>{topic.name}</h4>
                                        <span className={`priority-badge ${topic.priority.toLowerCase()}`}>
                                          {topic.priority}
                                        </span>
                                      </div>
                                      <div className="item-actions">
                                        <button
                                          className="btn-small btn-view"
                                          onClick={() => handleSelectTopic(topic._id)}
                                        >
                                          {selectedTopic === topic._id ? 'Hide Content' : 'Edit Content'}
                                        </button>
                                        <button
                                          className="btn-small btn-danger"
                                          onClick={() => handleDeleteTopic(topic._id)}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>

                                    {selectedTopic === topic._id && (
                                      <div style={{ marginTop: '2rem', paddingLeft: '2rem', borderLeft: '3px solid #e67e22' }}>
                                        {/* 1. Material Section */}
                                        <Card title="📚 Study Material">
                                          <div className="form-group">
                                            <textarea
                                              placeholder="Add or edit study notes and material for this topic"
                                              value={topicForm.studyMaterial}
                                              onChange={(e) => setTopicForm({ ...topicForm, studyMaterial: e.target.value })}
                                              rows="5"
                                            ></textarea>
                                          </div>
                                          <button className="btn-primary" onClick={handleAddTopic}>
                                            Save Material
                                          </button>
                                        </Card>

                                        {/* 2. Video Section */}
                                        <Card title="🎥 Add Video">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              placeholder="Video Title"
                                              value={videoForm.title}
                                              onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                            />
                                          </div>
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              placeholder="Video URL (YouTube/Google Drive link)"
                                              value={videoForm.url}
                                              onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                                            />
                                          </div>
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              placeholder="Duration (e.g., 15:30)"
                                              value={videoForm.duration}
                                              onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                                            />
                                          </div>
                                          <button className="btn-primary" onClick={handleAddVideo}>
                                            Add Video
                                          </button>
                                        </Card>

                                        <Card title={`🎥 Videos for ${topic.name}`}>
                                          <div className="video-list-admin">
                                            {(videos[topic._id] || []).length > 0 ? (
                                              (videos[topic._id] || []).map((video) => (
                                                <div key={video._id} className="video-item-admin">
                                                  <div>
                                                    <h4>{video.title}</h4>
                                                    <small>Duration: {video.duration}</small>
                                                  </div>
                                                  <div className="item-actions">
                                                    <button
                                                      className="btn-small btn-danger"
                                                      onClick={() => handleDeleteVideo(topic._id, video._id)}
                                                    >
                                                      Delete
                                                    </button>
                                                  </div>
                                                </div>
                                              ))
                                            ) : (
                                              <p>No videos yet. Add one above!</p>
                                            )}
                                          </div>
                                        </Card>

                                        {/* 3. Quiz Section - Last */}
                                        <Card title="❓ Add Quiz">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              placeholder="Quiz Title"
                                              value={quizForm.title}
                                              onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                                            />
                                          </div>
                                          <div className="form-group">
                                            <textarea
                                              placeholder="Questions (comma-separated)"
                                              value={quizForm.questions}
                                              onChange={(e) => setQuizForm({ ...quizForm, questions: e.target.value })}
                                              rows="4"
                                            ></textarea>
                                          </div>
                                          <div className="form-group">
                                            <textarea
                                              placeholder="Answers (comma-separated, in same order)"
                                              value={quizForm.answers}
                                              onChange={(e) => setQuizForm({ ...quizForm, answers: e.target.value })}
                                              rows="4"
                                            ></textarea>
                                          </div>
                                          <button className="btn-primary" onClick={handleAddQuiz}>
                                            Add Quiz
                                          </button>
                                        </Card>

                                        <Card title={`❓ Quizzes for ${topic.name}`}>
                                          <div className="quiz-list-admin">
                                            {(quizzes[topic._id] || []).length > 0 ? (
                                              (quizzes[topic._id] || []).map((quiz) => (
                                                <div key={quiz._id} className="quiz-item-admin">
                                                  <div>
                                                    <h4>{quiz.title}</h4>
                                                    <small>{quiz.questions?.length || 0} questions</small>
                                                  </div>
                                                  <div className="item-actions">
                                                    <button
                                                      className="btn-small btn-danger"
                                                      onClick={() => handleDeleteQuiz(quiz._id)}
                                                    >
                                                      Delete
                                                    </button>
                                                  </div>
                                                </div>
                                              ))
                                            ) : (
                                              <p>No quizzes yet. Add one above!</p>
                                            )}
                                          </div>
                                        </Card>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </Card>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <Card title="👥 All Students">
            <div className="students-table">
              {students.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>
                          <span className={`status-badge ${student.isBlocked ? 'blocked' : 'active'}`}>
                            {student.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>
                          {student.isBlocked ? (
                            <button
                              className="btn-small btn-success"
                              onClick={() => handleUnblockStudent(student._id)}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="btn-small btn-danger"
                              onClick={() => handleBlockStudent(student._id)}
                            >
                              Block
                            </button>
                          )}
                          <button
                            className="btn-small btn-danger"
                            onClick={() => handleDeleteStudent(student._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No students yet.</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
