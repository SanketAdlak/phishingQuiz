import React, { useState } from 'react';

const ConfidenceQuestion = ({ question, onAnswer, submitButtonClassName }) => {
  const [answer, setAnswer] = useState(3);

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
        <div className="slider-wrapper">
          <input
            type="range"
            min="1"
            max="5"
            value={answer}
            className="slider"
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="slider-labels">
            <span>Strongly disagree</span>
            <span>Strongly agree</span>
          </div>
        </div>
      </div>
      <div className="answers">
        <button className={submitButtonClassName} onClick={handleAnswer}>Submit</button>
      </div>
    </div>
  );
};

export default ConfidenceQuestion;
