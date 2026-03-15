const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    submittedAnswer: { type: String },
  }],
  caScore: { type: Number, default: 0 },      // out of 30
  examScore: { type: Number, default: 0 },    // out of 70
  total: { type: Number, default: 0 },        // caScore + examScore
  grade: { type: String },                    // A, B, C, D, F
  credits: { type: Number, default: 3 },      // course credits
  submissionTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
