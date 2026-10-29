// backend/src/routes/jobs.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getJobs, getJob, createJob, updateJob, setJobStatus } = require('../controllers/jobController');

const router = express.Router();

// Public endpoints (no auth) for listing and viewing published jobs
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected recruiter endpoints
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.patch('/:id/status', protect, authorize('recruiter'), setJobStatus);

module.exports = router;
