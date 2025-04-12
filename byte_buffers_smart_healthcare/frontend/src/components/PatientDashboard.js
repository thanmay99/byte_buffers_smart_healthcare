import React, { useState } from 'react';
import './PatientDashboard.css'; // Custom styles

function PatientDashboard() {
  const [name, setName] = useState('');
  const [symptom, setSymptom] = useState('');
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !symptom) {
      alert('Please fill all fields');
      return;
    }
  
    const newEntry = {
      name: name.trim().toLowerCase(),
      date,
      symptom,
    };
  
    try {
      const res = await fetch('http://localhost:5001/api/symptom-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setSymptom('');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to submit symptom update');
    }
  };
  

  return (
    <div className="patient-container">
      <h2 className="patient-heading">Patient Daily Symptom Update</h2>
      <form onSubmit={handleSubmit} className="patient-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="patient-input"
          required
        />
        <input
          type="text"
          value={date}
          readOnly
          className="patient-date"
        />
        <textarea
          placeholder="Describe your symptoms today..."
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          className="patient-textarea"
          rows={4}
          required
        ></textarea>
        <button type="submit" className="patient-button">
          Submit Update
        </button>
      </form>
    </div>
  );
}

export default PatientDashboard;
