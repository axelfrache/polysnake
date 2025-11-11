// Theme system for POLYSNAKE

export const themes = {
  NeonGreen: {
    name: 'NeonGreen',
    colors: {
      primary: '#2EFAD7',
      accent: '#FF3DAE',
      bg1: '#0B0F1E',
      bg2: '#1A1440',
      border: '#1DE7C7',
      positive: '#16F2A4',
      warning: '#FF4D4D',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
    },
    glow: {
      intensity: 1,
      blur: 20,
    },
    fontFamily: {
      display: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
    },
    soundSet: 'cyber',
  },
  Vaporwave: {
    name: 'Vaporwave',
    colors: {
      primary: '#FF6EC7',
      accent: '#9D4EDD',
      bg1: '#1A0B2E',
      bg2: '#2D1B4E',
      border: '#FF2E97',
      positive: '#00F5FF',
      warning: '#FF6B9D',
      text: '#FFE5F1',
      textSecondary: 'rgba(255, 229, 241, 0.7)',
    },
    glow: {
      intensity: 1.2,
      blur: 25,
    },
    fontFamily: {
      display: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
    },
    soundSet: 'retro',
  },
  DarkMatter: {
    name: 'DarkMatter',
    colors: {
      primary: '#00D9FF',
      accent: '#FF6B35',
      bg1: '#0A0E27',
      bg2: '#1C2541',
      border: '#3A86FF',
      positive: '#06FFA5',
      warning: '#FB5607',
      text: '#E0FBFC',
      textSecondary: 'rgba(224, 251, 252, 0.7)',
    },
    glow: {
      intensity: 0.9,
      blur: 18,
    },
    fontFamily: {
      display: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
    },
    soundSet: 'space',
  },
};

export const defaultTheme = themes.NeonGreen;

// CSS variable generator
export function generateThemeCSS(theme) {
  return `
    --color-primary: ${theme.colors.primary};
    --color-accent: ${theme.colors.accent};
    --color-bg1: ${theme.colors.bg1};
    --color-bg2: ${theme.colors.bg2};
    --color-border: ${theme.colors.border};
    --color-positive: ${theme.colors.positive};
    --color-warning: ${theme.colors.warning};
    --color-text: ${theme.colors.text};
    --color-text-secondary: ${theme.colors.textSecondary};
    --glow-intensity: ${theme.glow.intensity};
    --glow-blur: ${theme.glow.blur}px;
    --font-display: ${theme.fontFamily.display};
    --font-body: ${theme.fontFamily.body};
  `;
}

// Glow utility
export function getGlow(theme, color) {
  const colorValue = theme.colors[color];
  const intensity = theme.glow.intensity;
  const blur = theme.glow.blur;
  
  return `0 0 ${blur * intensity}px ${colorValue}, 0 0 ${blur * 2 * intensity}px ${colorValue}40`;
}
