import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Welcome from './components/Welcome';
import ThankYou from './components/ThankYou';
import ConfidenceQuiz from './components/ConfidenceQuiz';
import CompetenceQuiz from './components/CompetenceQuiz';
import './App.css';

function App() {
  const [view, setView] = useState('welcome');
  const [confidenceResults, setConfidenceResults] = useState([]);

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

  const handleQuizComplete = () => {
    localStorage.setItem('quizCompleted', 'true');
    setView('thankyou');
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
      {view === 'competence' && <CompetenceQuiz confidenceResults={confidenceResults} onComplete={handleQuizComplete} />}
      {view === 'thankyou' && <ThankYou />}
    </div>
  );
}

export default App;
