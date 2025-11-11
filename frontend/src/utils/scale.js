// Calculer le facteur de scale basé sur la largeur de l'écran
export const getScaleFactor = () => {
  if (typeof window === 'undefined') return 1;
  
  const width = window.innerWidth;
  
  if (width <= 400) {
    return Math.min(width * 0.95, 510) / 510;
  } else if (width <= 600) {
    return Math.min(width * 0.90, 510) / 510;
  }
  
  return 1; // Desktop
};

// Convertir une position en pixels avec le scale
export const scalePosition = (value) => {
  return value * 15 * getScaleFactor();
};

// Convertir une taille en pixels avec le scale
export const scaleSize = (value) => {
  return value * getScaleFactor();
};
