

import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatters } from '../utils/formatters';
import { EditTransactionModal } from './EditTransactionModal';
import { Pencil, Trash2, Download } from 'lucide-react';
import { generateTransactionsPDF } from '../utils/pdfGenerator';
import { currencyUtils } from '../utils/currency';
import Notification from './Notification'; 

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onEdit: (transaction: Transaction) => Promise<void>;
  onAdd: (transaction: Transaction) => Promise<void>;
  selectedTransactions: number[];
  setSelectedTransactions: React.Dispatch<React.SetStateAction<number[]>>;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDelete,
  onBulkDelete,
  onEdit,
  onAdd,
  selectedTransactions,
  setSelectedTransactions,
  pageSize,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success');
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [deleteConfirmationTransactionId, setDeleteConfirmationTransactionId] = useState<number | null>(null);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setIsNotificationVisible(true);
  };

  const handleDownloadPDF = () => {
    generateTransactionsPDF(transactions);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmationTransactionId(id);
    setIsDeleteConfirmationVisible(true);
  };

  const confirmDeleteTransaction = async () => {
    if (deleteConfirmationTransactionId !== null) {
      await onDelete(deleteConfirmationTransactionId);
      showNotification('Transaction deleted successfully!', 'success');
      setIsDeleteConfirmationVisible(false);
      setDeleteConfirmationTransactionId(null);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleteConfirmationVisible(true);
  };

  const confirmBulkDelete = async () => {
    await onBulkDelete();
    showNotification('Selected transactions deleted successfully!', 'success');
    setIsDeleteConfirmationVisible(false);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmationVisible(false);
    setDeleteConfirmationTransactionId(null);
  };

  const handleEditTransaction = async (updatedTransaction: Transaction) => {
    try {
      await onEdit(updatedTransaction);
      setEditingTransaction(null);
      showNotification('Transaction edited successfully!', 'success');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        showNotification(error.response.data.error, 'error'); // Display the error message from the backend
      } else {
        showNotification('Failed to edit transaction.', 'error');
      }
    }
  };

  const handleAddTransaction = async (newTransaction: Transaction) => {
    await onAdd(newTransaction);
    showNotification('Transaction added successfully!', 'success');
  };

  const toggleSelection = (id: number) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPageTransactionIds = transactions.map((transaction) => transaction.id!);
    const areAllSelected = currentPageTransactionIds.every((id) => selectedTransactions.includes(id));

    if (areAllSelected) {
      setSelectedTransactions((prev) => prev.filter((id) => !currentPageTransactionIds.includes(id)));
    } else {
      setSelectedTransactions((prev) => Array.from(new Set([...prev, ...currentPageTransactionIds])));
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10);
    onPageSizeChange(newSize);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <>
      {/* Notification Component */}
      <Notification
        message={notificationMessage}
        type={notificationType}
        isVisible={isNotificationVisible}
        onClose={() => setIsNotificationVisible(false)}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-4">
              Do you want to delete the selected transaction(s)?
            </p>
            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={deleteConfirmationTransactionId ? confirmDeleteTransaction : confirmBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Download size={16} />
          Download PDF
        </button>
        {selectedTransactions.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Delete Selected ({selectedTransactions.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-6 py-3 text-left text-white">
                <input
                  type="checkbox"
                  checked={transactions.length > 0 && transactions.every((transaction) =>
                    selectedTransactions.includes(transaction.id!)
                  )}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-white">Date</th>
              <th className="px-6 py-3 text-left text-white">Description</th>
              <th className="px-6 py-3 text-right text-white">Original Amount</th>
              <th className="px-6 py-3 text-right text-white">Amount in INR</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`${
                  selectedTransactions.includes(transaction.id!) ? 'bg-gray-100' : ''
                } group`} // Group for hover effect
                style={{ cursor: 'pointer' }}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(transaction.id!)}
                    onChange={() => toggleSelection(transaction.id!)}
                  />
                </td>
                <td className="px-6 py-4">{formatters.formatDate(transaction.date)}</td>
                <td className="px-6 py-4 max-w-xs truncate">{transaction.description}</td>
                <td className="px-6 py-4 text-right">
                  {formatters.formatAmountWithCurrency(transaction.amount, transaction.currency)}
                </td>
                <td className="px-6 py-4 text-right">
                  {formatters.formatAmountWithCurrency(
                    currencyUtils.convertToINR(transaction.amount, transaction.currency),
                    'INR'
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit transaction"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(transaction.id!)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete transaction"
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="mr-2">Page Size:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-2 py-1 rounded-md"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-500' : 'text-blue-600 hover:text-blue-800'}`}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-gray-500' : 'text-blue-600 hover:text-blue-800'}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleEditTransaction}
        />
      )}
    </>
  );
};