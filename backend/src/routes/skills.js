// backend/src/routes/skills.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { analyzeSkills, getAssessments } = require('../controllers/skillController');
const { geminiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All skill analysis endpoints are for students
router.post('/analyze', protect, authorize('student'), geminiLimiter, analyzeSkills);
router.get('/assessments', protect, authorize('student'), getAssessments);

module.exports = router;
