const express = require('express');
const ExamSession = require('../models/ExamSession')



// start exam
router.post("/start", async (req, res) => {
  const session = await ExamSession.create(req.body);
  res.json(session);
});

// active exams
router.get("/active", async (req, res) => {
  const sessions = await ExamSession.find({ status: "active" });
  res.json(sessions);
});

module.exports = router;