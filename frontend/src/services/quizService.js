import apiClient from './api';

export const getAllQuizzes = async () => {
  try {
    const response = await apiClient.get('/quizzes');
    console.log('All quizzes fetched successfully');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error.response?.data?.error || error.message);
    throw error.response?.data?.error || 'Failed to fetch quizzes';
  }
};

export const getQuizzesByTopic = async (topicId) => {
  try {
    const response = await apiClient.get(`/quizzes/topic/${topicId}`);
    console.log('Quizzes for topic fetched successfully');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error.response?.data?.error || error.message);
    throw error.response?.data?.error || 'Failed to fetch quizzes';
  }
};

export const getQuizzesBySubject = async (subjectId) => {
  try {
    const response = await apiClient.get(`/quizzes/subject/${subjectId}`);
    console.log('Quizzes for subject fetched successfully');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error.response?.data?.error || error.message);
    throw error.response?.data?.error || 'Failed to fetch quizzes';
  }
};

export const getQuizByTopic = (topicId) => apiClient.get(`/quiz/${topicId}`);

export const createQuiz = (data) => {
  try {
    return apiClient.post('/quiz', data);
  } catch (error) {
    console.error('Error creating quiz:', error.response?.data || error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to create quiz';
    throw new Error(errorMessage);
  }
};

export const updateQuiz = (id, data) => apiClient.put(`/quiz/${id}`, data);

export const deleteQuiz = (id) => apiClient.delete(`/quiz/${id}`);

export const submitQuiz = (quizId, answers) =>
  apiClient.post(`/quiz/${quizId}/submit`, { answers });

