

import React, { useState } from 'react';
import { Transaction } from '../types';
import { validation } from '../utils/validation';
import { currencyUtils } from '../utils/currency';

interface Props {
  transaction: Transaction;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

export const EditTransactionModal: React.FC<Props> = ({
  transaction,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    ...transaction,
    date: transaction.date
      ? transaction.date.split('T')[0]
      : new Date().toISOString().split('T')[0], // Format date
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateTransaction = (): boolean => {
    const newErrors: string[] = [];

    if (!validation.isValidDate(formData.date)) {
      newErrors.push('Date must be between 1980 and 2030');
    }

    if (!validation.isValidAmount(formData.amount)) {
      newErrors.push('Amount must be greater than 0 ');
    }

    if (!validation.isValidDescription(formData.description)) {
      newErrors.push('Description must contain characters');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name}, Value: ${value}`); // Debugging state updates

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData); // Debugging submit

    if (validateTransaction()) {
      onSave({
        ...formData,
        date: new Date(formData.date).toISOString(),
      });
    } else {
      console.log('Validation failed with errors:', errors); // Debugging validation
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
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
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              min="1980-01-01"
              max="2030-12-31"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
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
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              {currencyUtils.currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
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
