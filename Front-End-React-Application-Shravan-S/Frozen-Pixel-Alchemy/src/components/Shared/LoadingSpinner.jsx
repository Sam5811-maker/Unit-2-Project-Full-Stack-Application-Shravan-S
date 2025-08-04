import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading images..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
