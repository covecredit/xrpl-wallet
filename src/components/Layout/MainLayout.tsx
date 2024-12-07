import React from 'react';
import StarfieldBackground from '../StarfieldBackground';
import NotificationBar from '../NotificationBar';
import { Notification } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
}

const notifications: Notification[] = [
  { id: '1', message: 'XRP Price: $0.60 (+2.5%)', type: 'price' },
  { id: '2', message: 'Network Status: Operational', type: 'system' },
  { id: '3', message: 'Latest Block: #12345678', type: 'system' }
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <StarfieldBackground />
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