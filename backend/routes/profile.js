// routes/profile.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Multer for photo upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

 // GET my profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('name email role level photo createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update my profile (with photo)
router.put('/me', protect, upload.single('photo'), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      level: req.body.level,
    };

    if (req.file) {
      updates.photo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('name email role level photo');

    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;