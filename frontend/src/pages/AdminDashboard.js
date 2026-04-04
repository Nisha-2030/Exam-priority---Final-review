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

  const handleAddExam = async () => {
    if (!examForm.name.trim()) {
      alert('Please enter exam name');
      return;
    }
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
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(examId);
        loadData();
        alert('Exam deleted successfully!');
      } catch (error) {
        alert('Error deleting exam: ' + error.message);
      }
    }
  };

  const handleManageSubjects = (examId) => {
    navigate(`/manage-subjects/${examId}`);
  };

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
            <Card title="➕ Create New Exam" className="create-exam-card">
              <div className="form-group exam-form-group">
                <input
                  className="exam-name-input"
                  type="text"
                  placeholder="Exam Name (e.g., RRB, TNPSC, SSC, Banking)"
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                />
              </div>
              <div className="form-group exam-form-group">
                <textarea
                  className="exam-description-input"
                  placeholder="Description"
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  rows="8"
                ></textarea>
              </div>
              <button className="btn-primary create-exam-btn" onClick={handleAddExam}>
                Create Exam
              </button>
            </Card>

            <Card title="📋 All Exams">
              <div className="exam-list-admin">
                {exams.length > 0 ? (
                  exams.map((exam) => (
                    <div key={exam._id} className="exam-item-admin">
                      <div>
                        <h4>{exam.name}</h4>
                        <p>{exam.description}</p>
                        <small>{exam.subjects?.length || 0} subjects</small>
                      </div>
                      <div className="item-actions">
                        <button
                          className="btn-small btn-view"
                          onClick={() => handleManageSubjects(exam._id)}
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
                  ))
                ) : (
                  <p className="empty-message">No exams yet. Create one to get started!</p>
                )}
              </div>
            </Card>
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
                <p className="empty-message">No students yet.</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
