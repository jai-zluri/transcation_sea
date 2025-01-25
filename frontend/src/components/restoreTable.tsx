

import React from 'react';
import { Transaction } from '../types';
import { RotateCw, XCircle } from 'lucide-react';

interface RestoreTableProps {
  restoreTransactions: Transaction[];
  onUndo: (id: number) => Promise<void>;
  onDeletePermanently: (id: number) => Promise<void>;
  onClose: () => void; // Added onClose prop
}

const RestoreTable: React.FC<RestoreTableProps> = ({
  restoreTransactions,
  onUndo,
  onDeletePermanently,
  onClose, // Destructure the onClose prop
}) => {
  const handleDeletePermanently = (id: number) => {
    if (
      window.confirm(
        `Are you sure you want to delete the transaction permanently?`
      )
    ) {
      onDeletePermanently(id);
    }
  };

  const handleDeleteAllPermanently = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete all the transactions permanently?'
      )
    ) {
      // Delete each transaction one by one
      for (const transaction of restoreTransactions) {
        await onDeletePermanently(transaction.id!);
      }
    }
  };

  return (
   
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Restore Table</h2>
        {restoreTransactions.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDeleteAllPermanently}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Delete All Permanently
          </button>
        </div>
      )}
        <button
          onClick={onClose} // Trigger onClose when the button is clicked
          className="text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <XCircle size={20} /> Close
        </button>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-white">Date</th>
              <th className="px-6 py-3 text-left text-white">Description</th>
              <th className="px-6 py-3 text-right text-white">Original Amount</th>
              <th className="px-6 py-3 text-right text-white">Amount in INR</th>
              <th className="px-6 py-3 text-right text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {restoreTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 max-w-xs truncate">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 text-right">
                  {transaction.amount} {transaction.currency}
                </td>
                <td className="px-6 py-4 text-right">
                  {transaction.amountInINR || 0} INR
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onUndo(transaction.id!)}
                      className="text-green-600 hover:text-green-800 flex items-center gap-1"
                    >
                      <RotateCw size={16} /> Undo
                    </button>
                    <button
                      onClick={() => handleDeletePermanently(transaction.id!)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <XCircle size={16} /> Delete Permanently
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* {restoreTransactions.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDeleteAllPermanently}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Delete All Permanently
          </button>
        </div>
      )} */}
    </div>
  );
};

export default RestoreTable;
