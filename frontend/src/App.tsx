


import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
import { TransactionTable } from './components/TransactionTable';
import { Pagination } from './components/Pagination';
import { AddTransactionModal } from './components/AddTransactionModal';
import { transactionService } from './services/api';
import { Transaction, UploadStatus } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import './index.css';

function AppContent() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);

  // Fetch transactions and sort by date
  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getPaginatedTransactions(currentPage);
      const sortedTransactions = data.transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(sortedTransactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    try {
      await transactionService.uploadCSV(file);
      setUploadStatus('success');
      fetchTransactions();
      
      // Auto-hide success message after 2 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      console.error('Error uploading file:', error);
      
      // Auto-hide error message after 2 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 2000);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await transactionService.deleteTransaction(id);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    if (transaction.id === undefined) return;
    try {
      await transactionService.updateTransaction(transaction.id, transaction);
      fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
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

  if (!user) {
    return <LoginPage />;
  }

  return (
    // <div className="min-h-screen bg-gray-50">
    <div className="min-h-screen bg-black">

      {/* Header */}
      {/* <header className="bg-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Transactions Valley
          </h1>
        </div>
      </header> */}
      <header className="bg-black shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <h1 className="text-3xl font-bold text-white">
      Transactions Valley
    </h1>
  </div>
</header>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={"user url"}
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
              onClick={logout}
              className="px-4 py-2 text-red-600 border-2 border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {uploadStatus && (
          <div
            className={`mb-4 p-4 rounded-md transition-all duration-300 ${
              uploadStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : uploadStatus === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
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

        {/* Transaction Table */}
        <div className="bg-white rounded-lg shadow">
          <TransactionTable 
            transactions={transactions}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
            selectedTransactions={selectedTransactions}
            setSelectedTransactions={setSelectedTransactions}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Modals */}
        {isAddingTransaction && (
          <AddTransactionModal
            onClose={() => setIsAddingTransaction(false)}
            onSave={handleAddTransaction}
          />
        )}
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
