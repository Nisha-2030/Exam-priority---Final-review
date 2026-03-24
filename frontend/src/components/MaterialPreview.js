import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MaterialPreview.css';

const MaterialPreview = ({ material }) => {
  const navigate = useNavigate();

  const open = () => {
    navigate(`/material/${material._id}`);
  };

  return (
    <div className="material-preview" onClick={open} style={{ cursor: 'pointer' }}>
      <div className="preview-header">
        <h3>{material.title}</h3>
        <span className="preview-category">{material.category}</span>
      </div>
      {material.referenceBook && (
        <p className="preview-ref">📖 {material.referenceBook}</p>
      )}
      <p className="preview-snippet">
        {material.content ? material.content.substring(0, 120) + '...' : 'No content'}
      </p>
    </div>
  );
};

export default MaterialPreview;
