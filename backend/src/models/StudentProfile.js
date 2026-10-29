// backend/src/models/StudentProfile.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
});

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  fieldOfStudy: String,
  startYear: Number,
  endYear: Number,
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  technologies: [String],
});

const certificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  issueDate: Date,
  credentialId: String,
  credentialUrl: String,
});

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  email: { type: String, required: true }, // duplicate for quick read
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  location: { type: String },
  college: { type: String },
  degree: { type: String },
  graduationYear: { type: Number },
  careerGoal: { type: String },
  bio: { type: String },
  skills: [skillSchema],
  education: [educationSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
