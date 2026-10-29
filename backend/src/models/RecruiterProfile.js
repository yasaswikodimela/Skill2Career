// backend/src/models/RecruiterProfile.js
const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  email: { type: String, required: true }, // duplicate for quick read
  companyName: { type: String },
  website: { type: String },
  description: { type: String },
  logoInitials: { type: String, maxlength: 2 },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
