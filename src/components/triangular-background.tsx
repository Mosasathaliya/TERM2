"use client";

import React, { useState, useEffect } from 'react';

export function TriangularBackground() {
  const [triangles, setTriangles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const generateTriangles = () => {
      const triangleSize = 180;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cols = Math.ceil(w / triangleSize) + 1;
      const rows = Math.ceil(h / triangleSize) + 1;

      const newTriangles: React.ReactNode[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          newTriangles.push(
            <div
              key={`${y}-${x}`}
              className="triangle"
              style={{
                top: `${(y / (rows - 1)) * 100}%`,
                left: `${(x / (cols - 1)) * 100}%`,
                '--animation-delay': `${(Math.random() * 10).toFixed(2)}s`,
                '--initial-rotate': `${Math.random() * 360}deg`,
                '--scale': `${(Math.random() * 0.4 + 0.6).toFixed(2)}`,
                '--opacity': `${(Math.random() * 0.2 + 0.05).toFixed(2)}`
              } as React.CSSProperties}
            ></div>
          );
        }
      }
      setTriangles(newTriangles);
    };

    generateTriangles();
    
    const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      return (...args: Parameters<F>): void => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), waitFor);
      };
    };
    
    const handleResize = debounce(generateTriangles, 250);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {triangles}
    </div>
  );
}
