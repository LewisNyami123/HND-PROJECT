const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Question = require('../models/Questions');
const User = require('../models/User'); // for students
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// 📋 Get all exams created by this faculty
const getFacultyExams = async (req, res) => {
  try {
    const exams = await Exam.find({ faculty: req.user._id }).populate('questions');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📊 Get all results for this faculty’s department
const getFacultyResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name department')
      .populate('exam', 'title course');

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
      questions: req.body.questions
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
const createQuestion = async (req, res) => {
  try {
    const question = new Question({
      ...req.body,
      faculty: req.user._id,
      content: req.body.content || "<p>Placeholder content</p>",
      images: req.body.images || []
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
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

// 👩‍🎓 Get students in faculty’s department
const getFacultyStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student", department: req.user.department });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📤 Export results (CSV, Excel, PDF)
const exportFacultyResults = async (req, res) => {
  try {
    const format = req.query.format || "csv";
    const results = await Result.find().populate("student", "name department").populate("exam", "title course");

    const data = results.map(r => ({
      Student: r.student.name,
      Department: r.student.department,
      Course: r.exam.course,
      Exam: r.exam.title,
      CA: r.caScore,
      ExamScore: r.examScore,
      Total: r.total,
      Grade: r.grade
    }));

    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header("Content-Type", "text/csv");
      res.attachment("results.csv");
      return res.send(csv);
    }

    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Results");
      sheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));
      sheet.addRows(data);
      res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.attachment("results.xlsx");
      await workbook.xlsx.write(res);
      return res.end();
    }

    if (format === "pdf") {
      const doc = new PDFDocument();
      res.header("Content-Type", "application/pdf");
      res.attachment("results.pdf");
      doc.pipe(res);
      data.forEach(row => {
        doc.text(`${row.Student} | ${row.Department} | ${row.Course} | CA:${row.CA} | Exam:${row.ExamScore} | Total:${row.Total} | Grade:${row.Grade}`);
      });
      doc.end();
      return;
    }

    res.status(400).json({ message: "Invalid format" });
  } catch (err) {
    res.status(500).json({ message: "Error exporting results" });
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
  getSingleQuestion,
  getFacultyStudents,
  exportFacultyResults
};
