// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register user (student or recruiter)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { email, password, role, firstName, lastName, companyName } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password and role are required' });
  }
  if (!['student', 'recruiter'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'User with that email already exists' });
    }
    const user = await User.create({ email, password, role, isVerified: role === 'admin' ? true : false });
    // Create profile placeholder
    if (role === 'student') {
      await StudentProfile.create({
        user: user._id,
        email: user.email,
        firstName: firstName || '',
        lastName: lastName || '',
      });
    } else if (role === 'recruiter') {
      await RecruiterProfile.create({
        user: user._id,
        email: user.email,
        companyName: companyName || '',
      });
    }
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user info
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  // req.user is populated by protect middleware
  res.json({ user: req.user });
};

// @desc    Logout (client can just delete token)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  // If using httpOnly cookie we would clear it, but token is stateless.
  res.json({ message: 'Logged out' });
};
