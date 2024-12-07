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
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-primary bg-background p-1"
            />
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