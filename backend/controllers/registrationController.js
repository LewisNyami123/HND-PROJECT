const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const registerNewUser = async (req, res) => {
  try {
    const { name, realEmail, role, level, department } = req.body;

    // Generate placeholder email + password
    const tempEmail = `user_${Date.now()}@system.local`;
    const plainPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // Always set email to placeholder
    const user = new User({
      name,
      email: tempEmail,          // ✅ required field satisfied
      password: hashedPassword,
      role,
      level,
      department,
      // optional: store real email separately if you add it to schema
      profileImage: null
    });

    await user.save();

    // Send credentials to real email
    await sendEmail(
      realEmail,
      "Your Dashboard Login",
      `Hello ${name},\n\nYour account has been created.\nEmail: ${tempEmail}\nPassword: ${plainPassword}\n\nYou can log in with these credentials. It is strongly recommended to update your email and password after your first login.`
    );

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role, level: user.level, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
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
module.exports = { registerNewUser };