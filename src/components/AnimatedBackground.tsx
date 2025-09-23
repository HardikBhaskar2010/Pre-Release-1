"use client";

import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs'; // <-- fixed import

interface AnimatedBackgroundProps {
  className?: string;
}

export default function AnimatedBackground({ className = "" }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particleCount = 50;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full opacity-20';
      
      const size = Math.random() * 4 + 2;
      const hue = Math.random() * 60 + 200;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    particles.forEach((particle, index) => {
      animate(
        particle,
        {
          translateY: [0, -30, 0],
          translateX: [0, Math.sin(index) * 20, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          duration: 3000 + Math.random() * 2000,
          easing: 'easeInOutSine',
          loop: true,
          delay: Math.random() * 2000,
        }
      );

      animate(
        particle,
        {
          opacity: [0.1, 0.4, 0.1],
          duration: 2000 + Math.random() * 1000,
          easing: 'easeInOutQuad',
          loop: true,
          delay: Math.random() * 1000,
        }
      );
    });

    const createCircuitLines = () => {
      for (let i = 0; i < 8; i++) {
        const line = document.createElement('div');
        line.className = 'absolute bg-gradient-to-r from-transparent via-blue-400/20 to-transparent';
        line.style.height = '1px';
        line.style.width = `${Math.random() * 300 + 100}px`;
        line.style.left = `${Math.random() * 80}%`;
        line.style.top = `${Math.random() * 80 + 10}%`;
        line.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        containerRef.current?.appendChild(line);

        animate(
          line,
          {
            scaleX: [0, 1, 0],
            opacity: [0, 0.6, 0],
            duration: 4000,
            easing: 'easeInOutQuad',
            loop: true,
            delay: Math.random() * 3000,
          }
        );
      }
    };

    createCircuitLines();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}