import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import Card from '../components/Card';
import { getAllExams, getExamById } from '../services/examService';
import { updateTargetExam } from '../services/progressService';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const examsResponse = await getAllExams();
      setExams(examsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleSelectExam = async (examId) => {
    try {
      setSelectedExam(examId);
      const exam = await getExamById(examId);
      setSubjects(exam.data.subjects || []);
      
      await updateTargetExam(examId);
    } catch (error) {
      console.error('Error selecting exam:', error);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container student-dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
      </div>

      <Card title="How To Start">
        <ol className="howto-list">
          <li>Select an Exam from the left panel.</li>
          <li>Choose a Subject to view relevant study materials.</li>
          <li>Take a quiz to test your knowledge.</li>
        </ol>
        <p className="howto-note"><em>Only High and Medium priority items are currently listed.</em></p>
      </Card>

      <div className="dashboard-sections">
        <div className="section-col">
          <div className="section-title">
            <span className="section-icon section-icon-plus" aria-hidden="true">+</span>
            <span>Select Exam</span>
          </div>
          <div className="section-body">
            <div className="exam-list">
              {exams.map((exam) => (
                <button
                  key={exam._id}
                  className={`list-btn ${selectedExam === exam._id ? 'active' : ''}`}
                  onClick={() => handleSelectExam(exam._id)}
                >
                  {exam.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="section-col">
          <div className="section-title">
            <span className="section-icon section-icon-doc" aria-hidden="true"></span>
            <span>Available Subjects</span>
          </div>
          <div className="section-body">
            {selectedExam && subjects.length > 0 ? (
              <div className="subject-list">
                {subjects.map((subject) => (
                  <button
                    key={subject._id}
                    className="list-btn"
                    onClick={() => navigate(`/student-subject/${subject._id}`)}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="empty-message">Select an exam to view subjects.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;



