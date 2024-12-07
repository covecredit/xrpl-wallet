import React, { useState, useEffect } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import Widget from '../Widget/Widget';
import { useWalletStore } from '../../store/walletStore';
import { xrplService } from '../../services/xrpl';
import { dropsToXrp } from 'xrpl';

interface Transaction {
  type: string;
  hash: string;
  date: string;
  amount?: string;
  fee: string;
  sender: string;
  receiver?: string;
  result: string;
  sequence: number;
  memos?: { type?: string; data?: string; format?: string }[];
}

const TransactionHistory: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { address } = useWalletStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      try {
        setLoading(true);
        setError(null);

        const client = xrplService.getClient();
        if (!client) throw new Error('Not connected to network');

        const response = await client.request({
          command: 'account_tx',
          account: address,
          limit: 100 // Increased limit
        });

        const txs = response.result.transactions.map((tx: any) => {
          const transaction = tx.tx;
          const meta = tx.meta;
          
          // Extract memos if present
          const memos = transaction.Memos?.map((memo: any) => ({
            type: memo.Memo.MemoType ? Buffer.from(memo.Memo.MemoType, 'hex').toString('utf8') : undefined,
            data: memo.Memo.MemoData ? Buffer.from(memo.Memo.MemoData, 'hex').toString('utf8') : undefined,
            format: memo.Memo.MemoFormat ? Buffer.from(memo.Memo.MemoFormat, 'hex').toString('utf8') : undefined
          }));

          return {
            type: transaction.TransactionType,
            hash: transaction.hash,
            date: new Date(transaction.date * 1000).toLocaleString(),
            amount: transaction.Amount ? dropsToXrp(transaction.Amount) : undefined,
            fee: dropsToXrp(transaction.Fee),
            sender: transaction.Account,
            receiver: transaction.Destination,
            result: meta.TransactionResult,
            sequence: transaction.Sequence,
            memos
          };
        });

        setTransactions(txs);
      } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        setError(error.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  const getExplorerUrl = (hash: string) => {
    const network = xrplService.getCurrentNetwork();
    if (network?.type === 'testnet') {
      return `https://testnet.xrpl.org/transactions/${hash}`;
    }
    if (network?.type === 'devnet') {
      return `https://devnet.xrpl.org/transactions/${hash}`;
    }
    return `https://livenet.xrpl.org/transactions/${hash}`;
  };

  return (
    <Widget
      id="history"
      title="Transaction History"
      icon={History}
      defaultPosition={{ x: 360, y: 80 }}
      defaultSize={{ width: 1200, height: 600 }}
      onClose={onClose}
    >
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-text/50 p-4">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-primary/20">
                  <th className="py-3 px-4 text-primary">Type</th>
                  <th className="py-3 px-4 text-primary">Date</th>
                  <th className="py-3 px-4 text-primary">Amount</th>
                  <th className="py-3 px-4 text-primary">Fee</th>
                  <th className="py-3 px-4 text-primary">From</th>
                  <th className="py-3 px-4 text-primary">To</th>
                  <th className="py-3 px-4 text-primary">Status</th>
                  <th className="py-3 px-4 text-primary">Memo</th>
                  <th className="py-3 px-4 text-primary">Details</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.hash} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {tx.sender === address ? (
                          <ArrowUpRight className="w-4 h-4 text-red-400" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-green-400" />
                        )}
                        <span>{tx.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-text/70">{tx.date}</td>
                    <td className="py-4 px-4">
                      {tx.amount && (
                        <span className={tx.sender === address ? 'text-red-400' : 'text-green-400'}>
                          {tx.sender === address ? '-' : '+'}{tx.amount} XRP
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-text/70">{tx.fee} XRP</td>
                    <td className="py-4 px-4 font-mono text-sm">
                      {tx.sender.slice(0, 8)}...{tx.sender.slice(-8)}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm">
                      {tx.receiver ? `${tx.receiver.slice(0, 8)}...${tx.receiver.slice(-8)}` : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`
                        px-2 py-1 rounded text-sm
                        ${tx.result === 'tesSUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                      `}>
                        {tx.result}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {tx.memos?.map((memo, index) => (
                        <div key={index} className="text-text/70">
                          {memo.data}
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={getExplorerUrl(tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary hover:text-primary/80"
                      >
                        <span>View</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Widget>
  );
};

export default TransactionHistory;