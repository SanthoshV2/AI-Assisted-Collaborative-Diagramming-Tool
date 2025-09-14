import React, { useMemo } from 'react';

const GridBackground = ({ zoom }) => {
  // Calculate grid spacing based on zoom level
  const gridSpacing = useMemo(() => {
    // Base grid spacing is 20px
    const baseSpacing = 20;
    
    // Adjust grid spacing based on zoom to keep it visible but not overwhelming
    if (zoom > 1.5) return baseSpacing;
    if (zoom > 0.8) return baseSpacing * 2;
    if (zoom > 0.4) return baseSpacing * 4;
    return baseSpacing * 8;
  }, [zoom]);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, #f0f0f0 1px, transparent 1px),
          linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
        `,
        backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
        opacity: 0.6
      }}
    />
  );
};

export default GridBackground;