import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function HomePage() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'doctor') {
      navigate('/doctor-dashboard');
    } else if (selectedRole === 'patient') {
      navigate('/patient-dashboard');
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Smart Care Assistant</h1>
      <p className="home-subtitle">Select your role to continue</p>

      <div className="home-buttons">
        <button
          onClick={() => handleSelect('doctor')}
          className="home-button doctor-btn"
        >
          I’m a Doctor
        </button>
        <button
          onClick={() => handleSelect('patient')}
          className="home-button patient-btn"
        >
          I’m a Patient
        </button>
      </div>
    </div>
  );
}

export default HomePage;
