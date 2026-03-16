const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
// const sendSMS = require('../utils/sendSMS'); // optional Twilio helper

const registerUser = async (req, res) => {
  const { name, email, password, role, level, department } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate password if not provided
    const plainPassword = password || crypto.randomBytes(6).toString("hex");

    // Hash for storage
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const user = new User({ name, email, password: hashedPassword, role, level, department });
    await user.save();

    // Send credentials via email
    await sendEmail(
      email,
      "Your Dashboard Login",
      `Hello ${name},\n\nYour account has been created.\nEmail: ${email}\nPassword: ${plainPassword}\n\nPlease log in and change your password.`
    );

    // Optionally send SMS if phone number is available
    // await sendSMS(user.phone, `Login: ${email}, Password: ${plainPassword}`);

    // Generate token immediately
    const token = jwt.sign(
      { id: user._id, role: user.role, level: user.level, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, role: user.role, level: user.level, department: user.department }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};



const loginUser = async (req, res)=>{
    const {email, password}= req.body;

    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message:'Invalid credentials'});

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message:'Invalid credentials'});

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            level: user.level,
            department: user.department
           }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({token, user: {id: user._id, name: user.name, role: user.role, level: user.level, department: user.department}});
    } catch(err){
        res.status(500).json({message:err.message});

    }
   
} 

module.exports = {registerUser, loginUser}