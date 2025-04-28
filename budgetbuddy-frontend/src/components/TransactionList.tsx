'use client';
import { motion } from "framer-motion";
import { Transaction } from "@/types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  onRemoveTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onRemoveTransaction 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-slate-700 mb-2">
        Recent Transactions
      </h3>
      {transactions.length === 0 ? (
        <p className="text-slate-500">No transactions yet</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((transaction) => (
            <motion.li
              key={transaction.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex-1">
                <span className="font-medium text-slate-800">
                  {transaction.category}
                  <span className="ml-2 text-sm text-slate-500">
                    ({transaction.type})
                  </span>
                </span>
                <span className="block text-sm text-slate-500">
                  {formatDate(transaction.date)}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`font-semibold ${
                  transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatAmount(transaction.amount)}
                </span>
                <button
                  onClick={() => onRemoveTransaction(transaction.id)}
                  className="ml-3 text-slate-400 hover:text-red-500 transition"
                  aria-label="Remove transaction"
                >
                  ×
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;