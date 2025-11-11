import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import './TopBar.css';

const TopBar = ({ score, mode, isNewHighScore = false }) => {
  const { theme } = useTheme();

  return (
    <div className="top-bar">
      <div className={`score-display ${isNewHighScore ? 'high-score' : ''}`}>
        <span className="score-label">SCORE:</span>
        <span className="score-value">{score}</span>
        {isNewHighScore && <span className="crown-icon">👑</span>}
      </div>
      {mode && (
        <div className="mode-tag" style={{ borderColor: theme.colors.accent }}>
          {mode}
        </div>
      )}
    </div>
  );
};

export default TopBar;
