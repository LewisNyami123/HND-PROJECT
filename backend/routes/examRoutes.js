// routes/exam.js
const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  scheduleExam,
  getExams,
  getExamForTaking, // NEW: for starting/taking the exam
} = require('../controllers/examController');

// Apply protect middleware to ALL routes
router.use(protect);

// GET: List all exams (filtered by role/level in controller)
router.get('/', getExams);

// GET: Get single exam details for taking (with questions + time check)
router.get('/take/:id', getExamForTaking);
// router.get('/take/:examId', getExamForTaking);
// POST: Schedule/create new exam — only faculty or admin
router.post(
  '/schedule',
  restrictTo('faculty', 'admin'), // Fixed typo: 'falculty' → 'faculty'
  scheduleExam
);

module.exports = router;