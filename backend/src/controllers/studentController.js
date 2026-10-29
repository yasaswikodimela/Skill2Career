// backend/src/controllers/studentController.js
const StudentProfile = require('../models/StudentProfile');

// Get current student's profile (auto-create if missing)
exports.getProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({ user: req.user._id, email: req.user.email });
    }
    res.json(profile);
  } catch (err) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile (partial)
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    let profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    console.error('Error updating student profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
