// controllers/adminController.js

const User = require('../models/User');
const Result = require('../models/Result');
const Exam = require('../models/Exam');

// Get all results with populated student and exam data
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate({
        path: 'student',
        select: 'name email role level',
      })
      .populate({
        path: 'exam',
        select: 'title course level',
      })
      .sort({ submissionTime: -1 }) // Newest first
      .lean(); // Improves performance for read-only data

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Failed to fetch results' });
  }
};

// Get all users (for Admin Users Management page)
const manageUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role level createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Create a new exam
const createExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();

    res.status(201).json({
      message: 'Exam created successfully',
      exam,
    });
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(400).json({ message: err.message || 'Failed to create exam' });
  }
};

// Generate analytics: pass rate per exam
const getAnalytics = async (req, res) => {
  try {
    const results = await Result.find()
      .populate({
        path: 'exam',
        select: 'title',
      })
      .lean();

    const exams = {};

    results.forEach((r) => {
      const examTitle = r.exam?.title || 'Unknown';
      if (!exams[examTitle]) {
        exams[examTitle] = { total: 0, passed: 0 };
      }
      exams[examTitle].total++;
      if (r.score >= 50) exams[examTitle].passed++;
    });

    const analytics = Object.keys(exams).map((title) => {
      const { total, passed } = exams[title];
      const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
      return {
        title,
        passRate,
        total,
        passed,
        failed: total - passed,
      };
    });

    // Optional: Sort by pass rate or title
    analytics.sort((a, b) => b.passRate - a.passRate);

    res.status(200).json(analytics);
  } catch (err) {
    console.error('Error generating analytics:', err);
    res.status(500).json({ message: 'Failed to generate analytics' });
  }
};

// Delete a user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin account' });
      }
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'faculty', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Prevent demoting the last admin
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot demote the last admin' });
      }
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: 'Role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: 'Failed to update role' });
  }
};

module.exports = {
  getAllResults,
  manageUsers,
  createExam,
  getAnalytics,
  deleteUser,
  updateUserRole,
};