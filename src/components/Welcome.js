import React from 'react';

const Welcome = ({ onStart }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Phishing Awareness Quiz</h1>
        <p className="welcome-subtitle">
          Test your ability to spot phishing attacks.
        </p>
        <p className="welcome-description">
          This quiz is for educational purposes only and is part of a behavioral
          economics course project.
        </p>
        <button onClick={onStart} className="btn btn-start">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Welcome;
