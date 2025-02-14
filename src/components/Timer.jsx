import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [time, setTime] = useState(30);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
      setProgress((prevProgress) => {
        if (prevProgress > 0) {
          return prevProgress - (100 / 30);
        } else {
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
      <h1>{time} seconds</h1>
      <div className="progress-bar">
        <div className="fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default Timer;
