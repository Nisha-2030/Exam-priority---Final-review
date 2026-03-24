import apiClient from './api';

export const getAllExams = () => apiClient.get('/exams');
export const getExamById = (id) => apiClient.get(`/exams/${id}`);
export const createExam = (data) => apiClient.post('/exams', data);
export const updateExam = (id, data) => apiClient.put(`/exams/${id}`, data);
export const deleteExam = (id) => apiClient.delete(`/exams/${id}`);

export const getSubjectsByExam = (examId) => apiClient.get(`/exams/${examId}/subjects`);
export const createSubject = (data) => apiClient.post('/subjects', data);
export const updateSubject = (id, data) => apiClient.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => apiClient.delete(`/subjects/${id}`);

export const getTopicsBySubject = (subjectId) =>
  apiClient.get(`/subjects/${subjectId}/topics`);
export const getTopicById = (id) => apiClient.get(`/topics/${id}`);
export const getHighMediumTopics = (subjectId) =>
  apiClient.get(`/subjects/${subjectId}/topics/filtered`);
export const createTopic = (data) => apiClient.post('/topics', data);
export const updateTopic = (id, data) => apiClient.put(`/topics/${id}`, data);
export const deleteTopic = (id) => apiClient.delete(`/topics/${id}`);
