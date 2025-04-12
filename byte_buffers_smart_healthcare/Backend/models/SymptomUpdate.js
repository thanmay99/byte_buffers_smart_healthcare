const mongoose = require('mongoose');

const symptomUpdateSchema = new mongoose.Schema({
  name: String,
  date: String,
  symptom: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SymptomUpdate', symptomUpdateSchema);
