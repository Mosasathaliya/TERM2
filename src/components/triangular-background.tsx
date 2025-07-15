/**
 * @fileoverview Renders a dynamic, animated triangular grid background.
 */
"use client";
import React, { useMemo } from 'react';

export function TriangularBackground() {
  const triangles = useMemo(() => {
    const triangleArray = [];
    const rows = 8;
    const cols = 10;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const delay = Math.random() * 20; // More random delay
        const initialRotate = Math.random() * 360;
        triangleArray.push(
          <div
            key={`${y}-${x}`}
            className="triangle"
            style={{
              top: `${y * 12.5}%`,
              left: `${x * 10}%`,
              animationDelay: `${delay}s`,
              opacity: Math.random() * 0.2 + 0.05,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
              // @ts-ignore
              '--initial-rotate': `${initialRotate}deg`,
            }}
          ></div>
        );
      }
    }
    return triangleArray;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {triangles}
    </div>
  );
}
