// controllers/resultController.js
const Result = require('../models/Result');

// Submit exam results (called from exam taking page)
const submitResults = async (req, res) => {
  try {
    const { exam, answers, score } = req.body;

    if (!exam || score === undefined) {
      return res.status(400).json({ message: 'Exam ID and score are required' });
    }

    const result = new Result({
      student: req.user._id,      // Securely set from authenticated user
      exam,
      answers: answers || [],
      score,
      submissionTime: new Date(),
    });

    await result.save();

    // Populate exam title for response
    await result.populate('exam', 'title course');

    res.status(201).json({
      message: 'Results submitted successfully',
      result,
    });
  } catch (err) {
    console.error('Submit results error:', err);
    res.status(500).json({ message: 'Failed to submit results' });
  }
};

// Get result by specific exam (optional — for detailed view)
const getResultByExam = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate('exam', 'title')
      .populate('student', 'name email')
      .sort({ submissionTime: -1 });

    res.status(200).json(results);
  } catch (err) {
    console.error('Get result by exam error:', err);
    res.status(500).json({ message: 'Failed to fetch results' });
  }
};

// Get all results for the logged-in student (used by Results page)
const getResultsForStudent = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('exam', 'title course')
      .sort({ submissionTime: -1 })
      .lean(); // Better performance for read-only

    // Add calculated status (passed/failed)
    const resultsWithStatus = results.map(result => ({
      ...result,
      status: result.score >= 50 ? 'passed' : 'failed',
    }));

    res.status(200).json(resultsWithStatus);
  } catch (err) {
    console.error('Get student results error:', err);
    res.status(500).json({ message: 'Failed to fetch your results' });
  }
};

module.exports = {
  submitResults,
  getResultByExam,
  getResultsForStudent,
};