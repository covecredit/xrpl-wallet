import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';

interface ReceiveModalProps {
  onClose: () => void;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ onClose }) => {
  const { address } = useWalletStore();
  const [copied, setCopied] = useState(false);
  const destinationTag = "123456"; // Example tag, in real app this would be generated

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center bg-white p-4 rounded-lg">
        <QRCodeSVG
          value={`${address}?dt=${destinationTag}`}
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={false}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-nautical-silver">Wallet Address</label>
          <div className="flex items-center space-x-2 bg-nautical-wave/20 p-3 rounded-lg">
            <input
              type="text"
              value={address}
              readOnly
              className="bg-transparent text-nautical-silver flex-1 outline-none text-sm font-mono"
            />
            <button
              onClick={() => copyToClipboard(address)}
              className="p-2 hover:bg-nautical-wave/30 rounded-full transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-nautical-gold" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-nautical-silver">Destination Tag</label>
          <div className="flex items-center space-x-2 bg-nautical-wave/20 p-3 rounded-lg">
            <input
              type="text"
              value={destinationTag}
              readOnly
              className="bg-transparent text-nautical-silver flex-1 outline-none text-sm font-mono"
            />
            <button
              onClick={() => copyToClipboard(destinationTag)}
              className="p-2 hover:bg-nautical-wave/30 rounded-full transition-colors"
            >
              <Copy className="w-5 h-5 text-nautical-gold" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-sm text-nautical-silver/70 text-center">
        Send only XRP to this address. Ensure the destination tag is included if required by the sending platform.
      </div>
    </div>
  );
};

export default ReceiveModal;