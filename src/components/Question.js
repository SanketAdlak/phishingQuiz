import React, { useState, useEffect, useRef } from 'react';

const Question = ({ question, onAnswer }) => {
  const [startTime, setStartTime] = useState(0);
  const scenarioRef = useRef(null);

  useEffect(() => {
    setStartTime(Date.now());

    if (scenarioRef.current) {
      const links = scenarioRef.current.querySelectorAll('a');
      links.forEach((link) => {
        link.addEventListener('click', handlePhishingLinkClick);
      });
    }

    return () => {
      if (scenarioRef.current) {
        const links = scenarioRef.current.querySelectorAll('a');
        links.forEach((link) => {
          link.removeEventListener('click', handlePhishingLinkClick);
        });
      }
    };
  }, [question]);

  const handlePhishingLinkClick = (e) => {
    e.preventDefault();
    const timeTaken = (Date.now() - startTime) / 1000;
    onAnswer({
      answer: 'phishing',
      timeTaken,
      clickedPhishingLink: true,
    });
  };

  const handleAnswer = (answer) => {
    const timeTaken = (Date.now() - startTime) / 1000;
    onAnswer({
      answer,
      timeTaken,
      clickedPhishingLink: false,
    });
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <h2>Question {question.id}</h2>
        <p>{question.description}</p>
      </div>
      <div
        className="scenario"
        ref={scenarioRef}
        dangerouslySetInnerHTML={{ __html: question.scenario.html }}
      />
      <div className="answers">
        <button onClick={() => handleAnswer('legitimate')}>Legitimate</button>
        <button onClick={() => handleAnswer('phishing')}>Phishing</button>
      </div>
    </div>
  );
};

export default Question;
