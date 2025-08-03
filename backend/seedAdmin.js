const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config(); // Loads environment variables from .env file

// --- You can change the admin credentials here ---
const adminUsername = 'admin';
const adminPassword = 'password123'; // Choose a secure password
// ------------------------------------------------

const seedAdmin = async () => {
  // Check if the MONGO_URI is available
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not found. Make sure it is in your .env file in the backend folder.');
    process.exit(1);
  }

  try {
    // Connect to the live MongoDB Atlas database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas...');

    // Check if the admin user already exists to avoid duplicates
    const existingAdmin = await User.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists.');
      return;
    }

    // If admin does not exist, create it
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      username: adminUsername,
      password: hashedPassword,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');

  } catch (error) {
    console.error('❌ Error during admin user seeding:', error);
  } finally {
    // Always disconnect from the database when done
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedAdmin();