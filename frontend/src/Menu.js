import React, { useState } from "react";
import { GAME_MODES, GAME_MODE_LABELS } from "./constants/gameConstants";

const Menu = ({ onRouteChange, onUsernameSet, onGameModeSet, onGameModeChange, initialUsername = "", initialGameMode = GAME_MODES.CLASSIC, onSettingsClick }) => {
  const [username, setUsername] = useState(initialUsername);
  const [gameMode, setGameMode] = useState(initialGameMode);
  const [error, setError] = useState("");

  const handleGameModeChange = (mode) => {
    setGameMode(mode);
    if (onGameModeChange) {
      onGameModeChange(mode);
    }
  };

  const handleStart = () => {
    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }
    if (username.trim().length > 50) {
      setError("Username must be less than 50 characters");
      return;
    }
    setError("");
    onUsernameSet(username.trim());
    onGameModeSet(gameMode);
    onRouteChange();
  };

  return (
    <div className="wrapper">
      <div className="menu-content">
        <input
          type="text"
          className="input-field"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleStart()}
          maxLength={50}
        />
        
        <div className="game-mode-selector">
          <label className="mode-label">Select Game Mode:</label>
          <div className="mode-options">
            {Object.values(GAME_MODES).map(mode => (
              <button
                key={mode}
                className={`mode-button ${gameMode === mode ? 'active' : ''}`}
                onClick={() => handleGameModeChange(mode)}
              >
                {GAME_MODE_LABELS[mode]}
                {mode === GAME_MODES.CHAOS && <span className="mode-badge">NEW!</span>}
              </button>
            ))}
          </div>
          {gameMode === GAME_MODES.CHAOS && (
            <div className="mode-description">
              ⚡ Chaos Mode: Dodge bombs 💣, collect power-ups, and survive!
            </div>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="menu-buttons">
          <button
            onClick={handleStart}
            className="start-button"
            type="button"
          >
            START GAME
          </button>
          
          <button
            onClick={onSettingsClick}
            className="settings-button"
            type="button"
          >
            ⚙️ SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
