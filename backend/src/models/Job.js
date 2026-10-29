// backend/src/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'RecruiterProfile', required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote'], default: 'Full-time' },
  salaryRange: { type: String },
  logoInitials: { type: String, maxlength: 2 },
  requiredSkills: [{ type: String }], // stored as normalized skill names
  description: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  isClosed: { type: Boolean, default: false },
  expiresAt: { type: Date },
}, { timestamps: true });

// Indexes for search
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 1, location: 1, type: 1 });

module.exports = mongoose.model('Job', jobSchema);
