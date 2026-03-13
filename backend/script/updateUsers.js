// scripts/updateUsers.js
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.updateMany(
    { role: "student", level: { $exists: false } },
    { $set: { level: "200" } } // 👈 default level
  );

  console.log("Updated all student users with level 200");
  process.exit();
};

run();