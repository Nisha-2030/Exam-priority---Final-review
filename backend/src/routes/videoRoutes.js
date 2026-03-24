const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ============ PUBLIC - STUDENT ROUTES ============
// Get all videos
router.get('/videos', videoController.getAllVideos);

// Get videos by subject
router.get('/videos/subject/:subjectId', videoController.getVideosBySubject);

// Get videos by topic
router.get('/videos/topic/:topicId', videoController.getVideosByTopic);

// ============ PROTECTED - ADMIN ROUTES ============
// Create video (Admin only)
router.post(
  '/videos',
  authMiddleware,
  roleMiddleware('admin'),
  videoController.createVideo
);

// Update video (Admin only)
router.put(
  '/videos/:videoId',
  authMiddleware,
  roleMiddleware('admin'),
  videoController.updateVideo
);

// Delete video (Admin only)
router.delete(
  '/videos/:videoId',
  authMiddleware,
  roleMiddleware('admin'),
  videoController.deleteVideo
);

module.exports = router;
