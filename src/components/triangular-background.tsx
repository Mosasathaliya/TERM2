/**
 * @fileoverview Renders a dynamic, animated background with morphing shapes.
 */
"use client";
import React, { useState, useEffect } from 'react';

export function BackgroundShapes() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getTransform = (strength: number) => {
    // Only calculate the transform if the component is mounted and we are on the client
    if (!isMounted || typeof window === 'undefined') {
        return 'translate(0px, 0px)';
    }
    const x = (mousePosition.x - window.innerWidth / 2) / strength;
    const y = (mousePosition.y - window.innerHeight / 2) / strength;
    return `translate(${x}px, ${y}px)`;
  };

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background overflow-hidden">
        <div className="relative h-full w-full bg-background">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            
            <div
                style={{ transform: getTransform(20), '--tx': '100px', '--ty': '50px' } as React.CSSProperties}
                className="absolute top-[20%] left-[10%] h-72 w-72 rounded-full bg-primary/20 opacity-50 blur-3xl animate-[morph_18s_ease-in-out_infinite] transition-transform duration-500 ease-out"
            ></div>
            <div
                style={{ transform: getTransform(-30), '--tx': '-80px', '--ty': '-120px' } as React.CSSProperties}
                className="absolute top-[50%] left-[60%] h-60 w-60 rounded-full bg-accent/20 opacity-40 blur-3xl animate-[morph_22s_ease-in-out_infinite_4s] transition-transform duration-500 ease-out"
            ></div>
            <div
                style={{ transform: getTransform(40), '--tx': '40px', '--ty': '-150px' } as React.CSSProperties}
                className="absolute bottom-[10%] left-[30%] h-48 w-48 rounded-full bg-secondary/20 opacity-40 blur-3xl animate-[morph_20s_ease-in-out_infinite_2s] transition-transform duration-500 ease-out"
            ></div>
        </div>
    </div>
  );
}
