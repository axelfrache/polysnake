import React, { useState } from 'react';
import { useTheme } from '../ui/theme/ThemeProvider';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, switchTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeLabels = {
    NeonGreen: '🟢 Neon Green',
    Vaporwave: '🌸 Vaporwave',
    DarkMatter: '🌌 Dark Matter',
  };

  return (
    <div className="theme-toggle-container">
      <button
        className="theme-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
      >
        🎨 {themeLabels[theme.name]}
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          {availableThemes.map((themeName) => (
            <button
              key={themeName}
              className={`theme-option ${theme.name === themeName ? 'active' : ''}`}
              onClick={() => {
                switchTheme(themeName);
                setIsOpen(false);
              }}
            >
              {themeLabels[themeName]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
