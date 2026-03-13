const express = require("express");
const router = express.Router();

// Temporary in-memory notifications
let notifications = [
  { id: 1, text: "Exam 'Math 101' starts in 30 minutes" },
  { id: 2, text: "New exam added: Physics 201" },
  { id: 3, text: "Your profile was updated successfully" }
];

// GET all notifications
router.get("/", (req, res) => {
  res.json(notifications);
});

// POST a new notification (optional for testing)
router.post("/", (req, res) => {
  const { text } = req.body;
  const newNote = { id: Date.now(), text };
  notifications.push(newNote);
  res.status(201).json(newNote);
});

module.exports = router;
