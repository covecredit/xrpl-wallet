export interface Notification {
  id: string;
  message: string;
  type: 'price' | 'system' | 'transaction';
}

export interface WalletTransaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  timestamp: Date;
  address: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PriceData {
  timestamp: number;
  price: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'wallet' | 'transaction' | 'ledger';
  value: number;
}