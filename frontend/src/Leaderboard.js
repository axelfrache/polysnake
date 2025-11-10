import React from "react";
import "./Leaderboard.css";

const Leaderboard = ({ scores }) => {
  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">LEADERBOARD</h2>
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
