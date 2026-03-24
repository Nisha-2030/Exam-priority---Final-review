import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMaterialById } from '../services/materialService';
import Card from '../components/Card';
import './MaterialView.css';

const MaterialView = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMaterial();
  }, [materialId]);

  const loadMaterial = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMaterialById(materialId);
      setMaterial(data);
    } catch (err) {
      console.error('Error loading material:', err);
      setError('Failed to load material');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="material-view-container">Loading...</div>;
  if (error) return (
    <div className="material-view-container">
      <Card title="Error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </Card>
    </div>
  );
  if (!material) return null;

  return (
    <div className="material-view-container">
      <div className="details-header">
        <button
          className="btn-back"
          onClick={() => {
            if (material?.topic?._id) {
              navigate(`/materials/${material.topic._id}`);
            } else {
              navigate(-1);
            }
          }}
        >
          ← Back
        </button>
        <div>
          <h1>{material.title}</h1>
          <p>Reference: {material.referenceBook || 'Nil'}</p>
          <p>Topic: {material.topic?.name || ''}</p>
        </div>
      </div>
      <Card>
        <div className="material-content">
          <p>{material.content}</p>
        </div>
        <button
          className="download-btn"
          onClick={() => {
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
      </Card>
    </div>
  );
};

export default MaterialView;
