const express = require('express');
const router = express.Router();

const {registerUser, loginUser} = require('../controllers/authController');

const { changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// User registration

router.post('/register',  registerUser);
router.post('/login',  loginUser);



router.patch("/change-password", protect, changePassword);


module.exports = router;