


// components/AddTransactionModal.tsx
import React, { useState } from 'react';
import { Transaction } from '../types';
import { validation } from '../utils/validation';
import { currencyUtils } from '../utils/currency';

interface AddTransactionModalProps {
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  checkDuplicate?: (newTransaction: Omit<Transaction, 'id'>) => boolean;
  existingTransactions: Transaction[]; // Add this line
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  onClose,
  onSave,
  existingTransactions,
}) => {
  const [transaction, setTransaction] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    currency: 'USD',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateTransaction = (): boolean => {
    const newErrors: string[] = [];

    if (!validation.isValidDate(transaction.date)) {
      newErrors.push('Date must be between 1980 and 2030');
    }

    if (!validation.isValidAmount(transaction.amount)) {
      newErrors.push('Amount must be greater than 0 and have up to 2 decimal places');
    }

    if (!validation.isValidDescription(transaction.description)) {
      newErrors.push('Description must contain alphabets');
    }

    if (validation.isDuplicateTransaction(transaction, existingTransactions)) {
      newErrors.push('This appears to be a duplicate transaction');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTransaction()) {
      setIsSubmitting(true);
      try {
        await onSave(transaction);
        onClose();
      } catch (error) {
        console.error('Error saving transaction:', error);
        setErrors(['Failed to save transaction. Please try again.']);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              min="1980-01-01"
              max="2030-12-31"
              value={transaction.date}
              onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              value={transaction.description}
              onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={transaction.amount}
              onChange={(e) => setTransaction({ ...transaction, amount: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={transaction.currency}
              onChange={(e) => setTransaction({ ...transaction, currency: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              {currencyUtils.currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
