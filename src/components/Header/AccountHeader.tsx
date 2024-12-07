import React, { useState } from 'react';
import { Key, Lock } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import SettingsDropdown from './SettingsDropdown';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ConnectWalletModal from '../Wallet/ConnectWalletModal';

const AccountHeader: React.FC = () => {
  const { isConnected, disconnect } = useWalletStore();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleConnect = () => {
    setShowConnectModal(true);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <>
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

      {showConnectModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-primary/30 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-primary">Connect Wallet</h2>
              <button 
                onClick={() => setShowConnectModal(false)}
                className="text-text hover:text-primary"
              >
                ✕
              </button>
            </div>
            <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default AccountHeader;