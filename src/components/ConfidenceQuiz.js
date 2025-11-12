import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import ConfidenceQuestion from './ConfidenceQuestion';
import ProgressBar from './ProgressBar';

const ConfidenceQuiz = ({ onComplete }) => {
  const [question, setQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [results, setResults] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const questionRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/confidence-questions/count')
      .then((res) => res.json())
      .then((data) => setTotalQuestions(data.totalQuestions));
  }, []);

  useEffect(() => {
    if (currentQuestionIndex > totalQuestions && totalQuestions > 0) {
      onComplete(results);
      return;
    }
    fetch(`http://localhost:3001/api/confidence-question/${currentQuestionIndex}`)
      .then((res) => res.json())
      .then((data) => setQuestion(data));
  }, [currentQuestionIndex, totalQuestions, onComplete, results]);

  const handleAnswer = (resultData) => {
    setResults([...results, resultData]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz">
      <h1>Confidence Test</h1>
      <SwitchTransition>
        <CSSTransition
          key={currentQuestionIndex}
          nodeRef={questionRef}
          timeout={500}
          classNames="question"
        >
          <ConfidenceQuestion
            ref={questionRef}
            question={question}
            onAnswer={handleAnswer}
            submitButtonClassName="confidence-submit-btn"
          />
        </CSSTransition>
      </SwitchTransition>
      <ProgressBar current={currentQuestionIndex} total={totalQuestions} />
    </div>
  );
};

export default ConfidenceQuiz;
