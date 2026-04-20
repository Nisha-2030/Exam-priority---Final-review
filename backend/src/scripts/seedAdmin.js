require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      const hasDefaultPassword = await existingAdmin.comparePassword('admin123');
      if (!hasDefaultPassword) {
        existingAdmin.password = 'admin123';
        await existingAdmin.save();
        console.log('✓ Existing admin password reset to admin123 for development.');
      } else {
        console.log('✓ Admin already exists with default password.');
      }
      process.exit(0);
    }

    // Create default admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Change this after first login
      role: 'admin',
    });

    await admin.save();
    console.log('✓ Admin account created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the password after your first login!');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
