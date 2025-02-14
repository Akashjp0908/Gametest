import React from 'react';

const QuestionCard = ({ question, options, handleAnswer }) => {
  return (
    <div className="question-card">
      <h1>{question}</h1>
      {options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option)}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default QuestionCard;
