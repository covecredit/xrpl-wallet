import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WalletButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-full px-4 py-3 bg-[#1A1B26] border border-[#FFD700]/20 
                 rounded-lg text-[#FFD700] font-medium transition-all duration-300
                 hover:bg-[#FFD700]/10 button-hover overflow-hidden group"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      <div className="flame-effect" />
    </button>
  );
};

export default WalletButton;