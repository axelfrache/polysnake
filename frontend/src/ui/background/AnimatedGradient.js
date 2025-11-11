import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import './AnimatedGradient.css';

const AnimatedGradient = () => {
  const { theme } = useTheme();

  // Gradient statique simple - pas d'animation
  const gradientStyle = {
    background: `linear-gradient(135deg, ${theme.colors.bg1} 0%, ${theme.colors.bg2} 100%)`,
  };

  return (
    <div className="animated-gradient-static" style={gradientStyle}>
      <div className="gradient-overlay" />
    </div>
  );
};

export default AnimatedGradient;
