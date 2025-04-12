// App.js

import React, { useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './Context';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/Home';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import DoctorPinPage from './components/DoctorPinPage'; // import the PIN page
import './App.css';

function App() {
  const { token } = useContext(AuthContext);
  const [symptomUpdates, setSymptomUpdates] = useState([]);
  const [doctorAuthenticated, setDoctorAuthenticated] = useState(false); // for PIN auth

  const handleAddSymptomUpdate = (update) => {
    setSymptomUpdates((prev) => [...prev, update]);
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={token ? <Home /> : <Navigate to="/signup" />} />

        {/* Doctor PIN route */}
        <Route
          path="/doctor-pin"
          element={
            token ? (
              <DoctorPinPage setDoctorAuthenticated={setDoctorAuthenticated} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        {/* Doctor Dashboard only accessible after PIN authentication */}
        <Route
          path="/doctor-dashboard"
          element={
            token && doctorAuthenticated ? (
              <DoctorDashboard symptomUpdates={symptomUpdates} />
            ) : (
              <Navigate to="/doctor-pin" />
            )
          }
        />

        {/* Patient Dashboard */}
        <Route
          path="/patient-dashboard"
          element={
            token ? (
              <PatientDashboard onAddSymptomUpdate={handleAddSymptomUpdate} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
