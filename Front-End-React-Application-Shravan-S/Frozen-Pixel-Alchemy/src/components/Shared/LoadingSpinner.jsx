
import React from 'react';
import '../../stylesheets/LoadingSpinner.css';

// LoadingSpinner component to display a spinner and message while images are loading
const LoadingSpinner = ({ message = "Loading images..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
