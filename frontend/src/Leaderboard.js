import React from "react";
import "./Leaderboard.css";
import { GAME_MODE_LABELS } from "./constants/gameConstants";

const Leaderboard = ({ scores, gameMode }) => {
  const modeLabel = gameMode ? GAME_MODE_LABELS[gameMode] : "Classic Mode";
  
  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">LEADERBOARD</h2>
      <div className="leaderboard-mode">{modeLabel}</div>
      <div className="leaderboard-list">
        {scores && scores.length > 0 ? (
          scores.map((score, index) => (
            <div key={score.id} className="leaderboard-item">
              <span className="rank">#{index + 1}</span>
              <span className="username">{score.username}</span>
              <span className="score">{score.score}</span>
            </div>
          ))
        ) : (
          <div className="no-scores">No scores yet!</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
