// backend/src/models/SkillAssessment.js
const mongoose = require('mongoose');

const skillAssessmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: false },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  relatedSkills: [{ type: String }],
  matchScore: { type: Number },
  explanation: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('SkillAssessment', skillAssessmentSchema);
