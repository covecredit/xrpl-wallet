import { GraphNode, GraphLink, PriceData } from '../types';

export const mockGraphData = {
  nodes: [
    { id: 'wallet1', label: 'Wallet A', type: 'wallet', value: 1000 },
    { id: 'wallet2', label: 'Wallet B', type: 'wallet', value: 500 },
    { id: 'tx1', label: 'Transaction 1', type: 'transaction', value: 100 },
    { id: 'tx2', label: 'Transaction 2', type: 'transaction', value: 50 },
    { id: 'ledger1', label: 'Ledger #1', type: 'ledger', value: 0 }
  ],
  links: [
    { source: 'wallet1', target: 'tx1', value: 100 },
    { source: 'tx1', target: 'ledger1', value: 100 },
    { source: 'ledger1', target: 'tx2', value: 50 },
    { source: 'tx2', target: 'wallet2', value: 50 }
  ]
};

export const mockPriceData: Record<string, PriceData[]> = {
  '1D': Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (23 - i) * 3600000,
    price: 0.60 + Math.sin(i / 3) * 0.05 + Math.random() * 0.02
  }))
};