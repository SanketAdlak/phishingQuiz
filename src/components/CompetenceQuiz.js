import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Question from './Question';
import ProgressBar from './ProgressBar';

const CompetenceQuiz = ({ onComplete, confidenceResults }) => {
  const [question, setQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [results, setResults] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const isSubmittingRef = useRef(false);
  const questionRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/questions/count')
      .then((res) => res.json())
      .then((data) => setTotalQuestions(data.totalQuestions));
  }, []);

  useEffect(() => {
    if (currentQuestionIndex > totalQuestions && totalQuestions > 0) {
      return;
    }
    fetch(`http://localhost:3001/api/question/${currentQuestionIndex}`)
      .then((res) => res.json())
      .then((data) => setQuestion(data));
  }, [currentQuestionIndex, totalQuestions]);

  const handleAnswer = (resultData) => {
    const result = {
      ...resultData,
      questionId: question.id,
      type: 'competence',
    };

    setResults([...results, result]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  useEffect(() => {
    if (results.length > 0 && results.length === totalQuestions && !isSubmittingRef.current) {
      isSubmittingRef.current = true;
      const allResults = [...confidenceResults, ...results];
      fetch('http://localhost:3001/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allResults),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          onComplete();
        })
        .catch((error) => console.error('Error:', error));
    }
  }, [results, totalQuestions, onComplete, confidenceResults]);

  if (!question) {
    return <div>Loading...</div>;
  }

  if (results.length === totalQuestions) {
    return <div>Submitting results...</div>;
  }

  return (
    <div className="quiz">
      <h1>Competence Test</h1>
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
      <ProgressBar current={currentQuestionIndex} total={totalQuestions} />
    </div>
  );
};

export default CompetenceQuiz;
