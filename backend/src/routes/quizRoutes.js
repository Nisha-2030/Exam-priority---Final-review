const express = require('express');
const {
  getAllQuizzes,
  getQuizzesByTopic,
  getQuizzesBySubject,
  getQuizByTopic,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuuzAnswer,
} = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/quizzes', getAllQuizzes);
router.get('/quizzes/topic/:topicId', getQuizzesByTopic);
router.get('/quizzes/subject/:subjectId', getQuizzesBySubject);
router.get('/quiz/:topicId', getQuizByTopic);

// Admin routes
router.post('/quiz', authMiddleware, roleMiddleware(['admin']), createQuiz);
router.put('/quiz/:id', authMiddleware, roleMiddleware(['admin']), updateQuiz);
router.delete('/quiz/:id', authMiddleware, roleMiddleware(['admin']), deleteQuiz);

// Student routes
router.post('/quiz/:id/submit', authMiddleware, submitQuuzAnswer);

module.exports = router;
