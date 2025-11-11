import React from "react";
import { POWER_UP_CONFIG } from "./constants/gameConstants";
import "./PowerUpIndicator.css";

const PowerUpIndicator = ({ activePowerUp, timeRemaining }) => {
  if (!activePowerUp) return null;
  
  const config = POWER_UP_CONFIG[activePowerUp];
  const percentage = (timeRemaining / config.duration) * 100;
  
  return (
    <div className="power-up-indicator">
      <div className="power-up-info">
        <span className="power-up-icon" style={{ color: config.color }}>
          {config.icon}
        </span>
        <div className="power-up-details">
          <div className="power-up-name">{config.name}</div>
          <div className="power-up-effect">{config.effect}</div>
        </div>
        <div className="power-up-timer">{(timeRemaining / 1000).toFixed(1)}s</div>
      </div>
      <div className="power-up-progress">
        <div 
          className="power-up-progress-bar" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: config.color
          }}
        />
      </div>
    </div>
  );
};

export default PowerUpIndicator;
