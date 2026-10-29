// backend/src/controllers/resumeController.js
const Resume = require('../models/Resume');
const StudentProfile = require('../models/StudentProfile');
const path = require('path');
const fs = require('fs');

// Configure storage directory (outside repo for security)
const UPLOAD_DIR = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Get list of resumes for current student
exports.getResumes = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    const resumes = await Resume.find({ student: profile._id });
    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload a new resume (handled by multer in route)
exports.uploadResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    // Save metadata
    const resume = await Resume.create({
      student: profile._id,
      originalName: file.originalname,
      storagePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
    });
    res.status(201).json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set a resume as primary
exports.setPrimary = async (req, res) => {
  try {
    const { id } = req.params; // resume id
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    const resume = await Resume.findOne({ _id: id, student: profile._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    // Unset any existing primary
    await Resume.updateMany({ student: profile._id }, { isPrimary: false });
    resume.isPrimary = true;
    await resume.save();
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a resume
exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    const resume = await Resume.findOne({ _id: id, student: profile._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    // Delete file from storage safely
    try {
      if (fs.existsSync(resume.storagePath)) {
        fs.unlinkSync(resume.storagePath);
      }
    } catch (fsErr) {
      console.warn('Could not remove file on disk:', fsErr.message);
    }
    await Resume.deleteOne({ _id: resume._id });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Secure download (accessible by owning student, recruiting company, or admin)
exports.downloadResume = async (req, res) => {
  try {
    const { id } = req.params;
    let resume = null;

    if (req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      resume = await Resume.findOne({ _id: id, student: profile._id });
    } else if (req.user.role === 'recruiter' || req.user.role === 'admin') {
      resume = await Resume.findById(id);
    }

    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (!fs.existsSync(resume.storagePath)) {
      return res.status(404).json({ message: 'Resume file not found on server disk' });
    }

    res.download(resume.storagePath, resume.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
