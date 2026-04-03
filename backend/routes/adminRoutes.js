const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getAllResults,
  manageUsers,
  createExam,
  getAnalytics,
  deleteUser,
  updateUserRole,
  getStats, // ✅ import new controller
} = require("../controllers/adminController");

const adminOnly = [protect, restrictTo("admin")];

// Existing routes...
router.get("/results", adminOnly, getAllResults);
router.get("/users", adminOnly, manageUsers);
router.post("/exams", adminOnly, createExam);
router.get("/analytics", adminOnly, getAnalytics);
router.delete("/users/:id", adminOnly, deleteUser);
router.patch("/users/:id/role", adminOnly, updateUserRole);

// ✅ New stats route
router.get("/stats", adminOnly, getStats);

module.exports = router;
