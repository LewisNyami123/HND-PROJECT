const express = require('express');
const router = express.Router();

const {registerUser, loginUser} = require('../controllers/authController');
const {registerNewUser }= require('../controllers/registrationController');
const { changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// User registration

router.post('/register',  registerUser);
router.post('/login',  loginUser);

router.post('/registerNewUser',  registerNewUser); // ✅ new route for admin registration

router.patch("/change-password", protect, changePassword);


module.exports = router;