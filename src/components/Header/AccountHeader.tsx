import React from 'react';
import { Key, Lock } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import SettingsDropdown from './SettingsDropdown';
import { motion } from 'framer-motion';

const AccountHeader: React.FC = () => {
  const { isConnected, setConnected } = useWalletStore();

  const handleConnect = () => {
    setConnected(true);
  };

  const handleDisconnect = () => {
    setConnected(false);
  };

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-full border-2 border-primary bg-background flex items-center justify-center"
          >
            <span className="text-2xl">🎉</span>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleDisconnect}
            className="flex items-center space-x-2 bg-primary text-background px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <Lock className="w-5 h-5" />
            <span>Disconnect</span>
          </motion.button>
        </>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-full border-2 border-gray-400 bg-background flex items-center justify-center"
          >
            <span className="text-2xl text-gray-400">?</span>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleConnect}
            className="flex items-center space-x-2 bg-primary text-background px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <Key className="w-5 h-5" />
            <span>Connect Key</span>
          </motion.button>
        </>
      )}
      <SettingsDropdown />
    </div>
  );
};

export default AccountHeader;