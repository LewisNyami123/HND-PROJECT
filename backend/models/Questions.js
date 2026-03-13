const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['MCQ', 'true-false', 'short-answer'],
    required: [true, 'Question type is required'],
  },
  options: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        if (this.type === 'MCQ') {
          return v && v.length >= 2 && v.length <= 6;
        }
        return true;
      },
      message: 'MCQ questions must have 2-6 options',
    },
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    trim: true,
    validate: {
      validator: function(val) {
        if (this.type === 'MCQ') {
          return this.options.includes(val);
        }
        return true;
      },
      message: 'Correct answer must be one of the options for MCQ'
    }
  },
  topic: { type: String, trim: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  marks: {
    type: Number,
    default: 1,
    min: 1,
  },
  content: {
    type: String, // HTML or JSON from rich editor
    required: true,
  },
  images: [String], // array of uploaded image URLs
}, {
  timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);