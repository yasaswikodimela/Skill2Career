// backend/src/routes/auth.js
const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Register (student or recruiter) – rate limited
router.post('/register', authLimiter, register);

// Login – rate limited
router.post('/login', authLimiter, login);

// Get current user (protected)
router.get('/me', protect, getMe);

// Logout (dummy)
router.post('/logout', protect, logout);

module.exports = router;
