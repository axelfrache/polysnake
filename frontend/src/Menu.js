import React, { useState } from "react";
import "./Menu.css";

const Menu = ({ onRouteChange, onUsernameSet }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

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
    onRouteChange();
  };

  return (
    <div className="wrapper">
      <div className="menu-content">
        <input
          type="text"
          className="username-input"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleStart()}
          maxLength={50}
        />
        {error && <div className="error-message">{error}</div>}
        <input
          onClick={handleStart}
          className="start"
          type="button"
          value="START GAME"
        />
      </div>
    </div>
  );
};

export default Menu;
