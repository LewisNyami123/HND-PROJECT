// controllers/resultController.js
const Result = require('../models/Result');

// Utility functions
function calculateGrade(total) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 40) return "D";
  return "F";
}

function gradePoint(grade) {
  switch (grade) {
    case "A": return 4;
    case "B": return 3;
    case "C": return 2;
    case "D": return 1;
    default: return 0;
  }
}

function calculateGPA(results) {
  let totalCredits = 0, totalPoints = 0;
  results.forEach(r => {
    const credits = r.credits || 3;
    totalCredits += credits;
    totalPoints += gradePoint(r.grade) * credits;
  });
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
}

// 🔹 Update or create result when CA or Exam score is submitted
const upsertResult = async (req, res) => {
  try {
    const { examId, studentId, caScore, examScore, credits } = req.body;

    if (!examId || !studentId) {
      return res.status(400).json({ message: "Exam ID and Student ID are required" });
    }

    // Find existing result for this student + exam
    let result = await Result.findOne({ exam: examId, student: studentId });

    if (!result) {
      result = new Result({
        student: studentId,
        exam: examId,
        credits: credits || 3,
      });
    }

    // Update CA or Exam score if provided
    if (caScore !== undefined) {
      if (caScore > 30) return res.status(400).json({ message: "CA score must be <= 30" });
      result.caScore = caScore;
    }
    if (examScore !== undefined) {
      if (examScore > 70) return res.status(400).json({ message: "Exam score must be <= 70" });
      result.examScore = examScore;
    }

    // Recalculate total + grade
    result.total = (result.caScore || 0) + (result.examScore || 0);
    result.grade = calculateGrade(result.total);
    result.submissionTime = new Date();

    await result.save();
    await result.populate("exam", "title course");

    res.status(201).json({
      message: "Result updated successfully",
      result,
    });
  } catch (err) {
    console.error("Upsert result error:", err);
    res.status(500).json({ message: "Failed to update result" });
  }
};

// 🔹 Get result by exam
const getResultByExam = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate("exam", "title course")
      .populate("student", "name email department")
      .sort({ submissionTime: -1 });

    res.status(200).json(results);
  } catch (err) {
    console.error("Get result by exam error:", err);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};

// 🔹 Get all results for logged-in student + GPA
const getResultsForStudent = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate("exam", "title course")
      .populate("student", "name email department") 
      .sort({ submissionTime: -1 })
      .lean();

    const resultsWithStatus = results.map(r => ({
      ...r,
      status: r.total >= 50 ? "passed" : "failed",
    }));

    const gpa = calculateGPA(resultsWithStatus);

    res.status(200).json({ results: resultsWithStatus, gpa });
  } catch (err) {
    console.error("Get student results error:", err);
    res.status(500).json({ message: "Failed to fetch your results" });
  }
};

module.exports = {
  upsertResult,
  getResultByExam,
  getResultsForStudent,
};
