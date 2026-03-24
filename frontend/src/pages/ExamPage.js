import React from 'react';
import './ExamPage.css';

const ExamPage = () => {
  return (
    <div className="dashboard-container">
      <div className="side-panel">
        <h2>📝 Exam Settings</h2>
        <form className="exam-form">
          <input type="text" placeholder="Exam Title" className="input" />
          <input type="number" placeholder="Time Limit (minutes)" className="input" />
          <button className="btn-primary" type="submit">Start Exam</button>
        </form>
      </div>
      <div className="content-panel">
        <h2>📋 Exam Questions</h2>
        <div className="card-grid">
          <div className="exam-card">
            <div className="exam-question">Sample Question: What is React?</div>
            <ul className="exam-options">
              <li>A. Library</li>
              <li>B. Framework</li>
              <li>C. Language</li>
              <li>D. Database</li>
            </ul>
            <button className="btn-primary">Submit Exam</button>
          </div>
          {/* ...more cards... */}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
