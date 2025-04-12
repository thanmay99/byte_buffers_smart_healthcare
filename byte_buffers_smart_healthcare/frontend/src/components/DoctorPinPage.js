import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorPinPage.css'; // Add your CSS file for styling

function DoctorPinPage({ setDoctorAuthenticated }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPin = '1234';
    if (pin === correctPin) {
      setDoctorAuthenticated(true);
      navigate('/doctor-dashboard');
    } else {
      setError('Incorrect PIN');
    }
  };

  return (
    <div className="pin-container">
      <h2>Enter Doctor PIN</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        <button type="submit">Enter</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default DoctorPinPage;
