/**
 * @fileoverview Renders a dynamic, animated triangular grid background.
 */
"use client";
import React, { useState, useEffect, useMemo } from 'react';

interface Triangle {
  key: string;
  style: React.CSSProperties;
}

export function TriangularBackground() {
  const [triangles, setTriangles] = useState<Triangle[]>([]);

  useEffect(() => {
    const generateTriangles = () => {
      const triangleArray: Triangle[] = [];
      const rows = 8;
      const cols = 10;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const delay = Math.random() * 20;
          const initialRotate = Math.random() * 360;
          triangleArray.push({
            key: `${y}-${x}`,
            style: {
              top: `${y * 12.5}%`,
              left: `${x * 10}%`,
              animationDelay: `${delay}s`,
              opacity: Math.random() * 0.2 + 0.05,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
              '--initial-rotate': `${initialRotate}deg`,
            } as React.CSSProperties,
          });
        }
      }
      setTriangles(triangleArray);
    };

    generateTriangles();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {triangles.map(({ key, style }) => (
        <div key={key} className="triangle" style={style}></div>
      ))}
    </div>
  );
}
