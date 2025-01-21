
// TransactionTable.tsx
import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatters } from '../utils/formatters';
import { EditTransactionModal } from './EditTransactionModal';
import { Pencil, Trash2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
  selectedTransactions: number[];
  setSelectedTransactions: (ids: number[]) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDelete,
  onEdit,
  selectedTransactions,
  setSelectedTransactions,
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTransactions(transactions.map(t => t.id!).filter(id => id !== undefined));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (id: number) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter(t => t !== id));
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };

  if (!Array.isArray(transactions)) {
    return <div>No transactions available.</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        {/* <table className="min-w-full bg-white"> */}
        <table className="min-w-full bg-blue-100">

          {/* <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedTransactions.length === transactions.length}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-blue-800 uppercase tracking-wider">
                  Date
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-blue-800 uppercase tracking-wider">
                  Description
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-blue-800 uppercase tracking-wider">
                  Original Amount
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-blue-800 uppercase tracking-wider">
                  Amount in INR
                </span>
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead> */}
     
     <thead className="bg-blue-700">
  <tr>
    <th className="px-6 py-3 text-left">
      <input
        type="checkbox"
        onChange={handleSelectAll}
        checked={selectedTransactions.length === transactions.length}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    </th>
    <th className="px-6 py-3 text-left">
      <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
        Date
      </span>
    </th>
    <th className="px-6 py-3 text-left">
      <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
        Description
      </span>
    </th>
    <th className="px-6 py-3 text-left">
      <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
        Original Amount
      </span>
    </th>
    <th className="px-6 py-3 text-left">
      <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
        Amount in INR
      </span>
    </th>
    <th className="px-6 py-3"></th>
  </tr>
</thead>



          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(transaction.id!)}
                    onChange={() => handleSelectTransaction(transaction.id!)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatters.formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 max-w-xs truncate">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatters.formatCurrency(transaction.amount, transaction.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatters.formatCurrency(transaction.amount, 'INR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded-full transition-colors duration-200"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => transaction.id !== undefined && onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={(updatedTransaction) => {
            onEdit(updatedTransaction);
            setEditingTransaction(null);
          }}
        />
      )}
    </>
  );
};