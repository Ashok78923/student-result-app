const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marks: { type: Number, required: true },
  status: { type: String, enum: ['Pass', 'Fail'], required: true }
});

module.exports = mongoose.model('Student', studentSchema);
