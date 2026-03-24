import apiClient from './api';

// ============ GET VIDEOS ============
export const getAllVideos = async () => {
  try {
    const response = await apiClient.get('/videos');
    console.log('All videos fetched successfully');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const getVideosByTopic = async (topicId) => {
  try {
    const response = await apiClient.get(`/videos/topic/${topicId}`);
    console.log('Videos for topic fetched successfully');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching videos by topic:', error);
    throw error;
  }
};

export const getVideosBySubject = async (subjectId) => {
  try {
    const response = await apiClient.get(`/videos/subject/${subjectId}`);
    console.log('Videos for subject fetched successfully');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching videos by subject:', error);
    throw error;
  }
};

// ============ CREATE VIDEO (ADMIN) ============
export const createVideo = async (videoData) => {
  try {
    const response = await apiClient.post('/videos', videoData);
    return response.data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error.response?.data?.error || error.message;
  }
};

// ============ UPDATE VIDEO (ADMIN) ============
export const updateVideo = async (videoId, videoData) => {
  try {
    const response = await apiClient.put(`/videos/${videoId}`, videoData);
    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error.response?.data?.error || error.message;
  }
};

// ============ DELETE VIDEO (ADMIN) ============
export const deleteVideo = async (videoId) => {
  try {
    const response = await apiClient.delete(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error.response?.data?.error || error.message;
  }
};
