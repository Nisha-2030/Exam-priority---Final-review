import React, { useState, useEffect } from 'react';
import MaterialCard from './MaterialCard';
import './MaterialSection.css';

const MaterialSection = ({ topicId, subjectId, isLoading = false, onLoadingChange }) => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, [topicId, subjectId]);

  const normalizeResponseData = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    return response?.data?.data ?? response?.data ?? [];
  };

  const itemMatchesTopic = (item) =>
    item?.topic?._id === topicId || item?.topic === topicId;

  const loadMaterials = async () => {
    setLocalLoading(true);
    onLoadingChange?.(true);
    
    try {
      const { getMaterialsByTopic, getMaterialsBySubject, getAllMaterials } = 
        await import('../services/materialService');
      
      let data;
      if (topicId) {
        data = normalizeResponseData(await getMaterialsByTopic(topicId));
      } else if (subjectId) {
        data = normalizeResponseData(await getMaterialsBySubject(subjectId));
      } else {
        data = normalizeResponseData(await getAllMaterials());
      }

      const finalMaterials = topicId ? data.filter(itemMatchesTopic) : data;
      setMaterials(finalMaterials);
      setFilteredMaterials(finalMaterials);
      setError(null);
    } catch (err) {
      console.error('Error loading materials:', err);
      setError('Failed to load materials');
      setMaterials([]);
      setFilteredMaterials([]);
    } finally {
      setLocalLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    if (category === 'all') {
      setFilteredMaterials(materials);
    } else {
      setFilteredMaterials(materials.filter(m => m.category === category));
    }
  };

  return (
    <div className="material-section">
      <div className="section-header">
        <h2>📚 Study Materials</h2>
        <p>Reference textbook content and key concepts</p>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {localLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading materials...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No materials available</p>
          <small>Check back later for new study materials</small>
        </div>
      ) : (
        <>
          <div className="category-filter">
            <button
              className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('all')}
            >
              All ({materials.length})
            </button>
            <button
              className={`filter-btn ${categoryFilter === 'theory' ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('theory')}
            >
              Theory ({materials.filter(m => m.category === 'theory').length})
            </button>
            <button
              className={`filter-btn ${categoryFilter === 'formula' ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('formula')}
            >
              Formulas ({materials.filter(m => m.category === 'formula').length})
            </button>
            <button
              className={`filter-btn ${categoryFilter === 'example' ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('example')}
            >
              Examples ({materials.filter(m => m.category === 'example').length})
            </button>
          </div>

          <div className="materials-list">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MaterialSection;
