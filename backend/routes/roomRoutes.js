const express = require('express');
const router = require('./authRoutes');
const {protect} = require('../middleware/authMiddleware');
const {createRoom, getRooms} = require('../controllers/roomController');

router.post('/',protect,createRoom);
router.get('/',protect,getRooms);

module.exports = router;