const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ============ PUBLIC - STUDENT ROUTES ============
// Get all materials
router.get('/materials', materialController.getAllMaterials);

// Get materials by subject
router.get('/materials/subject/:subjectId', materialController.getMaterialsBySubject);

// Get materials by topic
router.get('/materials/topic/:topicId', materialController.getMaterialsByTopic);

// Get single material by id
router.get('/materials/:materialId', materialController.getMaterialById);

// ============ PROTECTED - ADMIN ROUTES ============
// Create material (Admin only)
router.post(
  '/materials',
  authMiddleware,
  roleMiddleware('admin'),
  materialController.createMaterial
);

// Update material (Admin only)
router.put(
  '/materials/:materialId',
  authMiddleware,
  roleMiddleware('admin'),
  materialController.updateMaterial
);

// Delete material (Admin only)
router.delete(
  '/materials/:materialId',
  authMiddleware,
  roleMiddleware('admin'),
  materialController.deleteMaterial
);

module.exports = router;
