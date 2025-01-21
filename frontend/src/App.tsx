


// import React, { useState, useEffect } from 'react';
// import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
// import { TransactionTable } from './components/TransactionTable';
// import { Pagination } from './components/Pagination';
// import { AddTransactionModal } from './components/AddTransactionModal';
// import { transactionService } from './services/api';
// import { Transaction, UploadStatus } from './types';
// import './index.css';



// function App() {
 
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
//   const [isAddingTransaction, setIsAddingTransaction] = useState(false);

 


//   // Fetch transactions and sort by date
// const fetchTransactions = async () => {
//   try {
//     const data = await transactionService.getPaginatedTransactions(currentPage);
//     console.log('Fetched data:', data);

//     // Sort transactions by date in descending order (latest first)
//     const sortedTransactions = data.transactions.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );

//     setTransactions(sortedTransactions); // Set sorted transactions
//     setTotalPages(data.totalPages); // Extract and set total pages
//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//   }
// };





//   useEffect(() => {
//     fetchTransactions();
//   }, [currentPage]);

//   // Handle CSV file upload
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setUploadStatus('uploading');
//     try {
//       await transactionService.uploadCSV(file); // Upload CSV
//       setUploadStatus('success');
//       fetchTransactions(); // Reload transactions after successful upload
//     } catch (error) {
//       setUploadStatus('error');
//       console.error('Error uploading file:', error);
//     }
//   };


//   //handleing delete edit

//   // Add these methods to your App component
//   const handleDeleteTransaction = async (id: number) => {
//     try {
//       await transactionService.deleteTransaction(id);
//       fetchTransactions(); // Refresh the list after deletion
//     } catch (error) {
//       console.error('Error deleting transaction:', error);
//     }
//   };

//   const handleEditTransaction = async (transaction: Transaction) => {
//     if (transaction.id === undefined) {
//       console.error('Transaction ID is undefined');
//       return;
//     }
//     try {
//       await transactionService.updateTransaction(transaction.id, transaction);
//       fetchTransactions(); // Refresh the list after update
//     } catch (error) {
//       console.error('Error updating transaction:', error);
//     }
//   };
  



//   // Handle adding a new transaction
//   const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
//     try {
//       await transactionService.addTransaction(transactionData); // Add new transaction
//       setIsAddingTransaction(false); // Close modal
//       fetchTransactions(); // Reload transactions
//     } catch (error) {
//       console.error('Error adding transaction:', error);
//     }
//   };

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-4">
//           <div className="flex flex-col">
//             <span className="text-lg font-semibold">Jason Lee L.W.</span>
//             <span className="text-sm text-gray-500">Sales Lead</span>
//           </div>
//         </div>
//         <div className="flex gap-4">
//           <div className="relative">
//             <button
//               onClick={() => document.getElementById('csvInput')?.click()}
//               className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
//             >
//               <Upload size={16} />
//               UPLOAD CSV
//             </button>
//             <input
//               id="csvInput"
//               type="file"
//               accept=".csv"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//           </div>
//           <button
//             onClick={() => setIsAddingTransaction(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Add Transaction
//           </button>
//         </div>
//       </div>

//       {uploadStatus && (
//         <div
//           className={`mb-4 p-4 rounded-md ${
//             uploadStatus === 'error'
//               ? 'bg-red-100 text-red-800'
//               : uploadStatus === 'success'
//               ? 'bg-green-100 text-green-800'
//               : 'bg-blue-100 text-blue-800'
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             {uploadStatus === 'uploading' && <Loader2 className="animate-spin" />}
//             {uploadStatus === 'success' && <Check />}
//             {uploadStatus === 'error' && <AlertCircle />}
//             <span>
//               {uploadStatus === 'uploading' && 'Uploading...'}
//               {uploadStatus === 'success' && 'Upload Successful!'}
//               {uploadStatus === 'error' && 'Upload Failed!'}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* <TransactionTable transactions={transactions} /> Pass transactions to TransactionTable */}
//       <TransactionTable 
//     transactions={transactions}
//     onDelete={handleDeleteTransaction}
//     onEdit={handleEditTransaction}
//   />
//       <Pagination 
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//       />

//       {isAddingTransaction && (
//         <AddTransactionModal
//           onClose={() => setIsAddingTransaction(false)}
//           onSave={handleAddTransaction} // Pass handleAddTransaction to onSave prop
//         />
//       )}
//     </div>
//   );
// }

// export default App;











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

  // Fetch transactions and sort by date
  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getPaginatedTransactions(currentPage);
      console.log('Fetched data:', data);

      // Sort transactions by date in descending order (latest first)
      const sortedTransactions = data.transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTransactions(sortedTransactions); // Set sorted transactions
      setTotalPages(data.totalPages); // Extract and set total pages
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  // Handle CSV file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    try {
      await transactionService.uploadCSV(file); // Upload CSV
      setUploadStatus('success');
      fetchTransactions(); // Reload transactions after successful upload
    } catch (error) {
      setUploadStatus('error');
      console.error('Error uploading file:', error);
    }
  };

  // Handle delete and edit
  const handleDeleteTransaction = async (id: number) => {
    try {
      await transactionService.deleteTransaction(id);
      fetchTransactions(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    if (transaction.id === undefined) {
      console.error('Transaction ID is undefined');
      return;
    }
    try {
      await transactionService.updateTransaction(transaction.id, transaction);
      fetchTransactions(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  // Handle adding a new transaction
  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      await transactionService.addTransaction(transactionData); // Add new transaction
      setIsAddingTransaction(false); // Close modal
      fetchTransactions(); // Reload transactions
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{user.displayName}</span>
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <button
              onClick={() => document.getElementById('csvInput')?.click()}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              <Upload size={16} />
              UPLOAD CSV
            </button>
            <input
              id="csvInput"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <button
            onClick={() => setIsAddingTransaction(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Transaction
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div
          className={`mb-4 p-4 rounded-md ${
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

      <TransactionTable 
        transactions={transactions}
        onDelete={handleDeleteTransaction}
        onEdit={handleEditTransaction}
      />
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isAddingTransaction && (
        <AddTransactionModal
          onClose={() => setIsAddingTransaction(false)}
          onSave={handleAddTransaction} // Pass handleAddTransaction to onSave prop
        />
      )}
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
