import React, { useState, useEffect } from 'react';
import Question from './Question';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/questions.json')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleAnswer = (resultData) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer === resultData.answer;

    const result = {
      questionId: currentQuestion.id,
      isCorrect,
      timeTaken: resultData.timeTaken,
      clickedPhishingLink: resultData.clickedPhishingLink,
    };

    setResults([...results, result]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmit = () => {
    fetch('http://localhost:3001/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div>
        <h2>Quiz finished!</h2>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <Question
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default Quiz;
