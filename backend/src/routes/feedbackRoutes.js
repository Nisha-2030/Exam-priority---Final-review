const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin-only endpoints (must come first to avoid being caught by parameter patterns)
router.get(
  '/all',
  authMiddleware,
  roleMiddleware(['admin']),
  feedbackController.getAllFeedbacks
);

router.get(
  '/analytics/all-topics',
  authMiddleware,
  roleMiddleware(['admin']),
  feedbackController.getAllTopicsAnalytics
);

// User endpoints (require authentication)
router.post(
  '/',
  authMiddleware,
  feedbackController.addOrUpdateFeedback
);

router.get(
  '/user/:topicId',
  authMiddleware,
  feedbackController.getUserFeedback
);

// Public endpoints (no auth required)
router.get(
  '/topic/:topicId',
  feedbackController.getTopicFeedback
);

// Analytics endpoints (public)
router.get(
  '/analytics/topic/:topicId',
  feedbackController.getTopicAverageRatings
);

router.get(
  '/analytics/helpful/:topicId',
  feedbackController.getHelpfulCount
);

router.get(
  '/analytics/content-score/:topicId',
  feedbackController.getContentScore
);

router.get(
  '/analytics/keywords/:topicId',
  feedbackController.getCommonKeywords
);

router.delete(
  '/:feedbackId',
  authMiddleware,
  roleMiddleware(['admin']),
  feedbackController.deleteFeedback
);

module.exports = router;
