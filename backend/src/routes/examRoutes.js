const express = require('express');
const {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getSubjectsByExam,
  createSubject,
  updateSubject,
  deleteSubject,
  getTopicsBySubject,
  getTopicById,
  getHighMediumTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Exam routes
router.get('/exams', getAllExams);
router.get('/exams/:id', getExamById);
router.post('/exams', authMiddleware, roleMiddleware(['admin']), createExam);
router.put('/exams/:id', authMiddleware, roleMiddleware(['admin']), updateExam);
router.delete('/exams/:id', authMiddleware, roleMiddleware(['admin']), deleteExam);

// Subject routes
router.get('/exams/:examId/subjects', getSubjectsByExam);
router.post('/subjects', authMiddleware, roleMiddleware(['admin']), createSubject);
router.put('/subjects/:id', authMiddleware, roleMiddleware(['admin']), updateSubject);
router.delete('/subjects/:id', authMiddleware, roleMiddleware(['admin']), deleteSubject);

// Topic routes
router.get('/subjects/:subjectId/topics', getTopicsBySubject);
router.get('/topics/:id', getTopicById);
router.get('/subjects/:subjectId/topics/filtered', getHighMediumTopics);
router.post('/topics', authMiddleware, roleMiddleware(['admin']), createTopic);
router.put('/topics/:id', authMiddleware, roleMiddleware(['admin']), updateTopic);
router.delete('/topics/:id', authMiddleware, roleMiddleware(['admin']), deleteTopic);

module.exports = router;
