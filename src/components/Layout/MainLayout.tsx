import React, { useState } from 'react';
import NotificationBar from '../NotificationBar';
import { Notification } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import MenuButton from '../AppBar/MenuButton';
import AppBar from '../AppBar/AppBar';
import AccountHeader from '../Header/AccountHeader';
import Logo from '../Logo/Logo';

interface MainLayoutProps {
  children: React.ReactNode;
}

const notifications: Notification[] = [
  { id: '1', message: 'XRP Price: $0.60 (+2.5%)', type: 'price' },
  { id: '2', message: 'Network Status: Operational', type: 'system' },
  { id: '3', message: 'Latest Block: #12345678', type: 'system' }
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'pb-16' : ''}`}>
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
          <Logo />
        </div>
        <AccountHeader />
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-primary/30 shadow-lg"
          >
            <AppBar isMenuOpen={isMenuOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`
        relative z-10 min-h-[calc(100vh-48px)]
        ${isMobile ? 'flex flex-col space-y-4 px-4 pt-20' : ''}
      `}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === AppBar) {
            return null;
          }
          return child;
        })}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 z-20">
        <NotificationBar notifications={notifications} />
      </footer>
    </div>
  );
};

export default MainLayout;