import React from 'react';
import { Anchor, Send, QrCode, History, Droplets, Image } from 'lucide-react';
import Widget from '../Widget/Widget';
import WalletButton from '../WalletButton';
import { useWalletStore } from '../../store/walletStore';
import { useNetworkStore } from '../../store/networkStore';
import ReceiveModal from './ReceiveModal';
import SendModal from './SendModal';
import TransactionHistory from './TransactionHistory';
import NFTViewer from '../NFT/NFTViewer';
import { useWidgetStore } from '../../store/widgetStore';
import { faucetService } from '../../services/faucet';

const WalletPanel: React.FC = () => {
  const { balance, address, isConnected } = useWalletStore();
  const { selectedNetwork } = useNetworkStore();
  const { widgets, updateWidget } = useWidgetStore();
  const [isFunding, setIsFunding] = React.useState(false);
  
  const showReceiveModal = widgets.find(w => w.id === 'receive')?.isVisible;
  const showSendModal = widgets.find(w => w.id === 'send')?.isVisible;
  const showHistory = widgets.find(w => w.id === 'history')?.isVisible;
  const showNFTViewer = widgets.find(w => w.id === 'nft')?.isVisible;
  const canUseFaucet = selectedNetwork.type === 'testnet' || selectedNetwork.type === 'devnet';

  const handleShowReceive = () => {
    if (!isConnected) return;
    const walletWidget = widgets.find(w => w.id === 'wallet');
    if (!walletWidget) return;

    updateWidget({
      id: 'receive',
      isVisible: true,
      x: walletWidget.x + walletWidget.width + 20,
      y: walletWidget.y,
      zIndex: Math.max(...widgets.map(w => w.zIndex)) + 1
    });
  };

  const handleShowSend = () => {
    if (!isConnected) return;
    const walletWidget = widgets.find(w => w.id === 'wallet');
    if (!walletWidget) return;

    updateWidget({
      id: 'send',
      isVisible: true,
      x: walletWidget.x + walletWidget.width + 20,
      y: walletWidget.y,
      zIndex: Math.max(...widgets.map(w => w.zIndex)) + 1
    });
  };

  const handleShowHistory = () => {
    if (!isConnected) return;
    const walletWidget = widgets.find(w => w.id === 'wallet');
    if (!walletWidget) return;

    updateWidget({
      id: 'history',
      isVisible: true,
      x: walletWidget.x + walletWidget.width + 20,
      y: walletWidget.y,
      zIndex: Math.max(...widgets.map(w => w.zIndex)) + 1
    });
  };

  const handleShowNFTViewer = () => {
    if (!isConnected) return;
    const walletWidget = widgets.find(w => w.id === 'wallet');
    if (!walletWidget) return;

    updateWidget({
      id: 'nft',
      isVisible: true,
      x: walletWidget.x + walletWidget.width + 20,
      y: walletWidget.y,
      zIndex: Math.max(...widgets.map(w => w.zIndex)) + 1
    });
  };

  const handleCloseReceive = () => {
    updateWidget({
      id: 'receive',
      isVisible: false
    });
  };

  const handleCloseSend = () => {
    updateWidget({
      id: 'send',
      isVisible: false
    });
  };

  const handleCloseHistory = () => {
    updateWidget({
      id: 'history',
      isVisible: false
    });
  };

  const handleCloseNFTViewer = () => {
    updateWidget({
      id: 'nft',
      isVisible: false
    });
  };

  const handleFaucetFund = async () => {
    if (!address || !canUseFaucet || isFunding) return;
    
    try {
      setIsFunding(true);
      await faucetService.fundWallet(address, selectedNetwork);
    } catch (error) {
      console.error('Failed to fund wallet:', error);
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <>
      <Widget
        id="wallet"
        title={<span>CØVE Wallet</span>}
        icon={Anchor}
        defaultPosition={{ x: 20, y: 80 }}
        defaultSize={{ width: 320, height: 400 }}
      >
        <div className="space-y-6">
          <div>
            <div className="text-sm text-text/70 mb-1">Balance</div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">{balance.toFixed(6)} XRP</div>
              {canUseFaucet && (
                <button
                  onClick={handleFaucetFund}
                  disabled={isFunding}
                  className={`
                    flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors
                    ${isFunding 
                      ? 'bg-primary/10 text-primary/50 cursor-not-allowed'
                      : 'bg-primary/20 hover:bg-primary/30 text-primary cursor-pointer'
                    }
                  `}
                >
                  <Droplets className="w-4 h-4" />
                  <span>{isFunding ? 'Funding...' : 'Faucet'}</span>
                </button>
              )}
            </div>
            {address && (
              <div className="text-sm text-text/50 mt-1 font-mono break-all">
                {address}
              </div>
            )}
          </div>

          {isConnected ? (
            <div className="space-y-3">
              <WalletButton icon={Send} label="Send XRP" onClick={handleShowSend} />
              <WalletButton icon={QrCode} label="Receive" onClick={handleShowReceive} />
              <WalletButton icon={History} label="History" onClick={handleShowHistory} />
              <WalletButton icon={Image} label="NFT Viewer" onClick={handleShowNFTViewer} />
            </div>
          ) : (
            <div className="text-center text-text/50 py-8">
              Connect your wallet to get started
            </div>
          )}
        </div>
      </Widget>

      {isConnected && showReceiveModal && (
        <ReceiveModal onClose={handleCloseReceive} />
      )}

      {isConnected && showSendModal && (
        <SendModal onClose={handleCloseSend} />
      )}

      {isConnected && showHistory && (
        <TransactionHistory onClose={handleCloseHistory} />
      )}

      {isConnected && showNFTViewer && (
        <NFTViewer onClose={handleCloseNFTViewer} />
      )}
    </>
  );
};

export default WalletPanel;