const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

router.get("/exam/:examId", async (req, res) => {

  const results = await Result.find({ examId: req.params.examId });

  const totalStudents = results.length;

  const average =
    results.reduce((sum, r) => sum + r.score, 0) / totalStudents;

  const pass = results.filter(r => r.score >= 50).length;
  const fail = results.filter(r => r.score < 50).length;

  res.json({
    totalStudents,
    average,
    pass,
    fail
  });

});

module.exports = router;