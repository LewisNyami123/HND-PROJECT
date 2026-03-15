// controllers/examController.js
const Exam = require('../models/Exam');
const { upsertResult } = require("./resultController");

// Schedule/Create new exam (faculty/admin only)
const scheduleExam = async (req, res) => {
  const { title, course, level, department, duration, scheduledTime, roomId } = req.body;

  try {
    if (!title || !course || !level || !department || !duration || !scheduledTime) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const exam = new Exam({
      title,
      course,
      faculty: req.user._id,
      level,
      department,
      duration,
      scheduledTime,
      room: roomId || null
    });

    await exam.save();
    res.status(201).json({ message: "Exam scheduled successfully", exam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to schedule exam" });
  }
};

// Faculty submits Exam marks (out of 70)
const submitExamScore = async (req, res) => {
  try {
    const { examId, studentId, examScore, credits } = req.body;

    if (!examScore || examScore > 70) {
      return res.status(400).json({ message: "Exam score must be provided and <= 70" });
    }

    // Delegate to ResultController
    return upsertResult({
      body: { examId, studentId, examScore, credits },
      user: req.user
    }, res);

  } catch (err) {
    console.error("Submit exam score error:", err);
    res.status(500).json({ message: "Failed to submit exam score" });
  }
};
const getExams = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student' && req.user.level && req.user.department) {
      query.level = req.user.level;
      query.department = req.user.department;
    }
    const exams = await Exam.find(query)
      .populate('faculty', 'name')
      .populate('room', 'name')
      .sort({ scheduledTime: 1 })
      .lean();
    res.json(exams);
  } catch (err) {
    console.error('Get exams error:', err);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

// Get single exam for taking
const getExamForTaking = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id)
      .populate('questions')
      .select('title duration scheduledTime questions');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const now = new Date();
    const start = new Date(exam.scheduledTime);
    const end = new Date(start.getTime() + exam.duration * 60 * 1000);

    if (now < start) return res.status(400).json({ message: 'Exam has not started yet' });
    if (now > end) return res.status(400).json({ message: 'Exam has ended' });

    const timeLeftSeconds = Math.floor((end - now) / 1000);
    const shuffledQuestions = exam.questions.sort(() => Math.random() - 0.5);

    res.json({
      _id: exam._id,
      title: exam.title,
      duration: exam.duration,
      questions: shuffledQuestions,
      timeLeftSeconds,
    });
  } catch (err) {
    console.error('Get exam for taking error:', err);
    res.status(500).json({ message: 'Server error loading exam' });
  }
};

module.exports = {
  scheduleExam,
  submitExamScore,
  getExams,
  getExamForTaking
};
