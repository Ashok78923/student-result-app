const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config(); // For local development

const Student = require('./models/Student');
const User = require('./models/User');
const authenticateToken = require('./middleware/auth');

// Middleware
app.use(cors({
  // You can set a FRONTEND_URL variable in Render or it will default to your Vercel URL
  origin: process.env.FRONTEND_URL || 'https://student-result-app-d741.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- FIX: Added a console.log for debugging and changed MONGODB_URI to MONGO_URI ---
console.log("Attempting to connect with MONGO_URI:", process.env.MONGO_URI);

// Connect MongoDB using the MONGO_URI from Render's environment variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));
// ------------------------------------------------------------------------------------


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

    // Use JWT_SECRET from Render's environment variables
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

/* ========== GET ALL STUDENTS ========== */
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    let students = await Student.find();
    students = students.map(s => ({
      ...s._doc,
      status: s.status || (s.marks >= 33 ? 'Pass' : 'Fail')
    }));
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

/* ========== GET SINGLE STUDENT BY ID ========== */
app.get('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (!student.status) {
      student.status = student.marks >= 33 ? 'Pass' : 'Fail';
    }
    res.json(student);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

/* ========== ADD NEW STUDENT ========== */
app.post('/api/students', authenticateToken, async (req, res) => {
  const { name, marks } = req.body;
  if (!name || marks == null) {
    return res.status(400).json({ error: 'Name and marks are required' });
  }

  try {
    const status = marks >= 33 ? 'Pass' : 'Fail';
    const student = new Student({ name, marks, status });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

/* ========== UPDATE STUDENT ========== */
app.put('/api/students/:id', authenticateToken, async (req, res) => {
  const { name, marks } = req.body;
  try {
    const status = marks >= 33 ? 'Pass' : 'Fail';
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, marks, status },
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });

    res.json(updatedStudent);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

/* ========== DELETE STUDENT ========== */
app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Student not found' });

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});


/* ========== START SERVER ========== */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});