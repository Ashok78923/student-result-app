const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');
const User = require('./models/User');
const authenticateToken = require('./middleware/auth');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://student-result-app-d741.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

/* ========== LOGIN ========== */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('🛂 Login attempt:', username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Login successful, sending token...');
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ... (rest of the routes remain unchanged)

/* ========== START SERVER ========== */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});