import React from 'react';

const Welcome = ({ onStart }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Digital Safety Study</h1>
        <p className="welcome-subtitle">
          This 10-minute 3-part study is a component of a behavioural economics course project. All scenarios are simulated and for educational purposes only. Your responses are completely anonymous!
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
