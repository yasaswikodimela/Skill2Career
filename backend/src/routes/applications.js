// backend/src/routes/applications.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');

const router = express.Router();

// Student applies to a job (jobId param in URL)
router.post('/jobs/:jobId', protect, authorize('student'), applyToJob);

// Student fetch own applications
router.get('/me', protect, authorize('student'), getMyApplications);

// Recruiter fetch applications for a specific job they own
router.get('/recruiter/:jobId', protect, authorize('recruiter'), getJobApplications);

// Recruiter update application status (application id param)
router.patch('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
