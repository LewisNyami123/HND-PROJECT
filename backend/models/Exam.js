const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Exam title is required'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Faculty member is required'],
    },
    level: {
      type: String,
      required: [true, 'Student level (e.g., Level 200) is required'],
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Exam duration is required'],
      min: [30, 'Duration must be at least 30 minutes'],
      max: [300, 'Duration cannot exceed 5 hours'],
    },
    scheduledTime: {
      type: Date,
      required: [true, 'Scheduled date and time is required'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      // Optional — some exams might be online
    },
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'completed'],
      default: 'pending',
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    totalMarks: {
      type: Number,
      default: 100,
      min: 0,
    },
    passMark: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Virtual: Calculate end time
examSchema.virtual('endTime').get(function () {
  if (!this.scheduledTime || !this.duration) return null;
  return new Date(this.scheduledTime.getTime() + this.duration * 60 * 1000);
});

// Index for efficient querying by date and level
examSchema.index({ scheduledTime: 1, level: 1 });
examSchema.index({ status: 1 });

module.exports = mongoose.model('Exam', examSchema);