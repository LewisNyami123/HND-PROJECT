// controllers/adminController.js

const User = require('../models/User');
const Result = require('../models/Result');
const Exam = require('../models/Exam');

// Utility for GPA calculation
function gradePoint(grade) {
  switch (grade) {
    case "A": return 4;
    case "B": return 3;
    case "C": return 2;
    case "D": return 1;
    default: return 0;
  }
}

// 📊 Get all results with populated student and exam data
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate({ path: 'student', select: 'name email role level department' })
      .populate({ path: 'exam', select: 'title course level department' })
      .sort({ submissionTime: -1 })
      .lean();

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Failed to fetch results' });
  }
};

// 👥 Get all users (for Admin Users Management page)
const manageUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role level department createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// ➕ Create a new exam
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

// 📈 Generate analytics: pass rate per exam + GPA distribution
const getAnalytics = async (req, res) => {
  try {
    const results = await Result.find()
      .populate({ path: 'exam', select: 'title' })
      .populate({ path: 'student', select: 'name department' })
      .lean();

    const exams = {};
    const gpaBuckets = { "0-1": 0, "1-2": 0, "2-3": 0, "3-4": 0 };

    results.forEach((r) => {
      const examTitle = r.exam?.title || 'Unknown';
      if (!exams[examTitle]) {
        exams[examTitle] = { total: 0, passed: 0 };
      }
      exams[examTitle].total++;
      if (r.total >= 50) exams[examTitle].passed++;

      // GPA distribution bucket
      const gp = gradePoint(r.grade);
      if (gp < 1) gpaBuckets["0-1"]++;
      else if (gp < 2) gpaBuckets["1-2"]++;
      else if (gp < 3) gpaBuckets["2-3"]++;
      else gpaBuckets["3-4"]++;
    });

    const examAnalytics = Object.keys(exams).map((title) => {
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

    examAnalytics.sort((a, b) => b.passRate - a.passRate);

    res.status(200).json({
      exams: examAnalytics,
      gpaDistribution: gpaBuckets
    });
  } catch (err) {
    console.error('Error generating analytics:', err);
    res.status(500).json({ message: 'Failed to generate analytics' });
  }
};

// 📊 System overview stats
const getSystemStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const facultyCount = await User.countDocuments({ role: "faculty" });
    const adminCount = await User.countDocuments({ role: "admin" });
    const examCount = await Exam.countDocuments();

    res.status(200).json({
      students: studentCount,
      faculty: facultyCount,
      admins: adminCount,
      exams: examCount
    });
  } catch (err) {
    console.error("Error fetching system stats:", err);
    res.status(500).json({ message: "Failed to fetch system stats" });
  }
};

// ❌ Delete a user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

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

// 🔄 Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'faculty', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
  getSystemStats,
  deleteUser,
  updateUserRole,
};
