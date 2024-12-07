import { create } from 'zustand';
import { Wallet } from 'xrpl';
import { storageService } from '../services/storage';
import { useNetworkStore } from './networkStore';
import { xrplService } from '../services/xrpl';
import { balanceService } from '../services/balance';

interface WalletState {
  balance: number;
  isActivated: boolean;
  address: string;
  seed: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: (seed: string) => Promise<void>;
  disconnect: () => Promise<void>;
  updateBalance: (balance: number, isActivated: boolean) => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  isActivated: false,
  address: '',
  seed: storageService.get('seed'),
  isConnected: false,
  isConnecting: false,
  error: null,

  connect: async (seed: string) => {
    try {
      set({ isConnecting: true, error: null });
      const { selectedNetwork } = useNetworkStore.getState();
      
      console.log('Connecting to network:', selectedNetwork.name);
      await xrplService.connect(selectedNetwork);

      console.log('Creating wallet...');
      const { wallet, balance } = await xrplService.createWallet(seed);
      const isActivated = balance >= 10;

      console.log('Wallet created:', { address: wallet.address, balance, isActivated });

      set({
        seed,
        address: wallet.address,
        balance,
        isActivated,
        isConnected: true,
        error: null
      });

      storageService.set('seed', seed);

      // Start balance updates
      const unsubscribe = await balanceService.subscribeToBalanceUpdates(
        wallet.address,
        (newBalance, newIsActivated) => {
          set({ balance: newBalance, isActivated: newIsActivated });
        }
      );

      // Store unsubscribe function for cleanup
      (window as any).__balanceUnsubscribe = unsubscribe;

    } catch (error: any) {
      console.error('Connection error:', error);
      set({ error: error.message || 'Failed to connect wallet' });
      throw error;
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: async () => {
    // Clean up balance subscription
    if ((window as any).__balanceUnsubscribe) {
      (window as any).__balanceUnsubscribe();
      delete (window as any).__balanceUnsubscribe;
    }

    await xrplService.disconnect();
    set({
      seed: null,
      address: '',
      balance: 0,
      isActivated: false,
      isConnected: false,
      error: null
    });
    storageService.remove('seed');
  },

  updateBalance: (balance: number, isActivated: boolean) => {
    set({ balance, isActivated });
  },

  clearError: () => {
    set({ error: null });
  }
}));

// Auto-connect if seed exists in storage
const savedSeed = storageService.get('seed');
if (savedSeed) {
  useWalletStore.getState().connect(savedSeed).catch(console.error);
}