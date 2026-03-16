// controllers/caController.js
const { upsertResult } = require("./resultController");

// Faculty enters CA marks (out of 30)
const submitCA = async (req, res) => {
  try {
    const { examId, studentId, caScore, credits } = req.body;

    if (!caScore || caScore > 30) {
      return res.status(400).json({ message: "CA score must be provided and <= 30" });
    }

    // Delegate to ResultController
    return upsertResult({
      body: { examId, studentId, caScore, credits },
      user: req.user
    }, res);

  } catch (err) {
    console.error("Submit CA error:", err);
    res.status(500).json({ message: "Failed to submit CA score" });
  }
};
const getCAForFaculty = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name department")
      .populate("exam", "title course faculty")
      .where("exam.faculty").equals(req.user._id);

    res.json(results);
  } catch (err) {
    console.error("Get CA for faculty error:", err);
    res.status(500).json({ message: "Failed to fetch CA results" });
  }
};

module.exports = { submitCA , getCAForFaculty};
