import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  deleteMaterial,
  getMaterialById,
  updateMaterial
} from '../services/materialService';
import Card from '../components/Card';
import './AdminMaterialView.css';

const toEditableForm = (material) => ({
  title: material?.title || '',
  content: material?.content || '',
  referenceBook: material?.referenceBook || '',
  category: material?.category || 'theory'
});

const AdminMaterialView = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    referenceBook: '',
    category: 'theory'
  });
  const [initialForm, setInitialForm] = useState({
    title: '',
    content: '',
    referenceBook: '',
    category: 'theory'
  });

  const topicIdFromState = location.state?.topicId;
  const topicId = material?.topic?._id || topicIdFromState;
  const hasChanges = useMemo(
    () =>
      form.title !== initialForm.title ||
      form.content !== initialForm.content ||
      form.referenceBook !== initialForm.referenceBook ||
      form.category !== initialForm.category,
    [form, initialForm]
  );

  const loadMaterial = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMaterialById(materialId);
      const editable = toEditableForm(data);
      setMaterial(data);
      setForm(editable);
      setInitialForm(editable);
    } catch (err) {
      console.error('Error loading material:', err);
      setError('Failed to load material details.');
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  useEffect(() => {
    loadMaterial();
  }, [loadMaterial]);

  useEffect(() => {
    const warnBeforeUnload = (event) => {
      if (!isEditing || !hasChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [isEditing, hasChanges]);

  const goBackToManageContent = () => {
    if (topicId) {
      navigate(`/manage-content/${topicId}`);
      return;
    }
    navigate(-1);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDiscard = () => {
    setForm(initialForm);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const title = form.title.trim();
    const content = form.content.trim();

    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      const response = await updateMaterial(materialId, {
        title,
        content,
        referenceBook: form.referenceBook.trim(),
        category: form.category
      });
      const updatedMaterial = response?.data;
      const editable = toEditableForm(updatedMaterial || { ...material, ...form, title, content });
      setMaterial(updatedMaterial || { ...material, ...editable });
      setInitialForm(editable);
      setForm(editable);
      setIsEditing(false);
      alert('Material updated successfully.');
    } catch (err) {
      console.error('Error updating material:', err);
      alert(typeof err === 'string' ? err : err?.message || 'Failed to update material.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this material? This action cannot be undone.')) return;

    try {
      setDeleting(true);
      await deleteMaterial(materialId);
      alert('Material deleted successfully.');
      goBackToManageContent();
    } catch (err) {
      console.error('Error deleting material:', err);
      alert(typeof err === 'string' ? err : err?.message || 'Failed to delete material.');
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    if (isEditing && hasChanges) {
      const shouldLeave = window.confirm(
        'You have unsaved changes. Leave this page without saving?'
      );
      if (!shouldLeave) return;
    }
    goBackToManageContent();
  };

  if (loading) {
    return <div className="admin-material-view-container">Loading material...</div>;
  }

  if (error) {
    return (
      <div className="admin-material-view-container">
        <Card title="Error">
          <p>{error}</p>
          <div className="admin-material-view-actions">
            <button className="admin-material-btn secondary" onClick={goBackToManageContent}>
              Back
            </button>
            <button className="admin-material-btn primary" onClick={loadMaterial}>
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="admin-material-view-container">
        <Card title="Material Not Found">
          <p>This material no longer exists.</p>
          <button className="admin-material-btn secondary" onClick={goBackToManageContent}>
            Back to Manage Content
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-material-view-container">
      <div className="admin-material-header">
        <button className="admin-material-btn secondary" onClick={handleBack}>
          Back to Manage Content
        </button>
        <div className="admin-material-title-wrap">
          <h1>{material.title}</h1>
          <p>{material.topic?.name ? `Topic: ${material.topic.name}` : 'Material details'}</p>
        </div>
      </div>

      <Card title="Material Details">
        <div className="admin-material-meta">
          <span className="admin-material-badge">{form.category || 'theory'}</span>
          <span className="admin-material-ref">
            Reference: {form.referenceBook || 'Nil'}
          </span>
        </div>

        {isEditing ? (
          <div className="admin-material-form">
            <label className="admin-material-field">
              Title
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Material title"
              />
            </label>

            <label className="admin-material-field">
              Category
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="theory">Theory</option>
                <option value="formula">Formula</option>
                <option value="definition">Definition</option>
                <option value="example">Example</option>
                <option value="note">Note</option>
              </select>
            </label>

            <label className="admin-material-field full-width">
              Reference Book/Page
              <input
                type="text"
                value={form.referenceBook}
                onChange={(e) => handleChange('referenceBook', e.target.value)}
                placeholder="Optional reference (Nil if not available)"
              />
            </label>

            <label className="admin-material-field full-width">
              Content
              <textarea
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows="16"
                placeholder="Material content"
              />
            </label>
          </div>
        ) : (
          <div className="admin-material-content">
            {material.content || 'No content'}
          </div>
        )}

        <div className="admin-material-view-actions">
          {!isEditing && (
            <button
              className="admin-material-btn warning"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}

          {!isEditing && (
            <button className="admin-material-btn primary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}

          {isEditing && (
            <button
              className="admin-material-btn secondary"
              onClick={handleDiscard}
              disabled={saving}
              title="Discard changes"
            >
              Discard
            </button>
          )}

          {isEditing && (
            <button
              className="admin-material-btn primary"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              title={!hasChanges ? 'No changes to save' : 'Save changes'}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminMaterialView;
