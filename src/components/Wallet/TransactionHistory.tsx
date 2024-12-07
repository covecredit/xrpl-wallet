import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  fee: number;
  timestamp: string;
  address: string;
}

const TransactionHistory: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'receive',
      amount: 100,
      fee: 0.00001,
      timestamp: '2024-03-06T12:00:00Z',
      address: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
    },
    {
      id: '2',
      type: 'send',
      amount: 50,
      fee: 0.00001,
      timestamp: '2024-03-06T11:30:00Z',
      address: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe'
    }
  ];

  return (
    <div className="bg-nautical-navy/50 rounded-lg p-4">
      <h2 className="text-xl font-bold text-nautical-silver mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-nautical-silver border-b border-nautical-wave">
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Amount (XRP)</th>
              <th className="py-2 px-4 text-left">Fee</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-nautical-wave/30 hover:bg-nautical-wave/20">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {tx.type === 'receive' ? (
                      <ArrowDownLeft className="text-green-400" />
                    ) : (
                      <ArrowUpRight className="text-red-400" />
                    )}
                    <span className={tx.type === 'receive' ? 'text-green-400' : 'text-red-400'}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-nautical-silver">{tx.amount}</td>
                <td className="py-3 px-4 text-nautical-silver">{tx.fee}</td>
                <td className="py-3 px-4 text-nautical-silver">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className="text-nautical-gold">
                    {`${tx.address.slice(0, 6)}...${tx.address.slice(-6)}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;