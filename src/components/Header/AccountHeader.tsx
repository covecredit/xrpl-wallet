import React from 'react';
import { Key, Lock } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import SettingsDropdown from './SettingsDropdown';

const AccountHeader: React.FC = () => {
  const { isConnected, setConnected } = useWalletStore();

  const handleConnect = () => {
    setConnected(true);
  };

  const handleDisconnect = () => {
    setConnected(false);
  };

  return (
    <div className="fixed top-0 right-0 flex items-center space-x-4 p-4 z-50">
      <div className="flex items-center space-x-4">
        {isConnected ? (
          <>
            <div className="w-10 h-10 rounded-full border-2 border-primary bg-background flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <button 
              onClick={handleDisconnect}
              className="flex items-center space-x-2 bg-primary text-background px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              <Lock className="w-5 h-5" />
              <span>Disconnect</span>
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full border-2 border-gray-400 bg-background flex items-center justify-center">
              <span className="text-2xl text-gray-400">?</span>
            </div>
            <button 
              onClick={handleConnect}
              className="flex items-center space-x-2 bg-primary text-background px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              <Key className="w-5 h-5" />
              <span>Connect Key</span>
            </button>
          </>
        )}
        <SettingsDropdown />
      </div>
    </div>
  );
};

export default AccountHeader;