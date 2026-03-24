import React from 'react';
import './MaterialSidePanel.css';

const MaterialSidePanel = ({ material, onClose }) => {
  if (!material) return null;

  const getCategoryColor = (category) => {
    const colors = {
      theory: '#6c8ebf',     // soft blue
      formula: '#9a79bf',    // gentle purple
      definition: '#f7c967',// light gold
      example: '#6bc88e',   // muted green
      note: '#e57a7a',      // warm coral
    };
    return colors[category] || '#999';
  };

  return (
    <>
      {/* Overlay */}
      <div className="material-panel-overlay" onClick={onClose}></div>

      {/* Side Panel */}
      <div className="material-side-panel">
        {/* Header */}
        <div className="material-panel-header">
          <div className="material-panel-title-section">
            <span
              className="material-panel-category"
              style={{ backgroundColor: getCategoryColor(material.category) }}
            >
              {material.category}
            </span>
            <h2 className="material-panel-title">{material.title}</h2>
          </div>
          <button className="material-panel-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Info Section */}
        <div className="material-panel-info">
          <div className="info-item">
            <span className="info-label">📖 Reference Book:</span>
            <span className="info-value">{material.referenceBook || 'N/A'}</span>
          </div>
          {material.topic && (
            <div className="info-item">
              <span className="info-label">📌 Topic:</span>
              <span className="info-value">{typeof material.topic === 'string' ? material.topic : (material.topic?.name || 'N/A')}</span>
            </div>
          )}
          {material.subject && (
            <div className="info-item">
              <span className="info-label">📚 Subject:</span>
              <span className="info-value">{typeof material.subject === 'string' ? material.subject : (material.subject?.name || 'N/A')}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">📅 Date:</span>
            <span className="info-value">{material.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="material-panel-content">
          <h3>📄 Content</h3>
          <div className="material-content-text">
            {material.content || 'No content available'}
          </div>
        </div>

        {/* Download Button */}
        <div className="material-panel-actions">
          <button className="material-download-btn">
            ⬇️ Download as PDF
          </button>
          <button className="material-share-btn">
            📤 Share
          </button>
        </div>
      </div>
    </>
  );
};

export default MaterialSidePanel;
