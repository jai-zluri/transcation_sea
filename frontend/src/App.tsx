import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
import { TransactionTable } from './components/TransactionTable';
import { AddTransactionModal } from './components/AddTransactionModal';
import RestoreTable from './components/restoreTable';

import { transactionService } from './services/api';
import { Transaction, UploadStatus } from './types/index';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import './index.css';
import { csvHandler } from './utils/csvHandler';

function AppContent() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [restoreTransactions, setRestoreTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [restoreCurrentPage, setRestoreCurrentPage] = useState(1);
  const [globalSeen, setGlobalSeen] = useState<Set<string>>(new Set<string>());
  const [totalPages, setTotalPages] = useState(1);
  const [restoreTotalPages, setRestoreTotalPages] = useState(1);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isRestoreVisible, setIsRestoreVisible] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState(25);
  const [restorePageSize, setRestorePageSize] = useState(25);
  const [deletedTransaction, setDeletedTransaction] = useState<Transaction | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      const sortedTransactions = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(sortedTransactions);
      setTotalPages(Math.ceil(sortedTransactions.length / pageSize));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(transactions.length / pageSize));
  }, [transactions, pageSize]);

  useEffect(() => {
    setRestoreTotalPages(Math.ceil(restoreTransactions.length / restorePageSize));
  }, [restoreTransactions, restorePageSize]);

  const handleRestoreToggle = () => {
    setIsRestoreVisible(!isRestoreVisible);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setUploadStatus('uploading');
    try {
      const fileContent = await file.text();
      if (!fileContent.trim()) {
        throw new Error('The file is empty or invalid.');
      }

      const { validTransactions, errors } = csvHandler.parseCSV(fileContent);

      if (errors.length > 0) {
        alert(`Errors:\n${errors.join('\n')}`);
        setUploadStatus('error');
        return;
      }

      setTransactions(prev => [...prev, ...validTransactions]);
      setUploadStatus('success');
    } catch (error: any) {
      setUploadStatus('error');
      console.error('Error uploading file:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setTimeout(() => setUploadStatus(null), 2000);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;

    setRestoreTransactions(prev => [...prev, transactionToDelete]);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleBulkDelete = async () => {
    const toDelete = transactions.filter(t => selectedTransactions.includes(t.id!));
    setRestoreTransactions(prev => [...prev, ...toDelete]);
    setTransactions(prev => prev.filter(t => !selectedTransactions.includes(t.id!)));
    setSelectedTransactions([]);
  };

  const handleUndoTransaction = async (id: number) => {
    const restoredTransaction = restoreTransactions.find(t => t.id === id);
    if (restoredTransaction) {
      setTransactions(prev => [...prev, restoredTransaction]);
      setRestoreTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleRestoreAll = async () => {
    for (const transaction of restoreTransactions) {
      setTransactions(prev => [...prev, transaction]);
    }
    setRestoreTransactions([]);
  };

  const handleDeletePermanently = async (id: number) => {
    await transactionService.deleteTransaction(id);
    setRestoreTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = async (updatedTransaction: Transaction) => {
    try {
      console.log('Updating transaction:', updatedTransaction);

      const response = await transactionService.updateTransaction(updatedTransaction.id!, updatedTransaction);
      console.log('API Update Response:', response);

      await fetchTransactions();

      console.log('Transaction updated successfully.');
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      await transactionService.addTransaction(transactionData);
      setIsAddingTransaction(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleAdd = async (newTransaction: Transaction) => {
  };

  const handleTransactionsView = () => {
    setIsRestoreVisible(false);
  };

  if (!user) {
    return <LoginPage />;
  }

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedRestoreTransactions = restoreTransactions.slice(
    (restoreCurrentPage - 1) * restorePageSize,
    restoreCurrentPage * restorePageSize
  );

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 onClick={handleTransactionsView} className="text-3xl font-bold text-white cursor-pointer">
            Transactions Valley
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || ''}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl font-semibold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">{user.displayName}</span>
              <span className="text-sm text-white">{user.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => document.getElementById('csvInput')?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">UPLOAD CSV</span>
            </button>
            <input
              id="csvInput"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => setIsAddingTransaction(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              Add Transaction
            </button>
            <button
              onClick={handleRestoreToggle}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
            >
              Restore
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-red-600 border-2 border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {uploadStatus && (
          <div
            className={`mb-4 p-4 rounded-md transition-all duration-300 ${uploadStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : uploadStatus === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'}`}
          >
            <div className="flex items-center gap-2">
              {uploadStatus === 'uploading' && <Loader2 className="animate-spin" />}
              {uploadStatus === 'success' && <Check />}
              {uploadStatus === 'error' && <AlertCircle />}
              <span>
                {uploadStatus === 'uploading' && 'Uploading...'}
                {uploadStatus === 'success' && 'Upload Successful!'}
                {uploadStatus === 'error' && 'Upload Failed!'}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          {isRestoreVisible ? (
            <RestoreTable
              restoreTransactions={paginatedRestoreTransactions}
              onUndo={handleUndoTransaction}
              onRestoreAll={handleRestoreAll}
              onDeletePermanently={handleDeletePermanently}
              onClose={() => setIsRestoreVisible(false)}
              currentPage={restoreCurrentPage}
              totalPages={restoreTotalPages}
              pageSize={restorePageSize}
              onPageChange={setRestoreCurrentPage}
              onPageSizeChange={setRestorePageSize}
            />
          ) : (
            <TransactionTable
              transactions={paginatedTransactions}
              onDelete={handleDeleteTransaction}
              onBulkDelete={handleBulkDelete}
              onAdd={handleAdd}
              onEdit={handleEditTransaction}
              selectedTransactions={selectedTransactions}
              setSelectedTransactions={setSelectedTransactions}
              pageSize={pageSize}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}

          {isAddingTransaction && (
            <AddTransactionModal
              onClose={() => setIsAddingTransaction(false)}
              onSave={handleAddTransaction}
              existingTransactions={transactions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;