// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { createRoom, getRooms } = require('../controllers/roomController');

// Faculty/Admin: create a new room
router.post('/', protect, restrictTo('admin', 'faculty'), createRoom);

// Faculty/Admin: view all rooms
router.get('/', protect, restrictTo('admin', 'faculty'), getRooms);

module.exports = router;
