// backend/src/routes/recruiter.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getProfile, updateProfile, verifyRecruiter } = require('../controllers/recruiterController');
const { createJob, updateJob, setJobStatus, deleteJob, getJobs, getJob } = require('../controllers/jobController');

const router = express.Router();

// Recruiter profile endpoints (owner only)
router.get('/profile', protect, authorize('recruiter'), getProfile);
router.put('/profile', protect, authorize('recruiter'), updateProfile);

// Recruiter can verify other recruiters – admin only (exposed via admin router, but kept here for completeness)
router.post('/verify', protect, authorize('admin'), verifyRecruiter);

// Job management – recruiter owns the job
router.post('/jobs', protect, authorize('recruiter'), createJob);
router.put('/jobs/:id', protect, authorize('recruiter'), updateJob);
router.patch('/jobs/:id/status', protect, authorize('recruiter'), setJobStatus);
router.delete('/jobs/:id', protect, authorize('recruiter'), deleteJob);

// Public job read routes can be accessed via /api/jobs, but recruiters may also fetch their own jobs
router.get('/jobs', protect, authorize('recruiter'), getJobs);
router.get('/jobs/:id', protect, authorize('recruiter'), getJob);

module.exports = router;
