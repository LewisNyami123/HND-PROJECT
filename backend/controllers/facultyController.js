const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Question = require('../models/Questions'); // <-- new model for question bank

// 📋 Get all exams created by this faculty
const getFacultyExams = async (req, res) => {
  try {
    const exams = await Exam.find({ faculty: req.user._id }).populate('questions');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📊 Get all results for this faculty’s exams
const getFacultyResults = async (req, res) => {
  try {
    const results = await Result.find({ faculty: req.user._id })
      .populate('student exam');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Create a new exam (faculty-owned)
const createExamForFaculty = async (req, res) => {
  try {
    const exam = new Exam({
      ...req.body,
      faculty: req.user._id,
      questions: req.body.questions // array of Question ObjectIds
    });
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Get a single exam with questions
const getSingleExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, faculty: req.user._id })
      .populate('questions');
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update an exam
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      req.body,
      { new: true }
    ).populate('questions');
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete an exam
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, faculty: req.user._id });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📝 Create a new question in the faculty’s question bank
// 📝 Create a new question in the faculty’s question bank
const createQuestion = async (req, res) => {
  try {
    const question = new Question({
      ...req.body,
      faculty: req.user._id,
      content: req.body.content || "<p>Placeholder content</p>", // ensure required field
      images: req.body.images || []
    });

    await question.save();
    console.log("Saved question:", question);
    res.status(201).json(question);
  } catch (err) {
    console.error("Create question error:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// 📋 Get all questions for this faculty
const getFacultyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ faculty: req.user._id });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Get single question
const getSingleQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({ _id: req.params.id, faculty: req.user._id });
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update question
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      req.body,
      { new: true }
    );
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete question
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({ _id: req.params.id, faculty: req.user._id });
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getFacultyExams,
  getFacultyResults,
  createExamForFaculty,
  getSingleExam,
  updateExam,
  deleteExam,
  createQuestion,
  getFacultyQuestions,
  deleteQuestion,
  updateQuestion,
  getSingleQuestion
};