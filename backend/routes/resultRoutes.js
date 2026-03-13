const express = require('express');
const router = express.Router();
const { submitResults, getResultByExam, getResultsForStudent } = require('../controllers/resultController');
const {protect} = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, submitResults);
router.get('/:examId', protect, getResultByExam);

// NEW: Get all results for logged-in student
router.get('/', protect, getResultsForStudent);


// Seed route for testing purposes
router.post('/seed', protect, async (req, res) => {
  try {
    const sampleResults = [
      {
        student: req.user._id, // logged-in student
        exam: req.body.examId1, // pass a valid Exam _id
        score: 85,
        status: 'passed',
        submissionTime: new Date(),
      },
      {
        student: req.user._id,
        exam: req.body.examId2,
        score: 45,
        status: 'failed',
        submissionTime: new Date(),
      },
    ];

    const results = await Result.insertMany(sampleResults);
    res.json(results);
  } catch (err) {
    console.error('Error seeding results:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;