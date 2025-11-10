import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Welcome from './components/Welcome';
import ThankYou from './components/ThankYou';
import './App.css';

function App() {
  const [view, setView] = useState('welcome');

  const handleStart = () => {
    setView('quiz');
  };

  const handleQuizComplete = () => {
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
