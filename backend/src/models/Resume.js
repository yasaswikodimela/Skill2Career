// backend/src/models/Resume.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  originalName: { type: String, required: true },
  storagePath: { type: String, required: true }, // server filesystem path (private)
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  isPrimary: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
