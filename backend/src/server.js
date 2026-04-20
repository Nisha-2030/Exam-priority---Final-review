require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set. Using a development fallback secret.');
  console.warn('   Add JWT_SECRET to your .env file in backend/ if you want a persistent secret.');
  process.env.JWT_SECRET = 'exampriority_dev_secret';
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');
const materialRoutes = require('./routes/materialRoutes');
const videoRoutes = require('./routes/videoRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Ensure a default admin exists for development/testing
const User = require('./models/User');
const seedDefaultAdmin = async () => {
  try {
    const admin = await User.findOne({ email: 'admin@example.com', role: 'admin' });
    if (!admin) {
      await new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      }).save();
      console.log('✓ Default admin created: admin@example.com / admin123');
      console.log('⚠️  Please change this password after first login.');
    } else if (process.env.NODE_ENV !== 'production') {
      const isDefaultPasswordValid = await admin.comparePassword('admin123');
      if (!isDefaultPasswordValid) {
        admin.password = 'admin123';
        await admin.save();
        console.log('✓ Existing admin password reset to admin123 for local development.');
        console.log('⚠️  Update the password after signing in.');
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not seed default admin:', error.message);
  }
};

// Middleware
app.use(cors());
app.use(express.json());

const startServer = async () => {
  await connectDB();
  await seedDefaultAdmin();

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`✗ Port ${PORT} is already in use. Is another backend instance running?`);
      console.error('  If so, stop the existing process or change PORT in backend/.env.');
      process.exit(1);
    }
    throw error;
  });
};

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
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

startServer();
