import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import symptomsList from './SymptomsList';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Chart from 'chart.js/auto';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const [view, setView] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    symptoms: [],
    cause: '',
  });
  const [patients, setPatients] = useState([]);
  const [symptomUpdates, setSymptomUpdates] = useState([]);
  const chartRef = useRef();

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/doctor-entry');
      const data = await res.json();
      setPatients(data);

      const updatesRes = await fetch('http://localhost:5001/api/symptom-update');
      const updatesData = await updatesRes.json();
      setSymptomUpdates(updatesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymptomChange = (selectedOptions) => {
    const selectedSymptoms = selectedOptions.map(option => option.value);
    setFormData(prev => ({ ...prev, symptoms: selectedSymptoms }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/doctor-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setFormData({ name: '', age: '', weight: '', symptoms: [], cause: '' });
        fetchPatients();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Failed to save patient data');
    }
  };

  const getUpdatesForPatient = (name) =>
    symptomUpdates.filter(entry => entry.name.trim().toLowerCase() === name.trim().toLowerCase());

  const exportPatientPDF = async (patient) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Patient Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${patient.name}`, 20, 40);
    doc.text(`Age: ${patient.age}`, 20, 50);
    doc.text(`Weight: ${patient.weight} kg`, 20, 60);
    doc.text(`Symptoms: ${patient.symptoms.join(', ')}`, 20, 70);
    doc.text(`Diagnosis: ${patient.cause}`, 20, 80);

    const updates = getUpdatesForPatient(patient.name);
    if (updates.length) {
      doc.text(`\nDaily Symptom Updates:`, 20, 95);
      updates.forEach((update, idx) => {
        doc.text(`${update.date}: ${update.symptom}`, 20, 105 + idx * 10);
      });
    }

    doc.save(`${patient.name}_report.pdf`);
  };

  const exportAllPatientsPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('All Patients Summary', 20, 20);
    doc.setFontSize(12);

    let y = 30;
    patients.forEach((p, i) => {
      doc.text(`Patient ${i + 1}:`, 20, y);
      doc.text(`Name: ${p.name}, Age: ${p.age}, Weight: ${p.weight}kg`, 20, y + 10);
      doc.text(`Symptoms: ${p.symptoms.join(', ')}`, 20, y + 20);
      doc.text(`Diagnosis: ${p.cause}`, 20, y + 30);
      y += 45;
    });

    // Generate Symptom Chart
    const chartCanvas = chartRef.current;
    if (chartCanvas) {
      const chartImage = chartCanvas.toDataURL("image/png", 1.0);
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Symptom Distribution', 20, 20);
      doc.addImage(chartImage, 'PNG', 15, 30, 180, 100);
    }

    doc.save('All_Patients_Report.pdf');
  };

  const getSymptomFrequency = () => {
    const symptomCount = {};
    patients.forEach(p => p.symptoms.forEach(sym => {
      symptomCount[sym] = (symptomCount[sym] || 0) + 1;
    }));
    return symptomCount;
  };

  // Sorting patients based on the highest number of symptoms
  const sortedPatients = [...patients].sort((a, b) => b.symptoms.length - a.symptoms.length);

  useEffect(() => {
    if (view === 'database' && patients.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const data = getSymptomFrequency();
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Symptom Count',
            data: Object.values(data),
            backgroundColor: '#4ade80',
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }, [view, patients]);

  return (
    <div className="doctor-dashboard">
      <h2 className="dashboard-title">Doctor Dashboard</h2>

      <div className="view-buttons">
        <button onClick={() => setView('form')} className={view === 'form' ? 'active' : ''}>
          Add Patient
        </button>
        <button onClick={() => setView('database')} className={view === 'database' ? 'active' : ''}>
          Patient Database
        </button>
        <button onClick={() => setView('summary')} className={view === 'summary' ? 'active' : ''}>
          Summary
        </button>
      </div>

      {view === 'form' && (
        <form onSubmit={handleSubmit} className="form-container">
          <input type="text" name="name" placeholder="Patient Name" value={formData.name} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
          <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required />
          <Select options={symptomsList} isMulti onChange={handleSymptomChange}
            value={symptomsList.filter(symptom => formData.symptoms.includes(symptom.value))} placeholder="Select Symptoms" />
          <textarea name="cause" placeholder="Possible Cause" value={formData.cause} onChange={handleChange} rows={2} required />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      )}

      {view === 'database' && (
        <div className="database-container">
          <div className="print-all-btn-container">
            <button onClick={exportAllPatientsPDF} className="submit-button">
              Download All Patients (PDF)
            </button>
          </div>

          {sortedPatients.length === 0 ? (
            <p className="empty-msg">No patients added yet.</p>
          ) : (
            <>
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Age</th><th>Weight</th><th>Symptoms</th><th>Cause</th><th>Updates</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPatients.map((p, i) => {
                    const updates = getUpdatesForPatient(p.name);
                    return (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.age}</td>
                        <td>{p.weight}</td>
                        <td>{p.symptoms.join(', ')}</td>
                        <td>{p.cause}</td>
                        <td>
                          {updates.length > 0 ? (
                            <ul>{updates.map((u, idx) => <li key={idx}><strong>{u.date}:</strong> {u.symptom}</li>)}</ul>
                          ) : 'No updates'}
                        </td>
                        <td>
                          <button onClick={() => exportPatientPDF(p)} className="small-print-button">
                            Download PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <canvas ref={chartRef} style={{ marginTop: "40px", maxWidth: "600px" }} />
            </>
          )}
        </div>
      )}

      {view === 'summary' && (
        <div className="summary-box">
          <h3>Patient Summary</h3>
          <p><strong>Total Patients:</strong> {sortedPatients.length}</p>
          <p><strong>Average Age:</strong> {
            sortedPatients.length ? (sortedPatients.reduce((sum, p) => sum + parseInt(p.age), 0) / sortedPatients.length).toFixed(1) : 'N/A'
          }</p>
          <p><strong>Average Weight:</strong> {
            sortedPatients.length ? (sortedPatients.reduce((sum, p) => sum + parseFloat(p.weight), 0) / sortedPatients.length).toFixed(1) : 'N/A'
          } kg</p>
          <p><strong>Most Common Symptoms:</strong> {
            (() => {
              const freq = getSymptomFrequency();
              const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
              return sorted.slice(0, 3).map(s => s[0]).join(', ') || 'N/A';
            })()
          }</p>
          <p><strong>Patient with Most Symptoms:</strong> {
            sortedPatients.length ? sortedPatients.reduce((a, b) => b.symptoms.length > a.symptoms.length ? b : a).name : 'N/A'
          }</p>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
