"use client";

import React, { useEffect, useRef } from 'react';
import animejs from 'animejs';
import { 
  Cpu, 
  Zap, 
  CircuitBoard, 
  Microchip, 
  Battery, 
  Wifi, 
  Bluetooth,
  Radio
} from 'lucide-react';

interface FloatingElementsProps {
  className?: string;
}

export default function FloatingElements({ className = "" }: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const icons = [Cpu, Zap, CircuitBoard, Microchip, Battery, Wifi, Bluetooth, Radio];
    const elements: HTMLDivElement[] = [];
    
    // Create floating tech icons
    for (let i = 0; i < 12; i++) {
      const element = document.createElement('div');
      element.className = 'absolute flex items-center justify-center opacity-10 hover:opacity-30 transition-opacity duration-300';
      
      const size = Math.random() * 20 + 15;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${Math.random() * 90}%`;
      element.style.top = `${Math.random() * 90}%`;
      
      // Create icon using Lucide
      const IconComponent = icons[Math.floor(Math.random() * icons.length)];
      element.innerHTML = `<svg width="${size * 0.7}" height="${size * 0.7}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary/40"><path d="M4 4h16v16H4z"/><path d="m9 9 5 5m0-5-5 5"/></svg>`;
      
      containerRef.current.appendChild(element);
      elements.push(element);
    }

    // Animate floating elements
    elements.forEach((element, index) => {
      // Random floating motion
      anime({
        targets: element,
        translateX: () => anime.random(-50, 50),
        translateY: () => anime.random(-50, 50),
        rotate: () => anime.random(-180, 180),
        scale: [1, 1.1, 1],
        duration: () => anime.random(3000, 6000),
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate',
        delay: Math.random() * 2000,
      });

      // Pulsing animation
      anime({
        targets: element,
        opacity: [0.05, 0.2, 0.05],
        duration: () => anime.random(2000, 4000),
        easing: 'easeInOutQuad',
        loop: true,
        delay: Math.random() * 1000,
      });

      // Occasional spin animation
      setInterval(() => {
        if (Math.random() > 0.7) {
          anime({
            targets: element,
            rotate: '+=360',
            duration: 1000,
            easing: 'easeInOutBack',
          });
        }
      }, 5000 + Math.random() * 5000);
    });

    // Create data streams (moving lines)
    const createDataStreams = () => {
      for (let i = 0; i < 6; i++) {
        const stream = document.createElement('div');
        stream.className = 'absolute bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full';
        stream.style.width = '2px';
        stream.style.height = '100px';
        stream.style.left = `${Math.random() * 100}%`;
        stream.style.top = '-100px';
        
        containerRef.current?.appendChild(stream);

        // Animate streams falling down
        anime({
          targets: stream,
          translateY: [0, window.innerHeight + 200],
          opacity: [0, 0.6, 0],
          duration: 3000 + Math.random() * 2000,
          easing: 'linear',
          loop: true,
          delay: Math.random() * 4000,
          complete: () => {
            stream.style.left = `${Math.random() * 100}%`;
          }
        });
      }
    };

    createDataStreams();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}