import { create } from 'zustand';

interface WalletState {
  balance: number;
  address: string;
  isConnected: boolean;
  setBalance: (balance: number) => void;
  setAddress: (address: string) => void;
  setConnected: (isConnected: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 1234.56,
  address: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  isConnected: false,
  setBalance: (balance) => set({ balance }),
  setAddress: (address) => set({ address }),
  setConnected: (isConnected) => set({ isConnected })
}));