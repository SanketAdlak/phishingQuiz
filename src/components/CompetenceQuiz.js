import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Question from './Question';
import ProgressBar from './ProgressBar';

const CompetenceQuiz = ({ onComplete }) => {
  const [question, setQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [results, setResults] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const questionRef = useRef(null);

  useEffect(() => {
    fetch('/api/questions/count')
      .then((res) => res.json())
      .then((data) => setTotalQuestions(data.totalQuestions));
  }, []);

  useEffect(() => {
    if (currentQuestionIndex > totalQuestions && totalQuestions > 0) {
      return;
    }
    fetch(`api/question/${currentQuestionIndex}`)
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
    if (results.length > 0 && results.length === totalQuestions) {
      onComplete(results);
    }
  }, [results, totalQuestions, onComplete]);

  if (!question) {
    return <div>Loading...</div>;
  }

  if (results.length === totalQuestions) {
    return <div>Loading next section...</div>;
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
      <ProgressBar current={currentQuestionIndex} total={totalQuestions} />
    </div>
  );
};

export default CompetenceQuiz;
