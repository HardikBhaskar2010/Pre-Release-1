"use client";

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface GridBackgroundProps {
  className?: string;
}

export default function GridBackground({ className = "" }: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gridSize = 50;
    const dots: { x: number; y: number; opacity: number; targetOpacity: number }[] = [];

    // Create grid dots
    for (let x = 0; x < canvas.width / gridSize; x++) {
      for (let y = 0; y < canvas.height / gridSize; y++) {
        dots.push({
          x: x * gridSize,
          y: y * gridSize,
          opacity: Math.random() * 0.1,
          targetOpacity: Math.random() * 0.1,
        });
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid dots
      dots.forEach(dot => {
        // Smooth opacity transition
        dot.opacity += (dot.targetOpacity - dot.opacity) * 0.02;
        
        // Randomly change target opacity
        if (Math.random() < 0.001) {
          dot.targetOpacity = Math.random() * 0.2;
        }
        
        ctx.fillStyle = `rgba(139, 92, 246, ${dot.opacity})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    // Animate grid with mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      dots.forEach(dot => {
        const distance = Math.sqrt((mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2);
        if (distance < 100) {
          dot.targetOpacity = Math.min(0.4, 0.1 + (100 - distance) / 100 * 0.3);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -2 }}
    />
  );
}