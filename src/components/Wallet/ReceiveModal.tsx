import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import { useNetworkStore } from '../../store/networkStore';
import { xrplService } from '../../services/xrpl';
import Widget from '../Widget/Widget';

interface ReceiveModalProps {
  onClose: () => void;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ onClose }) => {
  const { address, isActivated } = useWalletStore();
  const { selectedNetwork } = useNetworkStore();
  const [copied, setCopied] = useState(false);
  const [memo, setMemo] = useState('');
  const [reserveAmount, setReserveAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchReserve = async () => {
      try {
        const client = xrplService.getClient();
        if (!client) return;

        const response = await client.request({
          command: 'server_info'
        });

        const reserveBase = Number(response.result.info.validated_ledger.reserve_base_xrp);
        setReserveAmount(reserveBase);
      } catch (error) {
        console.error('Failed to fetch reserve amount:', error);
      }
    };

    fetchReserve();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const qrValue = memo ? `${address}?dt=${encodeURIComponent(memo)}` : address;

  return (
    <Widget
      id="receive"
      title="Receive XRP"
      icon={QRCodeSVG}
      defaultPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 250 }}
      defaultSize={{ width: 400, height: 500 }}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* Account Status Message */}
        {isActivated ? (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-200">
              Account reserve met. Wallet is active and ready for transactions.
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-200">
              <p>This wallet has not been activated. A minimum of {reserveAmount} XRP is required to activate the wallet.</p>
              <p className="mt-2">The account reserve is a requirement of the XRP Ledger that helps prevent spam and maintain the health of the network.</p>
            </div>
          </div>
        )}

        <div className="flex justify-center bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={qrValue}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-text">Wallet Address</label>
            <div className="flex items-center space-x-2 bg-background/50 p-3 rounded-lg">
              <input
                type="text"
                value={address}
                readOnly
                className="bg-transparent text-text flex-1 outline-none text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(address)}
                className="p-2 hover:bg-primary/20 rounded-full transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text">Destination Tag (Optional)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Enter destination tag"
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg 
                       text-text placeholder-text/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="text-sm text-text/70 text-center">
            Only send XRP to this address. Include the destination tag if required by the sending platform.
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default ReceiveModal;