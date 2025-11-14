import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Welcome from './components/Welcome';
import ThankYou from './components/ThankYou';
import ConfidenceQuiz from './components/ConfidenceQuiz';
import CompetenceQuiz from './components/CompetenceQuiz';
import Demographics from './components/Demographics';
import TitlePage from './components/TitlePage';
import './App.css';

function App() {
  const [view, setView] = useState('welcome');
  const [confidenceResults, setConfidenceResults] = useState([]);
  const [competence1Results, setCompetence1Results] = useState([]);
  const [competence2Results, setCompetence2Results] = useState([]);

  useEffect(() => {
    const quizCompleted = localStorage.getItem('quizCompleted');
    if (quizCompleted) {
      setView('thankyou');
    }
  }, []);

  const handleStart = () => {
    setView('confidenceTitle');
  };

  const handleConfidenceComplete = (results) => {
    setConfidenceResults(results);
    setView('competence1Title');
  };

  const handleCompetence1Complete = (results) => {
    setCompetence1Results(results);
    setView('competence2Title');
  };

  const handleCompetence2Complete = (results) => {
    setCompetence2Results(results);
    setView('demographics');
  };

  const handleDemographicsSubmit = (demographics) => {
    const allResults = {
      quizResults: [...confidenceResults, ...competence1Results, ...competence2Results],
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
      {view === 'confidenceTitle' && (
        <TitlePage
          title="Part 1: Confidence Quiz"
          description="This section gauges your confidence in identifying phishing attempts."
          buttonText="Start Part 1"
          onStart={() => setView('confidence')}
        />
      )}
      {view === 'confidence' && <ConfidenceQuiz onComplete={handleConfidenceComplete} />}
      {view === 'competence1Title' && (
        <TitlePage
          title="Part 2: Competence Quiz"
          description="This section tests your ability to identify phishing attempts."
          buttonText="Start Part 2"
          onStart={() => setView('competence1')}
        />
      )}
      {view === 'competence1' && <CompetenceQuiz part={1} onComplete={handleCompetence1Complete} />}
      {view === 'competence2Title' && (
        <TitlePage
          title="Part 3: Competence Quiz"
          description="This is the final part of the competence quiz."
          buttonText="Start Part 3"
          onStart={() => setView('competence2')}
        />
      )}
      {view === 'competence2' && <CompetenceQuiz part={2} onComplete={handleCompetence2Complete} />}
      {view === 'demographics' && <Demographics onDemographicsSubmit={handleDemographicsSubmit} />}
      {view === 'thankyou' && <ThankYou />}
    </div>
  );
}

export default App;
