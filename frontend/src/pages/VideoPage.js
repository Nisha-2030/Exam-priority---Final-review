import React from 'react';
import './VideoPage.css';
import { FaYoutube, FaTrash, FaEdit } from 'react-icons/fa';

const VideoPage = () => {
  return (
    <div className="dashboard-container">
      <div className="side-panel">
        <h2>➕ Add Video</h2>
        <form className="video-form">
          <input type="text" placeholder="Video Title" className="input" />
          <input type="text" placeholder="YouTube Link" className="input" />
          <button className="btn-primary" type="submit">Add Video</button>
        </form>
      </div>
      <div className="content-panel">
        <h2>🎬 All Videos</h2>
        <div className="card-grid">
          <div className="video-card">
            <div className="video-header">
              <iframe title="Sample Video" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen></iframe>
              <span className="video-title">Sample Video</span>
            </div>
            <div className="video-actions">
              <button className="btn-edit"><FaEdit /> Edit</button>
              <button className="btn-delete"><FaTrash /> Delete</button>
            </div>
          </div>
          {/* ...more cards... */}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
