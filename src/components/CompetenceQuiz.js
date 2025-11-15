import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Question from './Question';
import ProgressBar from './ProgressBar';

const CompetenceQuiz = ({ onComplete, part }) => {
  const [question, setQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [results, setResults] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const questionRef = useRef(null);

  useEffect(() => {
    fetch(`/api/questions${part}/count`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setTotalQuestions(data.totalQuestions))
      .catch((error) => console.error('Error fetching question count:', error));
  }, [part]);

  useEffect(() => {
    if (currentQuestionIndex > totalQuestions && totalQuestions > 0) {
      return;
    }
    const questionIdToFetch = part === 2 ? currentQuestionIndex + 10 : currentQuestionIndex;
    fetch(`/api/question${part}/${questionIdToFetch}`)
      .then((res) => {
        if (!res.ok) {
          res.text().then(text => {
            console.error('Error fetching question: Non-OK response', text);
          });
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return res.json();
        } else {
          res.text().then(text => {
            console.error('Error fetching question: Not a JSON response', text);
          });
          throw new Error("Response was not JSON");
        }
      })
      .then((data) => setQuestion(data))
      .catch((error) => console.error('Error fetching question:', error));
  }, [currentQuestionIndex, totalQuestions, part]);

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
    if (totalQuestions > 0 && results.length === totalQuestions) {
      onComplete(results);
    }
  }, [results, totalQuestions, onComplete]);

  if (!question) {
    return <div>Loading...</div>;
  }

  if (totalQuestions > 0 && results.length === totalQuestions) {
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
