const mongoose = require('mongoose');

const doctorEntrySchema = new mongoose.Schema({
  name: String,
  age: Number,
  weight: Number,
  symptoms: [String],
  cause: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DoctorEntry', doctorEntrySchema);
