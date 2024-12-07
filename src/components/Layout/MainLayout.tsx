import React, { useState } from 'react';
import StarfieldBackground from '../StarfieldBackground';
import NotificationBar from '../NotificationBar';
import { Notification } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface FireParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const notifications: Notification[] = [
  { id: '1', message: 'XRP Price: $0.60 (+2.5%)', type: 'price' },
  { id: '2', message: 'Network Status: Operational', type: 'system' },
  { id: '3', message: 'Latest Block: #12345678', type: 'system' }
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [fireParticles, setFireParticles] = useState<FireParticle[]>([]);

  const createFireParticles = (x: number, y: number) => {
    const particles: FireParticle[] = [];
    const particleCount = 8; // Reduced from 12
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 1.5 + Math.random() * 1.5; // Reduced speed
      particles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 6 + Math.random() * 6, // Reduced size from 10 to 6
        opacity: 0.6 + Math.random() * 0.2 // Slightly reduced opacity
      });
    }

    setFireParticles(prev => [...prev, ...particles]);
    setTimeout(() => {
      setFireParticles(prev => prev.filter(p => !particles.includes(p)));
    }, 800); // Reduced duration from 1000ms to 800ms
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    createFireParticles(e.clientX, e.clientY);
  };

  return (
    <div 
      className="min-h-screen bg-background"
      onMouseDown={handleMouseDown}
    >
      <StarfieldBackground />
      
      <AnimatePresence>
        {fireParticles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: particle.opacity
            }}
            animate={{ 
              x: particle.x + particle.vx * 40, // Reduced movement range
              y: particle.y + particle.vy * 40,
              scale: 0,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute pointer-events-none z-50"
            style={{
              width: particle.size,
              height: particle.size * 1.5,
              background: 'radial-gradient(circle at 50% 0%, #FFD700, #FF4500, transparent)',
              borderRadius: '50% 50% 20% 20%'
            }}
          />
        ))}
      </AnimatePresence>

      <main className="relative z-10 min-h-[calc(100vh-48px)]">
        {children}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 z-20">
        <NotificationBar notifications={notifications} />
      </footer>
    </div>
  );
};

export default MainLayout;