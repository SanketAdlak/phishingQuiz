import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Question from './Question';

const Quiz = ({ onComplete }) => {
  const [question, setQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [results, setResults] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const questionRef = useRef(null);

  useEffect(() => {
    // This is a simplified way to get the total number of questions.
    // In a real application, you might have a separate endpoint for this.
    setTotalQuestions(3);
    fetch(`http://localhost:3001/api/question/${currentQuestionIndex}`)
      .then((res) => res.json())
      .then((data) => setQuestion(data));
  }, [currentQuestionIndex]);

  const handleAnswer = (resultData) => {
    const result = {
      questionId: question.id,
      answer: resultData.answer,
      timeTaken: resultData.timeTaken,
      clickedPhishingLink: resultData.clickedPhishingLink,
    };

    setResults([...results, result]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  useEffect(() => {
    if (results.length > 0 && results.length === totalQuestions) {
      fetch('http://localhost:3001/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'your-default-api-key',
        },
        body: JSON.stringify(results),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          onComplete();
        })
        .catch((error) => console.error('Error:', error));
    }
  }, [results, totalQuestions, onComplete]);

  if (!question) {
    return <div>Loading...</div>;
  }

  if (results.length === totalQuestions) {
    return <div>Submitting results...</div>;
  }

  return (
    <div className="quiz">
      <SwitchTransition>
        <CSSTransition
          key={currentQuestionIndex}
          nodeRef={questionRef}
          timeout={500}
          classNames="question"
        >
          <Question ref={questionRef} question={question} onAnswer={handleAnswer} />
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default Quiz;
