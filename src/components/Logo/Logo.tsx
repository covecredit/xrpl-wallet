import React from 'react';
import { Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <motion.div 
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Anchor className="w-6 h-6 text-primary" />
      <div className="flex items-center text-xl font-bold text-primary">
        <span>C</span>
        <span className="relative mx-0.5">
          O
          <motion.div
            className="absolute top-1/2 left-0 w-full h-0.5 bg-primary transform -rotate-45"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
        </span>
        <span>VE</span>
      </div>
    </motion.div>
  );
};

export default Logo;