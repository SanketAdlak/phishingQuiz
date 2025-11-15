import React, { useState } from 'react';

const ConfidenceQuestion = React.forwardRef(({ question, onAnswer, submitButtonClassName }, ref) => {
  const [answer, setAnswer] = useState(null);

  const handleAnswer = () => {
    if (answer === null) return;
    onAnswer({
      questionId: question.id,
      answer,
      type: 'confidence',
    });
  };

  return (
    <div className="question-container" ref={ref}>
      <div className="question-header">
        <h2>{question.text}</h2>
      </div>
      <div className="slider-container">
        <div className="slider-wrapper">
          <input
            type="range"
            min="1"
            max="10"
            value={answer || ''}
            className="slider"
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="slider-labels">
            <span>Not at all Confident</span>
            <span>Very Confident</span>
          </div>
          {answer && <div className="slider-score">{answer}/10</div>}
        </div>
      </div>
      <div className="answers">
        <button
          className={submitButtonClassName}
          onClick={handleAnswer}
          disabled={answer === null}
        >
          Submit
        </button>
      </div>
    </div>
  );
});

export default ConfidenceQuestion;

