import React from 'react';
import { Wallet, Send, QrCode, History } from 'lucide-react';
import Widget from '../Widget/Widget';
import WalletButton from '../WalletButton';
import { useWalletStore } from '../../store/walletStore';

const WalletPanel: React.FC = () => {
  const { balance, isConnected } = useWalletStore();

  return (
    <Widget
      id="wallet"
      title="XRPL Wallet"
      icon={Wallet}
      defaultPosition={{ x: 20, y: 80 }}
      defaultSize={{ width: 320, height: 400 }}
    >
      <div className="space-y-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">Balance</div>
          <div className="text-2xl font-bold text-primary">{balance.toFixed(2)} XRP</div>
        </div>

        {isConnected ? (
          <div className="space-y-3">
            <WalletButton icon={Send} label="Send XRP" onClick={() => {}} />
            <WalletButton icon={QrCode} label="Receive" onClick={() => {}} />
            <WalletButton icon={History} label="History" onClick={() => {}} />
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            Connect your wallet to get started
          </div>
        )}
      </div>
    </Widget>
  );
};

export default WalletPanel;