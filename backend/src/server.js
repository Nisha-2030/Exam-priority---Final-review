require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');
const materialRoutes = require('./routes/materialRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Exam Priority Portal API', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', examRoutes);
app.use('/api', quizRoutes);
app.use('/api', progressRoutes);
app.use('/api', materialRoutes);
app.use('/api', videoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
