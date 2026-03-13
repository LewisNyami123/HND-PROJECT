const mongoose = require("mongoose");

const examSessionSchema = new mongoose.Schema({
  studentId: String,
  examId: String,
  status: {
    type: String,
    default: "active"
  },
  startTime: Date
});
module.exports = mongoose.model("ExamSession", examSessionSchema);