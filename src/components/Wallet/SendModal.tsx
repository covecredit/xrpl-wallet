import React, { useState, useRef } from 'react';
import { Send, QrCode, Upload, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Widget from '../Widget/Widget';
import { useWalletStore } from '../../store/walletStore';
import { xrplService } from '../../services/xrpl';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface SendModalProps {
  onClose: () => void;
}

const SendModal: React.FC<SendModalProps> = ({ onClose }) => {
  const { balance } = useWalletStore();
  const [address, setAddress] = useState('');
  const [destinationTag, setDestinationTag] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleSend = async () => {
    try {
      setError(null);
      setIsSending(true);

      if (!address || !amount) {
        throw new Error('Please fill in all required fields');
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (amountNum > balance) {
        throw new Error('Insufficient balance');
      }

      const client = xrplService.getClient();
      const wallet = xrplService.getWallet();

      if (!client || !wallet) {
        throw new Error('Wallet not connected');
      }

      const payment = {
        TransactionType: 'Payment',
        Account: wallet.address,
        Destination: address,
        Amount: xrplService.xrpToDrops(amountNum),
      };

      if (destinationTag) {
        const tag = parseInt(destinationTag);
        if (!isNaN(tag)) {
          payment.DestinationTag = tag;
        }
      }

      const prepared = await client.autofill(payment);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      if (result.result.meta.TransactionResult === 'tesSUCCESS') {
        onClose();
      } else {
        throw new Error(`Transaction failed: ${result.result.meta.TransactionResult}`);
      }
    } catch (error: any) {
      console.error('Send error:', error);
      setError(error.message || 'Failed to send XRP');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          try {
            const code = new Html5QrcodeScanner('reader', { 
              fps: 10,
              qrbox: 250
            });
            const result = await code.scan();
            handleQRCodeResult(result);
          } catch (error) {
            console.error('QR code scan error:', error);
            setError('Failed to read QR code');
          }
        };
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to process image');
    }
  };

  const startScanner = () => {
    setIsScanning(true);
    scannerRef.current = new Html5QrcodeScanner('reader', { 
      fps: 10,
      qrbox: 250
    });
    scannerRef.current.render(handleQRCodeResult, handleQRCodeError);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQRCodeResult = (result: string) => {
    try {
      const url = new URL(result);
      setAddress(url.pathname.replace('/', ''));
      
      const tag = url.searchParams.get('dt');
      if (tag) {
        setDestinationTag(tag);
      }

      stopScanner();
    } catch {
      // If not a URL, try using the result directly as an address
      setAddress(result);
      stopScanner();
    }
  };

  const handleQRCodeError = (error: any) => {
    console.error('QR code error:', error);
  };

  return (
    <Widget
      id="send"
      title="Send XRP"
      icon={Send}
      defaultPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 250 }}
      defaultSize={{ width: 400, height: 500 }}
      onClose={onClose}
    >
      <div className="space-y-6 p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-text">Destination Address</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter destination address"
                className="flex-1 px-4 py-2 bg-background/50 border border-primary/30 rounded-lg 
                         text-text placeholder-text/50 focus:outline-none focus:border-primary"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors"
                  title="Upload QR Code"
                >
                  <Upload className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={() => isScanning ? stopScanner() : startScanner()}
                  className="p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors"
                  title="Scan QR Code"
                >
                  {isScanning ? (
                    <X className="w-5 h-5 text-primary" />
                  ) : (
                    <Camera className="w-5 h-5 text-primary" />
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div id="reader" className="w-full" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-sm text-text">Destination Tag (Optional)</label>
            <input
              type="text"
              value={destinationTag}
              onChange={(e) => setDestinationTag(e.target.value)}
              placeholder="Enter destination tag"
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg 
                       text-text placeholder-text/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text">Amount (Available: {balance} XRP)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.000001"
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg 
                       text-text placeholder-text/50 focus:outline-none focus:border-primary"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-primary/30 text-primary rounded-lg font-medium
                     hover:bg-primary/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!address || !amount || isSending}
            className="flex-1 px-4 py-3 bg-primary text-background rounded-lg font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {isSending ? 'Sending...' : 'Send XRP'}
          </button>
        </div>
      </div>
    </Widget>
  );
};

export default SendModal;