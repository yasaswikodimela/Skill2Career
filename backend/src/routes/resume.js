// backend/src/routes/resume.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getResumes,
  uploadResume,
  setPrimary,
  deleteResume,
  downloadResume,
} = require('../controllers/resumeController');

const router = express.Router();

// Resume routes
router.get('/', protect, authorize('student'), getResumes);
router.post('/', protect, authorize('student'), upload.single('file'), uploadResume);
router.patch('/:id/primary', protect, authorize('student'), setPrimary);
router.delete('/:id', protect, authorize('student'), deleteResume);
router.get('/:id/download', protect, authorize('student', 'recruiter', 'admin'), downloadResume);

module.exports = router;
