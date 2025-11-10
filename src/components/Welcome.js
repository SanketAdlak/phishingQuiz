import React from 'react';

const Welcome = ({ onStart }) => {
  return (
    <div>
      <h1>Welcome to the Phishing Quiz</h1>
      <p>
        This quiz is for educational purposes only and is part of a behavioral economics course project.
      </p>
      <button onClick={onStart}>Start Quiz</button>
    </div>
  );
};

export default Welcome;
