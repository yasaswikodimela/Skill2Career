// backend/src/controllers/adminController.js
const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');

// List all users (admin only)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.deleteOne({ _id: id });
    // Cascade delete related profiles
    await Promise.all([
      RecruiterProfile.deleteOne({ user: id }),
    ]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify or reject a recruiter (admin only)
exports.setRecruiterVerification = async (req, res) => {
  try {
    const { recruiterId, verify } = req.body;
    const recruiter = await RecruiterProfile.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
    recruiter.isVerified = !!verify;
    await recruiter.save();
    res.json({ message: `Recruiter ${verify ? 'verified' : 'rejected'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Moderate (remove) an invalid job listing (admin only)
exports.removeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await Job.deleteOne({ _id: id });
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// (named exports already set above via exports.xxx)
