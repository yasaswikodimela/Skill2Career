// backend/src/controllers/roadmapController.js
const Roadmap = require('../models/Roadmap');
const StudentProfile = require('../models/StudentProfile');

// @desc Get the latest personalized roadmap for the logged-in student
// @route GET /api/roadmap/latest
// @access Private (student only)
exports.getLatestRoadmap = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const roadmap = await Roadmap.findOne({ student: student._id }).sort({ updatedAt: -1 });
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found for student' });
    }

    res.json(roadmap);
  } catch (err) {
    console.error('Error fetching latest roadmap:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get all roadmaps for the logged-in student
// @route GET /api/roadmap
// @access Private (student only)
exports.getAllRoadmaps = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const roadmaps = await Roadmap.find({ student: student._id }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (err) {
    console.error('Error fetching roadmaps:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Create or save a new roadmap
// @route POST /api/roadmap
// @access Private (student only)
exports.createRoadmap = async (req, res) => {
  try {
    const { title, tasks } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Roadmap title is required' });
    }

    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const roadmap = await Roadmap.create({
      student: student._id,
      title,
      tasks: Array.isArray(tasks) ? tasks : [],
    });

    res.status(201).json(roadmap);
  } catch (err) {
    console.error('Error creating roadmap:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update task status on a roadmap
// @route PATCH /api/roadmap/:id/tasks/:taskId
// @access Private (student only)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { status } = req.body;

    const allowed = ['Not Started', 'In Progress', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const roadmap = await Roadmap.findOne({ _id: id, student: student._id });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found or not owned by student' });
    }

    const task = roadmap.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found in roadmap' });
    }

    task.status = status;
    await roadmap.save();

    res.json(roadmap);
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

