"use client";

import React, { useEffect, useRef } from 'react';
import * as anime from 'animejs'; // <-- import everything as a namespace

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedTitle({ children, className = "" }: AnimatedTitleProps) {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const titleElement = titleRef.current;
    const text = titleElement.textContent || '';
    titleElement.innerHTML = '';

    const words = text.split(' ');
    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'inline-block mr-2 md:mr-3 lg:mr-4';

      word.split('').forEach((letter) => {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = letter;
        letterSpan.className = 'inline-block opacity-0';
        letterSpan.style.transform = 'translateY(100px) rotateX(90deg)';
        wordSpan.appendChild(letterSpan);
      });

      titleElement.appendChild(wordSpan);
    });

    const letterElements = titleElement.querySelectorAll('span span');

    // Timeline animation
    const timeline = (anime as any).timeline();

    timeline.add({
      targets: letterElements,
      opacity: [0, 1],
      translateY: [100, 0],
      rotateX: [90, 0],
      scale: [0.8, 1],
      duration: 800,
      delay: (anime as any).stagger(50, { start: 300 }),
      easing: 'easeOutElastic(1, .6)',
    }).add({
      targets: letterElements,
      rotateY: [0, 360],
      duration: 600,
      delay: (anime as any).stagger(30),
      easing: 'easeInOutSine',
    }, '-=400');

    // Continuous subtle animation
    (anime as any)({
      targets: letterElements,
      translateY: [0, -2, 0],
      duration: 2000,
      delay: (anime as any).stagger(100),
      easing: 'easeInOutSine',
      loop: true,
    });

    // Glow effect
    const addGlowEffect = () => {
      (anime as any)({
        targets: titleElement,
        textShadow: [
          '0 0 20px rgba(139, 92, 246, 0.3)',
          '0 0 30px rgba(139, 92, 246, 0.5)',
          '0 0 20px rgba(139, 92, 246, 0.3)',
        ],
        duration: 3000,
        easing: 'easeInOutQuad',
        loop: true,
      });
    };

    setTimeout(addGlowEffect, 1500);

  }, [children]);

  return (
    <div 
      ref={titleRef}
      className={className}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d' 
      }}
    >
      {children}
    </div>
  );
}
