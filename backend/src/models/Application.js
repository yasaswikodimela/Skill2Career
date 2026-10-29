// backend/src/models/Application.js
const mongoose = require('mongoose');

const statusEnum = ['Applied', 'Screening', 'Interview', 'Selected', 'Rejected', 'Withdrawn'];

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  coverLetter: { type: String },
  status: { type: String, enum: statusEnum, default: 'Applied' },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Compound unique index to prevent duplicate applications
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
