// backend/src/routes/student.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/studentController');
const { getResumes, uploadResume, setPrimary, deleteResume, downloadResume } = require('../controllers/resumeController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/profile', protect, authorize('student'), getProfile);
router.put('/profile', protect, authorize('student'), updateProfile);

// Resume endpoints (student only)
router.get('/resumes', protect, authorize('student'), getResumes);
router.post('/resumes', protect, authorize('student'), upload.single('file'), uploadResume);
router.patch('/resumes/:id/primary', protect, authorize('student'), setPrimary);
router.delete('/resumes/:id', protect, authorize('student'), deleteResume);
router.get('/resumes/:id/download', protect, authorize('student'), downloadResume);

module.exports = router;
