import React from 'react';
import ThemeToggle from './ThemeToggle';
import './Settings.css';

const Settings = ({ isOpen, onClose, glowEnabled, onGlowToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">⚙️ SETTINGS</h2>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3 className="settings-section-title">Theme</h3>
            <div className="settings-item">
              <ThemeToggle />
            </div>
          </div>
          
          <div className="settings-section">
            <h3 className="settings-section-title">Visual Effects</h3>
            <div className="settings-item">
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={glowEnabled}
                  onChange={(e) => onGlowToggle(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Enable Glow Effects</span>
              </label>
              <p className="settings-description">
                Disable to improve performance on slower devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
