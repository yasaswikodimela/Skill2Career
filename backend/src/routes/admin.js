// backend/src/routes/admin.js
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { listUsers, deleteUser, setRecruiterVerification, removeJob } = require('../controllers/adminController');

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect, authorize('admin'));

// User management
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);

// Recruiter verification (admin can verify/reject)
router.post('/recruiter/verify', setRecruiterVerification);

// Job moderation – remove invalid job listings
router.delete('/jobs/:id', removeJob);

module.exports = router;
