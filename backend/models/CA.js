const mongoose = require("mongoose");

const caSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  date: { type: Date, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  semester: { type: String, required: true } // e.g. "Semester 1 2025/2026"
});

module.exports = mongoose.model("CA", caSchema);