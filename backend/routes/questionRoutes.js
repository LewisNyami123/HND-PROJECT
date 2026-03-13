
const express = require('express');
const router = express.Router();
const {createQuestion} = require('../controllers/questionController');
const {protect} = require('../middleware/authMiddleware');

// POST /api/questions
router.post('/', protect,createQuestion);
module.exports = router;