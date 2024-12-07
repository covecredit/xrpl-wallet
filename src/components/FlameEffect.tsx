import React from 'react';
import { motion } from 'framer-motion';

interface FlameEffectProps {
  x: number;
  y: number;
}

const FlameEffect: React.FC<FlameEffectProps> = ({ x, y }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 12,
    speed: 1 + Math.random(),
    scale: 0.3 + Math.random() * 0.2,
  }));

  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x - 5, top: y - 5 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            scale: particle.scale,
            opacity: 0.8,
          }}
          animate={{
            x: Math.cos(particle.angle) * 20 * particle.speed,
            y: Math.sin(particle.angle) * 20 * particle.speed - 20,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            background: `radial-gradient(circle at 50% 0%, #FFD700, #FFA500, transparent)`,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
      ))}
    </div>
  );
};

export default FlameEffect;