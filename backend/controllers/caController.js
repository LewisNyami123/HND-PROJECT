const CA = require("../models/CA");

const createCA = async (req, res) => {
  try {
    const ca = await CA.create({
      title: req.body.title,
      course: req.body.course,
      date: req.body.date,
      score: req.body.score,
      maxScore: req.body.maxScore,
      student: req.body.student,
      faculty: req.user._id,
      semester: req.body.semester
    });
    res.status(201).json(ca);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCAForFaculty = async (req, res) => {
  try {
    const caRecords = await CA.find({ faculty: req.user._id }).populate("student");
    res.status(200).json(caRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCA, getCAForFaculty };