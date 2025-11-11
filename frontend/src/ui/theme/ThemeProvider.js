import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme, generateThemeCSS } from './theme.js';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('polysnake-theme');
    return saved && themes[saved] ? themes[saved] : defaultTheme;
  });

  useEffect(() => {
    // Apply theme CSS variables to root
    const root = document.documentElement;
    const cssVars = generateThemeCSS(currentTheme);
    const vars = cssVars.split(';').filter(v => v.trim());
    
    vars.forEach(varDecl => {
      const [name, value] = varDecl.split(':').map(s => s.trim());
      if (name && value) {
        root.style.setProperty(name, value);
      }
    });

    // Save to localStorage
    localStorage.setItem('polysnake-theme', currentTheme.name);
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themes[themeName]);
    }
  };

  const value = {
    theme: currentTheme,
    switchTheme,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
