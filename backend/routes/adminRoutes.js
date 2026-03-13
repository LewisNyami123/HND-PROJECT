// routes/admin.js

const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAllResults,
  manageUsers,
  createExam,
  getAnalytics,
  deleteUser,
  updateUserRole,
} = require('../controllers/adminController');

// Admin only middleware
const adminOnly = [protect, restrictTo('admin')];

// GET: View all results
router.get('/results', adminOnly, getAllResults);

// GET: Get all users (for management page)
router.get('/users', adminOnly, manageUsers);

// POST: Create new exam
router.post('/exams', adminOnly, createExam);

// GET: Analytics dashboard data
router.get('/analytics', adminOnly, getAnalytics);

// DELETE: Delete a user
router.delete('/users/:id', adminOnly, deleteUser);

// PATCH: Update user role (e.g., promote to faculty/admin)
router.patch('/users/:id/role', adminOnly, updateUserRole);

module.exports = router;