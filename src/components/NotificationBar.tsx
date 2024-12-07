import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Notification } from '../types';

interface NotificationBarProps {
  notifications: Notification[];
}

const NotificationBar: React.FC<NotificationBarProps> = ({ notifications }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    let animationId: number;
    let position = 0;

    const animate = () => {
      position -= 1;
      
      // Reset position when content is fully scrolled
      if (-position >= content.offsetWidth / 2) {
        position = 0;
      }

      content.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [notifications]);

  // Duplicate notifications to create seamless loop
  const allNotifications = [...notifications, ...notifications];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-12 bg-background/80 backdrop-blur border-t border-primary/20"
    >
      <div 
        ref={containerRef}
        className="h-full overflow-hidden"
        style={{ maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}
      >
        <div 
          ref={contentRef}
          className="h-full flex items-center whitespace-nowrap"
          style={{ width: 'fit-content' }}
        >
          {allNotifications.map((notification, index) => (
            <span
              key={`${notification.id}-${index}`}
              className={`
                inline-block mx-8 font-medium
                ${notification.type === 'price' ? 'text-primary' : ''}
                ${notification.type === 'system' ? 'text-secondary' : ''}
                ${notification.type === 'transaction' ? 'text-green-400' : ''}
              `}
            >
              • {notification.message}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationBar;