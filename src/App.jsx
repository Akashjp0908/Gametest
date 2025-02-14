import React, { useState, useEffect } from 'react';
import './App.css';
import QuestionCard from './components/QuestionCard';
import Timer from './components/Timer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const questions = [
  {
    question: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
    answer: 'Paris'
  },
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    answer: 'Jupiter'
  },
  {
    question: 'What is the chemical symbol for gold?',
    options: ['Fe', 'Au', 'Ag', 'Cu'],
    answer: 'Au'
  }
];

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
    }
  };

  const playSound = (type) => {
    const sound = new Audio(`/sounds/${type}.mp3`);
    sound.play();
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          storeLocation(latitude, longitude);
          setLocationAllowed(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationAllowed(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocationAllowed(false);
    }
  };

  const storeLocation = async (latitude, longitude) => {
    try {
      const { data, error } = await supabase
        .from('user_locations')
        .insert([{ latitude, longitude }]);
      if (error) {
        console.error('Error storing location:', error);
      } else {
        console.log('Location stored successfully:', data);
      }
    } catch (error) {
      console.error('Error storing location:', error);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (locationAllowed) {
      const interval = setInterval(() => {
        document.documentElement.style.setProperty('--bg-color1', getRandomColor());
        document.documentElement.style.setProperty('--bg-color2', getRandomColor());
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [locationAllowed]);

  const getRandomColor = () => {
    const colors = ['#00bfff', '#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#e74c3c'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="app">
      {locationAllowed ? (
        <div className="quiz-container">
          {showScore ? (
            <div className="score-container">
              <h1>Quiz Completed!</h1>
              <p>Your score: {score} / {questions.length}</p>
              <button onClick={() => window.location.reload()}>Play Again</button>
            </div>
          ) : (
            <>
              <Timer />
              <QuestionCard
                question={questions[currentQuestion].question}
                options={questions[currentQuestion].options}
                handleAnswer={handleAnswer}
              />
            </>
          )}
        </div>
      ) : (
        <div className="location-container">
          <h1>Allow Location to Start the Game</h1>
          <p>Click the button below to allow location access and start the game.</p>
          <button onClick={requestLocation}>Allow Location</button>
          <button onClick={() => setLocationAllowed(true)}>Start Without Location</button>
        </div>
      )}
    </div>
  );
};

export default App;
