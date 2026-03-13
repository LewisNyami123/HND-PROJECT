// controllers/examController.js
const Exam = require('../models/Exam');

// Schedule/Create new exam (faculty/admin only)
const scheduleExam = async (req, res) => {
  const { title, course, faculty, level, duration, scheduledTime, room } = req.body;

  try {
    if (!title || !course || !faculty || !level || !duration || !scheduledTime) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const startTime = new Date(scheduledTime);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    // Room conflict check
    if (room) {
      const roomConflict = await Exam.findOne({
        room,
        $or: [
          { scheduledTime: { $lt: endTime }, 
            $expr: { $gte: [{ $add: ['$scheduledTime', { $multiply: ['$duration', 60000] }] }, startTime] }
          },
          { scheduledTime: { $gte: startTime, $lt: endTime } }
        ]
      });

      if (roomConflict) {
        return res.status(400).json({ message: 'Room is already booked during this time' });
      }
    }

    // Level conflict check
    const levelConflict = await Exam.findOne({
      level,
      $or: [
        { scheduledTime: { $lt: endTime }, 
          $expr: { $gte: [{ $add: ['$scheduledTime', { $multiply: ['$duration', 60000] }] }, startTime] }
        },
        { scheduledTime: { $gte: startTime, $lt: endTime } }
      ]
    });

    if (levelConflict) {
      return res.status(400).json({ message: 'Another exam is scheduled for this level at overlapping time' });
    }

    const exam = new Exam({
      title,
      course,
      faculty,
      level,
      duration,
      scheduledTime: startTime,
      room: room || null,
      status: 'pending',
      questions: [], // ensure it's initialized
    });

    await exam.save();

    await exam.populate([
      { path: 'faculty', select: 'name email' },
      { path: 'room', select: 'name capacity' },
    ]);

    res.status(201).json({
      message: 'Exam scheduled successfully',
      exam,
    });
  } catch (err) {
    console.error('Schedule exam error:', err);
    res.status(500).json({ message: 'Failed to schedule exam' });
  }
};

// Get all exams (filtered for students)
const getExams = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student' && req.user.level) {
      query.level = req.user.level;
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

// Get single exam for taking (with questions + time check)
const getExamForTaking = async (req, res) => {
  try {
    const { examId } = req.params;  // <-- use examId

    if (!examId) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }

    const exam = await Exam.findById(examId)
      .populate('questions')
      .select('title duration scheduledTime questions');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const now = new Date();
    const start = new Date(exam.scheduledTime);
    const end = new Date(start.getTime() + exam.duration * 60 * 1000);

    if (now < start) {
      return res.status(400).json({ message: 'Exam has not started yet' });
    }
    if (now > end) {
      return res.status(400).json({ message: 'Exam has ended' });
    }

    const timeLeftSeconds = Math.floor((end - now) / 1000);

    // Shuffle questions for randomness
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

const getExamsForFaculty = async (req, res) => {
  try {
    const exams = await Exam.find({ faculty: req.user._id })
      .populate("questions") // optional: show question details
      .sort({ date: -1 });   // newest first
    res.status(200).json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  scheduleExam,
  getExams,
  getExamForTaking,
  getExamsForFaculty,
};