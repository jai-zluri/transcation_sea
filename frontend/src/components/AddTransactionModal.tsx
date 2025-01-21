

import React, { useState } from 'react';
import { Transaction } from '../types';

interface AddTransactionModalProps {
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  onClose,
  onSave,
}) => {
  const [transaction, setTransaction] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0], // Default to current date
    description: '',
    amount: 0,
    currency: 'USD',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(transaction);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={transaction.date}
            onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            value={transaction.description}
            onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            value={transaction.amount}
            onChange={(e) =>
              setTransaction({ ...transaction, amount: parseFloat(e.target.value) })
            }
            placeholder="Amount"
            className="w-full p-2 border rounded-md"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
