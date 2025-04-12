const DoctorEntry = require('../models/DoctorEntry');
const SymptomUpdate = require('../models/SymptomUpdate');

const addDoctorEntry = async (req, res) => {
  try {
    const newEntry = new DoctorEntry(req.body);
    await newEntry.save();
    res.status(201).json({ message: 'Doctor entry saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving doctor entry', error });
  }
};

const addSymptomUpdate = async (req, res) => {
  try {
    const newUpdate = new SymptomUpdate(req.body);
    await newUpdate.save();
    res.status(201).json({ message: 'Symptom update saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving symptom update', error });
  }
};

const getAllDoctorEntries = async (req, res) => {
  try {
    const entries = await DoctorEntry.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor entries', error });
  }
};

const getAllSymptomUpdates = async (req, res) => {
  try {
    const updates = await SymptomUpdate.find();
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching symptom updates', error });
  }
};

module.exports = {
  addDoctorEntry,
  addSymptomUpdate,
  getAllDoctorEntries,
  getAllSymptomUpdates,
};
