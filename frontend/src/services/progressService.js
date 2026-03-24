import apiClient from './api';

export const getStudentProgress = () => apiClient.get('/progress');
export const getStudentProgressById = (studentId) => apiClient.get(`/progress/${studentId}`);
export const markTopicComplete = (studentId, topicId) =>
  apiClient.post(`/mark-complete/${studentId}/${topicId}`, {});
export const recordQuizAttempt = (topicId, data) =>
  apiClient.post(`/quiz-attempt/${topicId}`, data);
export const updateTargetExam = (examId) =>
  apiClient.post('/target-exam', { examId });

// Admin endpoints
export const getAllStudents = () => apiClient.get('/students');
export const blockStudent = (studentId) =>
  apiClient.put(`/students/${studentId}/block`);
export const unblockStudent = (studentId) =>
  apiClient.put(`/students/${studentId}/unblock`);
export const deleteStudent = (studentId) =>
  apiClient.delete(`/students/${studentId}`);
