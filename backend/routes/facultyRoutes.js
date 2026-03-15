const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getFacultyExams,
  getFacultyResults,
  createExamForFaculty,
  getSingleExam,
  updateExam,
  deleteExam,
  createQuestion,
  getFacultyQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/facultyController');
const { getExamsForFaculty } = require("../controllers/examController");
const { createCA, getCAForFaculty } = require("../controllers/caController");


//  Faculty: view all exams they created
router.get('/exams', protect, restrictTo('faculty'), getFacultyExams);

//  Faculty: view a single exam with questions
router.get('/exams/:id', protect, restrictTo('faculty'), getSingleExam);

//  Faculty: update an exam
router.put('/exams/:id', protect, restrictTo('faculty'), updateExam);

//  Faculty: delete an exam
router.delete('/exams/:id', protect, restrictTo('faculty'), deleteExam);

//  Faculty: create a new exam
router.post('/exams', protect, restrictTo('faculty'), createExamForFaculty);

// Faculty: view results of their students
router.get('/results', protect, restrictTo('faculty'), getFacultyResults);

//  Faculty: create a new question in the question bank
router.post('/questions', protect, restrictTo('faculty'), createQuestion);

//  Faculty: view all questions in their question bank
router.get('/questions', protect, restrictTo('faculty'), getFacultyQuestions);

//  Faculty: view a single question
router.get('/questions/:id', protect, restrictTo('faculty'), getSingleQuestion);

//  Faculty: update a question
router.put('/questions/:id', protect, restrictTo('faculty'), updateQuestion);

//  Faculty: delete a question
router.delete('/questions/:id', protect, restrictTo('faculty'), deleteQuestion);

// GET /api/faculty/exams
router.get("/my-exams", protect, getExamsForFaculty);

// CA routes
router.post("/ca", protect, createCA);
router.get("/ca", protect, getCAForFaculty);

module.exports = router;