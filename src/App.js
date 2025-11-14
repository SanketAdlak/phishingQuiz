import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Welcome from './components/Welcome';
import ThankYou from './components/ThankYou';
import ConfidenceQuiz from './components/ConfidenceQuiz';
import CompetenceQuiz from './components/CompetenceQuiz';
import Demographics from './components/Demographics';
import './App.css';

function App() {
  const [view, setView] = useState('welcome');
  const [confidenceResults, setConfidenceResults] = useState([]);
  const [competenceResults, setCompetenceResults] = useState([]);

  useEffect(() => {
    const quizCompleted = localStorage.getItem('quizCompleted');
    if (quizCompleted) {
      setView('thankyou');
    }
  }, []);

  const handleStart = () => {
    setView('confidence');
  };

  const handleConfidenceComplete = (results) => {
    setConfidenceResults(results);
    setView('competence');
  };

  const handleCompetenceComplete = (results) => {
    setCompetenceResults(results);
    setView('demographics');
  };

  const handleDemographicsSubmit = (demographics) => {
    const allResults = {
      quizResults: [...confidenceResults, ...competenceResults],
      demographics,
    };

    fetch('api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allResults),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.setItem('quizCompleted', 'true');
          setView('thankyou');
        } else {
          // Handle error
          console.error('Failed to submit results');
        }
      })
      .catch((error) => {
        console.error('Error submitting results:', error);
      });
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
      />
      {view === 'welcome' && <Welcome onStart={handleStart} />}
      {view === 'confidence' && <ConfidenceQuiz onComplete={handleConfidenceComplete} />}
      {view === 'competence' && <CompetenceQuiz onComplete={handleCompetenceComplete} />}
      {view === 'demographics' && <Demographics onDemographicsSubmit={handleDemographicsSubmit} />}
      {view === 'thankyou' && <ThankYou />}
    </div>
  );
}

export default App;
