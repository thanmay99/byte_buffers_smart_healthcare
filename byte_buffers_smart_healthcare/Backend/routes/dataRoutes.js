const express = require('express');
const {
  addDoctorEntry,
  addSymptomUpdate,
  getAllDoctorEntries,
  getAllSymptomUpdates
} = require('../controllers/dataController');

const router = express.Router();

router.post('/doctor-entry', addDoctorEntry);
router.post('/symptom-update', addSymptomUpdate);
router.get('/doctor-entry', getAllDoctorEntries);
router.get('/symptom-update', getAllSymptomUpdates);

module.exports = router;
