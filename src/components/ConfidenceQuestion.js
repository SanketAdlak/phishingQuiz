import React, { useState } from 'react';

const ConfidenceQuestion = ({ question, onAnswer, submitButtonClassName }) => {
  const [answer, setAnswer] = useState(5);

  const handleAnswer = () => {
    onAnswer({
      questionId: question.id,
      answer,
      type: 'confidence',
    });
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <h2>{question.question}</h2>
      </div>
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="10"
          value={answer}
          className="slider"
          onChange={(e) => setAnswer(e.target.value)}
        />
        <div className="slider-value">{answer}</div>
      </div>
      <div className="answers">
        <button className={submitButtonClassName} onClick={handleAnswer}>Submit</button>
      </div>
    </div>
  );
};

export default ConfidenceQuestion;
