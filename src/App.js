import React, { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import Welcome from './components/Welcome';
import ThankYou from './components/ThankYou';
import './App.css';

function App() {
  const [view, setView] = useState('welcome');

  useEffect(() => {
    const quizCompleted = localStorage.getItem('quizCompleted');
    if (quizCompleted) {
      setView('thankyou');
    }
  }, []);

  const handleStart = () => {
    setView('quiz');
  };

  const handleQuizComplete = () => {
    localStorage.setItem('quizCompleted', 'true');
    setView('thankyou');
  };

  return (
    <div className="App">
      {view === 'welcome' && <Welcome onStart={handleStart} />}
      {view === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
      {view === 'thankyou' && <ThankYou />}
    </div>
  );
}

export default App;
