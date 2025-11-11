import React, { useState, useEffect } from 'react';
import './FloatingPlusOne.css';

const FloatingPlusOne = ({ x, y, value = '+1', onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="floating-plus-one"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {value}
    </div>
  );
};

export default FloatingPlusOne;
