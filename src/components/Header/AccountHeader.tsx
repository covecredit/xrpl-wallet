import React from 'react';
import { Key, Lock } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import SettingsDropdown from './SettingsDropdown';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const AccountHeader: React.FC = () => {
  const { isConnected, setConnected } = useWalletStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleConnect = () => {
    setConnected(true);
  };

  const handleDisconnect = () => {
    setConnected(false);
  };

  return (
    <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
      {isConnected ? (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-primary bg-background flex items-center justify-center"
          >
            <span className="text-xl md:text-2xl">🎉</span>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleDisconnect}
            className="flex items-center space-x-2 bg-primary text-background px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm md:text-base"
          >
            <Lock className="w-4 h-4 md:w-5 md:h-5" />
            <span>Disconnect</span>
          </motion.button>
        </>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-gray-400 bg-background flex items-center justify-center"
          >
            <span className="text-xl md:text-2xl text-gray-400">?</span>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleConnect}
            className="flex items-center space-x-2 bg-primary text-background px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm md:text-base"
          >
            <Key className="w-4 h-4 md:w-5 md:h-5" />
            <span>Connect</span>
          </motion.button>
        </>
      )}
      <SettingsDropdown />
    </div>
  );
};

export default AccountHeader;