import React from 'react';
import { useParallaxController } from './useParallaxController';

const ParallaxLayer = ({ children, depth = 1, enabled = true, className = '', style = {} }) => {
  const offset = useParallaxController(enabled);

  const maxShift = 16; // pixels
  const translateX = Math.max(-maxShift, Math.min(maxShift, offset.x * depth * maxShift));
  const translateY = Math.max(-maxShift, Math.min(maxShift, offset.y * depth * maxShift));

  const parallaxStyle = enabled
    ? {
        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
        ...style,
      }
    : style;

  return (
    <div className={className} style={parallaxStyle}>
      {children}
    </div>
  );
};

export default ParallaxLayer;
