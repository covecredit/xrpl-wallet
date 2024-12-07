import React from 'react';
import { motion } from 'framer-motion';

interface FlameEffectProps {
  x: number;
  y: number;
}

const FlameEffect: React.FC<FlameEffectProps> = ({ x, y }) => {
  const colors = [
    '#FF0000', // Red
    '#FF4500', // Red-Orange
    '#FFA500', // Orange
    '#FFD700', // Gold
    '#4169E1', // Royal Blue
    '#C0C0C0', // Silver
  ];

  const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const particles = Array.from({ length: 20 }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 4,
    vy: -Math.random() * 4 - 2,
    color: randomColor(),
    targetColor: randomColor()
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed pointer-events-none z-50"
      style={{ left: 0, top: 0 }}
    >
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: particle.x, 
            y: particle.y,
            scale: 1,
            backgroundColor: particle.color
          }}
          animate={{ 
            x: particle.x + particle.vx * 20,
            y: particle.y + particle.vy * 20,
            scale: 0,
            backgroundColor: particle.targetColor
          }}
          transition={{ duration: 0.5 }}
          className="absolute w-2 h-2 rounded-full"
        />
      ))}
    </motion.div>
  );
};

export default FlameEffect;