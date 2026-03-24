import React from 'react';
import './MaterialPage.css';
import { FaFilePdf, FaTrash, FaEye } from 'react-icons/fa';

const MaterialPage = () => {
  return (
    <div className="dashboard-container">
      <div className="side-panel">
        <h2>➕ Upload Material</h2>
        <form className="material-form">
          <input type="text" placeholder="Material Title" className="input" />
          <input type="file" accept="application/pdf" className="input" />
          <button className="btn-primary" type="submit">Upload</button>
        </form>
      </div>
      <div className="content-panel">
        <h2>📄 All Materials</h2>
        <div className="card-grid">
          <div className="material-card">
            <div className="material-header">
              <FaFilePdf className="file-icon" />
              <span className="material-title">Sample Notes</span>
            </div>
            <div className="material-actions">
              <button className="btn-view"><FaEye /> View</button>
              <button className="btn-delete"><FaTrash /> Delete</button>
            </div>
          </div>
          {/* ...more cards... */}
        </div>
      </div>
    </div>
  );
};

export default MaterialPage;
