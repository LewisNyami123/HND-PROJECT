// controllers/profileController.js
const User = require("../models/User");

// GET /api/profile/me
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// PUT /api/profile/me
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.level = req.body.level || user.level;
    user.department = req.body.department || user.department;

    if (req.file) {
      user.photo = req.file.path; // assuming multer handles file upload
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { getProfile, updateProfile };
