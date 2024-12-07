import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const STAR_COUNT = isMobile ? 100 : 200;
    const stars: { x: number; y: number; z: number; size: number }[] = [];
    let animationFrameId: number;

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width - canvas.width / 2,
          y: Math.random() * canvas.height - canvas.height / 2,
          z: Math.random() * canvas.width,
          size: Math.random() * 2
        });
      }
    };

    const moveStars = () => {
      const speed = isMobile ? 0.5 : 1;
      stars.forEach(star => {
        star.z -= speed;
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }
      });
    };

    const drawStars = () => {
      ctx.fillStyle = '#1A1B26';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        const x = (star.x / star.z) * canvas.width + canvas.width / 2;
        const y = (star.y / star.z) * canvas.height + canvas.height / 2;
        const size = (star.size * (1 - star.z / canvas.width)) * 3;

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          const opacity = 1 - star.z / canvas.width;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
          gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const animate = () => {
      moveStars();
      drawStars();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    initStars();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ 
        maxWidth: '100vw',
        maxHeight: '100vh'
      }}
    />
  );
};

export default StarfieldBackground;