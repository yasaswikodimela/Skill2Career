// backend/src/controllers/recruiterController.js
const RecruiterProfile = require('../models/RecruiterProfile');
const User = require('../models/User');

// Get recruiter profile (owner only, auto-create placeholder if missing)
exports.getProfile = async (req, res) => {
  try {
    let profile = await RecruiterProfile.findOne({ user: req.user._id }).populate('user', 'email');
    if (!profile) {
      profile = await RecruiterProfile.create({ user: req.user._id, email: req.user.email });
    }
    res.json(profile);
  } catch (err) {
    console.error('Error fetching recruiter profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update recruiter profile (owner only)
exports.updateProfile = async (req, res) => {
  try {
    let profile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await RecruiterProfile.create({ user: req.user._id, email: req.user.email, ...req.body });
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    console.error('Error updating recruiter profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify a recruiter (admin only) – admin will call this endpoint
exports.verifyRecruiter = async (req, res) => {
  try {
    const { recruiterId, verify } = req.body; // recruiterId is RecruiterProfile _id
    const recruiter = await RecruiterProfile.findById(recruiterId);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
    recruiter.isVerified = !!verify;
    await recruiter.save();
    res.json({ message: `Recruiter ${verify ? 'verified' : 'unverified'}` });
  } catch (err) {
    console.error('Error verifying recruiter:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
