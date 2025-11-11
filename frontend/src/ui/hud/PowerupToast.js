import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import './PowerupToast.css';

const PowerupToast = ({ powerup, duration, onComplete }) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="powerup-toast">
      <div className="powerup-content">
        <span className="powerup-icon">{powerup.icon}</span>
        <div className="powerup-info">
          <div className="powerup-name">{powerup.name}</div>
          <div className="powerup-time">+{Math.ceil(duration / 1000)}s</div>
        </div>
      </div>
      <div className="powerup-progress-bar">
        <div
          className="powerup-progress-fill"
          style={{
            width: `${progress}%`,
            backgroundColor: theme.colors.accent,
            boxShadow: `0 0 10px ${theme.colors.accent}`,
          }}
        />
      </div>
    </div>
  );
};

export default PowerupToast;
