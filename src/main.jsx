import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2
  },
  // Add more questions here
];

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showLocationPrompt) {
      getLocation();
    }
  }, [showLocationPrompt]);

  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await navigator.geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const { data, error } = await supabase
        .from('user_locations')
        .insert([
          {
            latitude,
            longitude,
            created_at: new Date().toISOString()
          }
        ]);

      if (!error) {
        setShowLocationPrompt(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setShowLocationPrompt(false);
      setLoading(false);
    }
  };

  const handleAnswer = (selected: number) => {
    if (selected === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
    }
  };

  return (
    <div className="app">
      {showLocationPrompt && !loading && (
        <div className="location-prompt">
          <h2>Can we get your location?</h2>
          <button onClick={() => setShowLocationPrompt(false)}>
            Skip Location
          </button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <p>Processing your location...</p>
        </div>
      )}

      {!showLocationPrompt && (
        <div className="quiz-container">
          {/* Quiz UI components here */}
        </div>
      )}
    </div>
  );
}

export default App;
