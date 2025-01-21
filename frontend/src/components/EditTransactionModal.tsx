import React, { useState } from 'react';
import { Transaction } from '../types';

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
  const [formData, setFormData] = useState(transaction);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData); // Pass the updated transaction back to the parent
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
