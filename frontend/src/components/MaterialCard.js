import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MaterialCard.css';

const MaterialCard = ({ material, onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const openMaterial = () => {
    navigate(`/material/${material._id}`);
  };

  return (
    <div className="material-card">
      <div className="material-header" onClick={toggleExpand}>
        <div className="material-title-section">
          <span className="material-icon">📚</span>
          <h3 className="material-title" onClick={openMaterial} style={{cursor:'pointer'}}>{material.title}</h3>
        </div>
        <span className="material-category" onClick={openMaterial} style={{cursor:'pointer'}}>{material.category}</span>
        <button className={`expand-btn ${expanded ? 'expanded' : ''}`}>
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {expanded && (
        <div className="material-content">
          <div className="material-meta">
            <span className="meta-item">
              <strong>Reference:</strong> {material.referenceBook || 'Nil'}
            </span>
            <span className="meta-item">
              <strong>Topic:</strong> {material.topic?.name || 'N/A'}
            </span>
          </div>

          <div className="material-text">
            {material.content}
          </div>

          <div className="material-actions">
            <button className="download-btn" onClick={() => {
                const blob = new Blob([material.content || ''], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = (material.title || 'material').replace(/\s+/g, '_') + '.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              ⬇️ Download
            </button>
          </div>

          <div className="material-footer">
            <small>Created: {new Date(material.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialCard;
