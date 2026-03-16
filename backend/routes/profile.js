const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /api/profile/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('name email role level department photo createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile/me
router.put('/me', protect, upload.single('photo'), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      level: req.body.level,
      department: req.body.department,
    };

    if (req.file) {
      // Upload photo to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "ems_profiles" },
        async (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Image upload failed" });
          }

          updates.photo = result.secure_url;

          const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
          ).select('name email role level department photo createdAt');

          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

          res.json(user);
        }
      );

      uploadStream.end(req.file.buffer);
    } else {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      ).select('name email role level department photo createdAt');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
