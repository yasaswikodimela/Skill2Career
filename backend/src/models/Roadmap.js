// backend/src/models/Roadmap.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
}, { timestamps: true });

const roadmapSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  title: { type: String, required: true }, // e.g., "Frontend Engineer Roadmap"
  tasks: [taskSchema],
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
