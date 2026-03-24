import React, { useState, useEffect } from 'react';
import { getMaterialsByTopic, getMaterialsBySubject, getAllMaterials } from '../services/materialService';
import './MaterialList.css';

const MaterialList = ({ topicId, subjectId, onMaterialSelect, onLoadingChange }) => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['all', 'theory', 'formula', 'definition', 'example', 'note'];

  const getCategoryColor = (category) => {
    // softer, pastel tones for better readability/comfort
    const colors = {
      theory: '#6c8ebf',     // soft blue
      formula: '#9a79bf',    // gentle purple
      definition: '#f7c967',// light gold
      example: '#6bc88e',   // muted green
      note: '#e57a7a',      // warm coral
    };
    return colors[category] || '#999';
  };

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      onLoadingChange?.(true);

      let data;
      if (topicId) {
        data = await getMaterialsByTopic(topicId);
      } else if (subjectId) {
        data = await getMaterialsBySubject(subjectId);
      } else {
        data = await getAllMaterials();
      }

      setMaterials(data);
    } catch (err) {
      setError(err);
      console.error('Error loading materials:', err);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  const filterMaterials = () => {
    if (categoryFilter === 'all') {
      setFilteredMaterials(materials);
    } else {
      setFilteredMaterials(materials.filter((m) => m.category === categoryFilter));
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [topicId, subjectId]);

  useEffect(() => {
    filterMaterials();
  }, [materials, categoryFilter]);

  if (loading) {
    return (
      <div className="material-list-container">
        <div className="loading-spinner"></div>
        <p>Loading materials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="material-list-container">
        <p className="error-message">⚠️ Failed to load materials</p>
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="material-list-container">
        <p className="empty-message">📭 No materials available</p>
      </div>
    );
  }

  return (
    <div className="material-list-container">
      <div className="material-list-header">
        <h3>📚 Study Materials ({materials.length})</h3>
      </div>

      {/* Category Filter */}
      <div className="category-filters">
        {categories.map((category) => {
          const count =
            category === 'all'
              ? materials.length
              : materials.filter((m) => m.category === category).length;
          return (
            <button
              key={category}
              className={`filter-button ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
              title={`${category} (${count})`}
              style={
                categoryFilter === category
                  ? { borderBottomColor: getCategoryColor(category) }
                  : {}
              }
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Materials List */}
      <div className="materials-list">
        {filteredMaterials.length === 0 ? (
          <p className="no-filter-message">No materials in this category</p>
        ) : (
          filteredMaterials.map((material) => (
            <div
              key={material._id}
              className="material-list-item"
              onClick={() => onMaterialSelect?.(material)}
              role="button"
              tabIndex={0}
            >
              <div className="material-list-header-row">
                <div className="material-list-title-section">
                  <span
                    className="material-category-tag"
                    style={{ backgroundColor: getCategoryColor(material.category) }}
                  >
                    {material.category}
                  </span>
                  <h4 className="material-list-title">{material.title}</h4>
                </div>
                <span className="material-ref-badge">{material.referenceBook}</span>
              </div>
              <p className="material-list-preview">{(material.content || '').substring(0, 120)}...</p>
              <div className="material-list-footer">
                <small className="material-date">
                  {new Date(material.createdAt).toLocaleDateString()}
                </small>
                <button className="view-button">View Full Content →</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MaterialList;
