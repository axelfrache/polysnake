import React, { useState } from 'react';
import ParallaxLayer from '../parallax/ParallaxLayer';
import './LeaderboardPanel.css';

const LeaderboardPanel = ({ scores, gameMode, parallaxEnabled = true }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ParallaxLayer depth={0.5} enabled={parallaxEnabled} className="leaderboard-panel-wrapper">
      <div className={`leaderboard-panel ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="leaderboard-header" onClick={() => setIsCollapsed(!isCollapsed)}>
          <h3 className="leaderboard-title">LEADERBOARD</h3>
          <button className="collapse-btn" aria-label="Toggle leaderboard">
            {isCollapsed ? '▲' : '▼'}
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="leaderboard-content">
            <div className="leaderboard-mode">{gameMode}</div>
            <div className="leaderboard-list">
              {scores && scores.length > 0 ? (
                scores.map((score, index) => (
                  <div key={index} className={`leaderboard-item rank-${index + 1}`}>
                    <span className="rank">#{index + 1}</span>
                    <span className="username">{score.username}</span>
                    <span className="score">{score.score}</span>
                  </div>
                ))
              ) : (
                <div className="no-scores">No scores yet</div>
              )}
            </div>
          </div>
        )}
      </div>
    </ParallaxLayer>
  );
};

export default LeaderboardPanel;
