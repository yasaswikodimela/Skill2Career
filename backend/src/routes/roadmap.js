// backend/src/routes/roadmap.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getLatestRoadmap,
  getAllRoadmaps,
  createRoadmap,
  updateTaskStatus,
} = require('../controllers/roadmapController');

const router = express.Router();

// All roadmap routes are protected and student-only
router.get('/latest', protect, authorize('student'), getLatestRoadmap);
router.get('/', protect, authorize('student'), getAllRoadmaps);
router.post('/', protect, authorize('student'), createRoadmap);
router.patch('/:id/tasks/:taskId', protect, authorize('student'), updateTaskStatus);

module.exports = router;

