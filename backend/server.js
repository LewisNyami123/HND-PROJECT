const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const roomRoutes = require('./routes/roomRoutes');
const resultRoutes = require('./routes/resultRoutes');
const notificationsRoutes = require("./routes/notifications");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/adminRoutes");
const facultyRoutes = require('./routes/facultyRoutes')
const studentRoutes = require('./routes/studentRoutes');
const analyticsRoutes = require('./routes/analyticRoutes');
const app = express();

// Connect Database
connectDB();

// cors configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://exam-system-tan.vercel.app'
    ];

    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/results',resultRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes)
app.use('/api/students', studentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
