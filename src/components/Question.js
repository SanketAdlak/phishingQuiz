import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { toast } from 'react-toastify';

const Question = forwardRef(({ question, onAnswer }, ref) => {
  const [startTime, setStartTime] = useState(0);
  const clickedPhishingRef = useRef(false);
  const urlViewedRef = useRef(false);
  const scenarioRef = useRef(null);

  useEffect(() => {
    setStartTime(Date.now());
    clickedPhishingRef.current = false;
    urlViewedRef.current = false;

    const scenarioEl = scenarioRef.current;
    if (scenarioEl) {
      scenarioEl.addEventListener('click', handlePhishingLinkClick);
      scenarioEl.addEventListener('mouseover', handleUrlView);
    }

    return () => {
      if (scenarioEl) {
        scenarioEl.removeEventListener('click', handlePhishingLinkClick);
        scenarioEl.removeEventListener('mouseover', handleUrlView);
      }
    };
  }, [question]);

  const handlePhishingLinkClick = (e) => {
    e.preventDefault();
    clickedPhishingRef.current = true;
    if (question.isPhishing) {
      toast.warn('This is a suspicious URL. You should not click on unverified URLs.');
    }
  };

  const handleUrlView = (e) => {
    if (e.target.tagName === 'A') {
      urlViewedRef.current = true;
    }
  };

  const handleAnswer = (answer) => {
    const timeTaken = (Date.now() - startTime) / 1000;
    onAnswer({
      answer,
      timeTaken,
      clickedPhishingLink: clickedPhishingRef.current,
      urlViewed: urlViewedRef.current,
    });
    toast.success('Response received!');
  };

  return (
    <div className="question-container" ref={ref}>
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
        <button className="legitimate-btn" onClick={() => handleAnswer('legitimate')}>Legit</button>
        <button className="phishing-btn" onClick={() => handleAnswer('phishing')}>Fraud</button>
      </div>
    </div>
  );
});

export default Question;
