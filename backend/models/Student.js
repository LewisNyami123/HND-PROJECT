const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  studentId: String,
  level: String,
  department: String,
  status: {
    type: String,
    default: "active"
  }
}, { timestamps: true });
module.exports = mongoose.model("Student", studentSchema);
