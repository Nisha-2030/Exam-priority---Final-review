import apiClient from './api';

// ============ GET MATERIALS ============
export const getAllMaterials = async () => {
  try {
    const response = await apiClient.get('/materials');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

export const getMaterialsByTopic = async (topicId) => {
  try {
    const response = await apiClient.get(`/materials/topic/${topicId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching materials by topic:', error);
    throw error;
  }
};

export const getMaterialsBySubject = async (subjectId) => {
  try {
    const response = await apiClient.get(`/materials/subject/${subjectId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching materials by subject:', error);
    throw error;
  }
};

// ============ CREATE MATERIAL (ADMIN) ============
export const createMaterial = async (materialData) => {
  try {
    const response = await apiClient.post('/materials', materialData);
    return response.data;
  } catch (error) {
    console.error('Error creating material:', error.response || error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to add material';
    throw new Error(errorMessage);
  }
};

// ============ UPDATE MATERIAL (ADMIN) ============
export const updateMaterial = async (materialId, materialData) => {
  try {
    const response = await apiClient.put(`/materials/${materialId}`, materialData);
    return response.data;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error.response?.data?.error || error.message;
  }
};

// ============ DELETE MATERIAL (ADMIN) ============
export const deleteMaterial = async (materialId) => {
  try {
    const response = await apiClient.delete(`/materials/${materialId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error.response?.data?.error || error.message;
  }
};

// ============ GET MATERIAL BY ID ============
export const getMaterialById = async (materialId) => {
  try {
    const response = await apiClient.get(`/materials/${materialId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching material by id:', error);
    throw error;
  }
};
