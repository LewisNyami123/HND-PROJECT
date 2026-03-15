const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // adjust path if needed
require("dotenv").config();


const seedUsers = async () => {
mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany(); // optional: clears users

    const password = await bcrypt.hash("123456",10);

    const users = [

        {
            name: "System Admin",
            email: "admin@ems.com",
            password: password,
            role: "admin",
            level: "N/A",
            department: "Administration"
        },

        {
            name: "Dr Smith",
            email: "faculty@ems.com",
            password: password,
            role: "faculty",
            level: "N/A",
            department: "Computer Engineering"
        },

        {
            name: "John Student",
            email: "student@ems.com",
            password: password,
            role: "student",
            level: "HND1",
            department: "Computer Engineering"
        }

    ];

    await User.insertMany(users);

    console.log("Users Seeded Successfully");

    process.exit();
};

seedUsers();