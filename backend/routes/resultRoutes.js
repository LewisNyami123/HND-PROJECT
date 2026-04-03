const express = require('express');
const router = express.Router();
const { upsertResult, getResultByExam, getResultsForStudent } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, upsertResult);
router.get('/:examId', protect, getResultByExam);

// NEW: Get all results for logged-in student
router.get('/', protect, getResultsForStudent);

// Seed route for testing purposes
// router.post('/seed', protect, async (req, res) => {
//   try {
//     const sampleResults = [
//       {
//         student: req.user._id,
//         exam: req.body.examId1,
//         caScore: 25,
//         examScore: 60,
//         total: 85,
//         grade: "A",
//         submissionTime: new Date(),
//       },
//       {
//         student: req.user._id,
//         exam: req.body.examId2,
//         caScore: 15,
//         examScore: 30,
//         total: 45,
//         grade: "F",
//         submissionTime: new Date(),
//       },
//     ];

//     const results = await Result.insertMany(sampleResults);
//     res.json(results);
//   } catch (err) {
//     console.error('Error seeding results:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;
