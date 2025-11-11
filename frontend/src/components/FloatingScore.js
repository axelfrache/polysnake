import React, { useEffect, useState } from 'react';
import './FloatingScore.css';

const FloatingScore = ({ x, y, value = '+1', onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="floating-score"
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      {value}
    </div>
  );
};

export default FloatingScore;
