

// // //pagination ke liye , api ts me changes krne h ig both place



// // // // ///chal rha haii


// import React, { useState, useEffect } from 'react';
// import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
// import { TransactionTable } from './components/TransactionTable';
// import { AddTransactionModal } from './components/AddTransactionModal';
// import { transactionService } from './services/api';
// import { Transaction, UploadStatus } from './types';
// import './index.css';

// function App() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
//   const [isAddingTransaction, setIsAddingTransaction] = useState(false);

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     try {
//       const response = await transactionService.getTransactions(); // Fetch data
//       console.log('Fetched response:', response);

//       // Now directly use response as transactions array
//       setTransactions(response); // Update the transactions state

//       if (response.length === 0) {
//         console.log('No transactions available');
//       }
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       setTransactions([]); // Set empty array in case of error
//     }
//   };

//   useEffect(() => {
//     fetchTransactions(); // Call the function to fetch transactions
//   }, []);

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

//   // Handle adding a new transaction
//   const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
//     try {
//       await transactionService.addTransaction(transactionData); // Add the new transaction
//       setIsAddingTransaction(false); // Close the modal
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

//       <TransactionTable transactions={transactions} /> {/* Pass transactions to TransactionTable */}

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


// // // //with pagination


// // // import React, { useState, useEffect } from 'react';
// // // import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
// // // import { TransactionTable } from './components/TransactionTable';
// // // import { Pagination } from './components/Pagination';
// // // import { AddTransactionModal } from './components/AddTransactionModal';
// // // import { transactionService } from './services/api';
// // // import { Transaction, UploadStatus } from './types';
// // // import './index.css';

// // // function App() {
// // //   const [transactions, setTransactions] = useState<Transaction[]>([]);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [totalPages, setTotalPages] = useState(1);
// // //   const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
// // //   const [isAddingTransaction, setIsAddingTransaction] = useState(false);

// // //   // Fetch transactions
// // //   const fetchTransactions = async () => {
// // //     try {
// // //       const data = await transactionService.getPaginatedTransactions(currentPage);
// // //       console.log('Fetched data:', data);
      
// // //       // Directly set the transactions array
// // //       setTransactions(data);
// // //       // Assuming data contains totalPages, adjust if necessary
// // //       setTotalPages(data.length > 0 ? 1 : 0); // Example: Adjust according to actual response structure
// // //     } catch (error) {
// // //       console.error('Error fetching transactions:', error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchTransactions();
// // //   }, [currentPage]);

// // //   // Handle CSV file upload
// // //   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = event.target.files?.[0];
// // //     if (!file) return;

// // //     setUploadStatus('uploading');
// // //     try {
// // //       await transactionService.uploadCSV(file); // Upload CSV
// // //       setUploadStatus('success');
// // //       fetchTransactions(); // Reload transactions after successful upload
// // //     } catch (error) {
// // //       setUploadStatus('error');
// // //       console.error('Error uploading file:', error);
// // //     }
// // //   };

// // //   // Handle adding a new transaction
// // //   const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
// // //     try {
// // //       await transactionService.addTransaction(transactionData); // Add new transaction
// // //       setIsAddingTransaction(false); // Close modal
// // //       fetchTransactions(); // Reload transactions
// // //     } catch (error) {
// // //       console.error('Error adding transaction:', error);
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-8 max-w-7xl mx-auto">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <div className="flex items-center gap-4">
// // //           <div className="flex flex-col">
// // //             <span className="text-lg font-semibold">Jason Lee L.W.</span>
// // //             <span className="text-sm text-gray-500">Sales Lead</span>
// // //           </div>
// // //         </div>
// // //         <div className="flex gap-4">
// // //           <div className="relative">
// // //             <button
// // //               onClick={() => document.getElementById('csvInput')?.click()}
// // //               className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
// // //             >
// // //               <Upload size={16} />
// // //               UPLOAD CSV
// // //             </button>
// // //             <input
// // //               id="csvInput"
// // //               type="file"
// // //               accept=".csv"
// // //               onChange={handleFileUpload}
// // //               className="hidden"
// // //             />
// // //           </div>
// // //           <button
// // //             onClick={() => setIsAddingTransaction(true)}
// // //             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // //           >
// // //             Add Transaction
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {uploadStatus && (
// // //         <div
// // //           className={`mb-4 p-4 rounded-md ${
// // //             uploadStatus === 'error'
// // //               ? 'bg-red-100 text-red-800'
// // //               : uploadStatus === 'success'
// // //               ? 'bg-green-100 text-green-800'
// // //               : 'bg-blue-100 text-blue-800'
// // //           }`}
// // //         >
// // //           <div className="flex items-center gap-2">
// // //             {uploadStatus === 'uploading' && <Loader2 className="animate-spin" />}
// // //             {uploadStatus === 'success' && <Check />}
// // //             {uploadStatus === 'error' && <AlertCircle />}
// // //             <span>
// // //               {uploadStatus === 'uploading' && 'Uploading...'}
// // //               {uploadStatus === 'success' && 'Upload Successful!'}
// // //               {uploadStatus === 'error' && 'Upload Failed!'}
// // //             </span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       <TransactionTable transactions={transactions} /> {/* Pass transactions to TransactionTable */}
      
// // //       <Pagination 
// // //         currentPage={currentPage}
// // //         totalPages={totalPages}
// // //         onPageChange={setCurrentPage}
// // //       />

// // //       {isAddingTransaction && (
// // //         <AddTransactionModal
// // //           onClose={() => setIsAddingTransaction(false)}
// // //           onSave={handleAddTransaction} // Pass handleAddTransaction to onSave prop
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default App;





// // import React, { useState, useEffect } from 'react';
// // import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
// // import { TransactionTable } from './components/TransactionTable';
// // import { Pagination } from './components/Pagination';
// // import { AddTransactionModal } from './components/AddTransactionModal';
// // import { transactionService } from './services/api';
// // import { Transaction, UploadStatus } from './types';
// // import './index.css';

// // function App() {
// //   const [transactions, setTransactions] = useState<Transaction[]>([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
// //   const [isAddingTransaction, setIsAddingTransaction] = useState(false);

// //   // Fetch transactions
// //   const fetchTransactions = async () => {
// //     try {
// //       const data = await transactionService.getPaginatedTransactions(currentPage);
// //       console.log('Fetched data:', data);

// //       setTransactions(data.transactions); // Extract and set transactions
// //       setTotalPages(data.totalPages); // Extract and set total pages
// //     } catch (error) {
// //       console.error('Error fetching transactions:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchTransactions();
// //   }, [currentPage]);

// //   // Handle CSV file upload
// //   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = event.target.files?.[0];
// //     if (!file) return;

// //     setUploadStatus('uploading');
// //     try {
// //       await transactionService.uploadCSV(file); // Upload CSV
// //       setUploadStatus('success');
// //       fetchTransactions(); // Reload transactions after successful upload
// //     } catch (error) {
// //       setUploadStatus('error');
// //       console.error('Error uploading file:', error);
// //     }
// //   };

// //   // Handle adding a new transaction
// //   const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
// //     try {
// //       await transactionService.addTransaction(transactionData); // Add new transaction
// //       setIsAddingTransaction(false); // Close modal
// //       fetchTransactions(); // Reload transactions
// //     } catch (error) {
// //       console.error('Error adding transaction:', error);
// //     }
// //   };

// //   return (
// //     <div className="p-8 max-w-7xl mx-auto">
// //       <div className="flex justify-between items-center mb-6">
// //         <div className="flex items-center gap-4">
// //           <div className="flex flex-col">
// //             <span className="text-lg font-semibold">Jason Lee L.W.</span>
// //             <span className="text-sm text-gray-500">Sales Lead</span>
// //           </div>
// //         </div>
// //         <div className="flex gap-4">
// //           <div className="relative">
// //             <button
// //               onClick={() => document.getElementById('csvInput')?.click()}
// //               className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
// //             >
// //               <Upload size={16} />
// //               UPLOAD CSV
// //             </button>
// //             <input
// //               id="csvInput"
// //               type="file"
// //               accept=".csv"
// //               onChange={handleFileUpload}
// //               className="hidden"
// //             />
// //           </div>
// //           <button
// //             onClick={() => setIsAddingTransaction(true)}
// //             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// //           >
// //             Add Transaction
// //           </button>
// //         </div>
// //       </div>

// //       {uploadStatus && (
// //         <div
// //           className={`mb-4 p-4 rounded-md ${
// //             uploadStatus === 'error'
// //               ? 'bg-red-100 text-red-800'
// //               : uploadStatus === 'success'
// //               ? 'bg-green-100 text-green-800'
// //               : 'bg-blue-100 text-blue-800'
// //           }`}
// //         >
// //           <div className="flex items-center gap-2">
// //             {uploadStatus === 'uploading' && <Loader2 className="animate-spin" />}
// //             {uploadStatus === 'success' && <Check />}
// //             {uploadStatus === 'error' && <AlertCircle />}
// //             <span>
// //               {uploadStatus === 'uploading' && 'Uploading...'}
// //               {uploadStatus === 'success' && 'Upload Successful!'}
// //               {uploadStatus === 'error' && 'Upload Failed!'}
// //             </span>
// //           </div>
// //         </div>
// //       )}

// //       <TransactionTable transactions={transactions} /> {/* Pass transactions to TransactionTable */}
      
// //       <Pagination 
// //         currentPage={currentPage}
// //         totalPages={totalPages}
// //         onPageChange={setCurrentPage}
// //       />

// //       {isAddingTransaction && (
// //         <AddTransactionModal
// //           onClose={() => setIsAddingTransaction(false)}
// //           onSave={handleAddTransaction} // Pass handleAddTransaction to onSave prop
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // export default App;



// // // edit aur del add krra

// // // // App.tsx
// // // import React, { useState, useEffect } from 'react';
// // // import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
// // // import { TransactionTable } from './components/TransactionTable';
// // // import { Pagination } from './components/Pagination';
// // // import { AddTransactionModal } from './components/AddTransactionModal';
// // // import { EditTransactionModal } from './components/EditTransactionModal';
// // // import { transactionService } from './services/api';
// // // import { Transaction, UploadStatus } from './types';
// // // import './index.css';

// // // function App() {
// // //   const [transactions, setTransactions] = useState<Transaction[]>([]);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [totalPages, setTotalPages] = useState(1);
// // //   const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
// // //   const [isAddingTransaction, setIsAddingTransaction] = useState(false);
// // //   const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

// // //   const fetchTransactions = async () => {
// // //     try {
// // //       const data = await transactionService.getPaginatedTransactions(currentPage);
// // //       setTransactions(data.transactions);
// // //       setTotalPages(data.totalPages);
// // //     } catch (error) {
// // //       console.error('Error fetching transactions:', error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchTransactions();
// // //   }, [currentPage]);

// // //   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = event.target.files?.[0];
// // //     if (!file) return;

// // //     setUploadStatus('uploading');
// // //     try {
// // //       await transactionService.uploadCSV(file);
// // //       setUploadStatus('success');
// // //       fetchTransactions();
// // //     } catch (error) {
// // //       setUploadStatus('error');
// // //       console.error('Error uploading file:', error);
// // //     }
// // //   };

// // //   const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
// // //     try {
// // //       await transactionService.addTransaction(transactionData);
// // //       setIsAddingTransaction(false);
// // //       fetchTransactions();
// // //     } catch (error) {
// // //       console.error('Error adding transaction:', error);
// // //     }
// // //   };

// // //   const handleEditTransaction = async (id: number, updatedData: Partial<Transaction>) => {
// // //     try {
// // //       await transactionService.updateTransaction(id, updatedData);
// // //       setEditingTransaction(null);
// // //       fetchTransactions();
// // //     } catch (error) {
// // //       console.error('Error editing transaction:', error);
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-8 max-w-7xl mx-auto">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <div className="flex items-center gap-4">
// // //           <div className="flex flex-col">
// // //             <span className="text-lg font-semibold">Transaction Manager</span>
// // //             <span className="text-sm text-gray-500">Manage your transactions effortlessly</span>
// // //           </div>
// // //         </div>
// // //         <div className="flex gap-4">
// // //           <div className="relative">
// // //             <button
// // //               onClick={() => document.getElementById('csvInput')?.click()}
// // //               className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
// // //             >
// // //               <Upload size={16} />
// // //               UPLOAD CSV
// // //             </button>
// // //             <input
// // //               id="csvInput"
// // //               type="file"
// // //               accept=".csv"
// // //               onChange={handleFileUpload}
// // //               className="hidden"
// // //             />
// // //           </div>
// // //           <button
// // //             onClick={() => setIsAddingTransaction(true)}
// // //             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // //           >
// // //             Add Transaction
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {uploadStatus && (
// // //         <div
// // //           className={`mb-4 p-4 rounded-md ${
// // //             uploadStatus === 'error'
// // //               ? 'bg-red-100 text-red-800'
// // //               : uploadStatus === 'success'
// // //               ? 'bg-green-100 text-green-800'
// // //               : 'bg-blue-100 text-blue-800'
// // //           }`}
// // //         >
// // //           <div className="flex items-center gap-2">
// // //             {uploadStatus === 'uploading' && <Loader2 className="animate-spin" />}
// // //             {uploadStatus === 'success' && <Check />}
// // //             {uploadStatus === 'error' && <AlertCircle />}
// // //             <span>
// // //               {uploadStatus === 'uploading' && 'Uploading...'}
// // //               {uploadStatus === 'success' && 'Upload Successful!'}
// // //               {uploadStatus === 'error' && 'Upload Failed!'}
// // //             </span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       <TransactionTable
// // //         transactions={transactions}
// // //         onEdit={(transaction) => setEditingTransaction(transaction)}
// // //       />

// // //       <Pagination
// // //         currentPage={currentPage}
// // //         totalPages={totalPages}
// // //         onPageChange={setCurrentPage}
// // //       />

// // //       {isAddingTransaction && (
// // //         <AddTransactionModal
// // //           onClose={() => setIsAddingTransaction(false)}
// // //           onSave={handleAddTransaction}
// // //         />
// // //       )}

// // //       {editingTransaction && (
// // //         <EditTransactionModal
// // //           transaction={editingTransaction}
// // //           onClose={() => setEditingTransaction(null)}
// // //           onSave={(updatedData) => handleEditTransaction(editingTransaction.id!, updatedData)}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default App;


// // // //del as well

// // // import React, { useState, useEffect } from 'react';
// // // import { transactionService } from './services/api'; // Assuming you have delete API here
// // // import { Transaction } from './types';
// // // import { TransactionTable } from './components/TransactionTable';
// // // import { EditTransactionModal } from './components/EditTransactionModal';

// // // function App() {
// // //   const [transactions, setTransactions] = useState<Transaction[]>([]);
// // //   const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

// // //   const fetchTransactions = async () => {
// // //     try {
// // //       const data = await transactionService.getPaginatedTransactions();
// // //       setTransactions(data.transactions);
// // //     } catch (error) {
// // //       console.error('Error fetching transactions:', error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchTransactions();
// // //   }, []);

// // //   const handleEditTransaction = async (id: number, updatedData: Partial<Transaction>) => {
// // //     try {
// // //       await transactionService.updateTransaction(id, updatedData);
// // //       setEditingTransaction(null);
// // //       fetchTransactions();
// // //     } catch (error) {
// // //       console.error('Error editing transaction:', error);
// // //     }
// // //   };

// // //   const handleDeleteTransaction = async (id: number) => {
// // //     try {
// // //       await transactionService.deleteTransaction(id); // API call to delete
// // //       fetchTransactions(); // Refresh transaction list
// // //     } catch (error) {
// // //       console.error('Error deleting transaction:', error);
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <TransactionTable
// // //         transactions={transactions}
// // //         onEdit={(transaction) => setEditingTransaction(transaction)}
// // //         onDelete={handleDeleteTransaction} // Pass delete handler
// // //       />

// // //       {editingTransaction && (
// // //         <EditTransactionModal
// // //           transaction={editingTransaction}
// // //           onClose={() => setEditingTransaction(null)}
// // //           // onSave={(updatedData) =>
// // //           //   handleEditTransaction(editingTransaction.id, updatedData)
// // //           // }
// // //           onSave={(updatedData) => {
// // //             if (editingTransaction?.id !== undefined) {
// // //               handleEditTransaction(editingTransaction.id, updatedData);
// // //             } else {
// // //               console.error('Editing transaction ID is undefined');
// // //             }
// // //           }}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default App;



// // // import React, { useState, useEffect } from 'react';
// // // import { transactionService } from './services/api'; // Assuming you have delete API here
// // // import { Transaction } from './types';
// // // import { TransactionTable } from './components/TransactionTable';
// // // import { EditTransactionModal } from './components/EditTransactionModal';

// // // function App() {
// // //   const [transactions, setTransactions] = useState<Transaction[]>([]);
// // //   const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

// // //   // Fetch transactions from API
// // //   const fetchTransactions = async () => {
// // //     try {
// // //       const data = await transactionService.getPaginatedTransactions();
// // //       setTransactions(data.transactions);
// // //     } catch (error) {
// // //       console.error('Error fetching transactions:', error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchTransactions();
// // //   }, []);

// // //   // Handle editing a transaction
// // //   const handleEditTransaction = async (id: number, updatedData: Partial<Transaction>) => {
// // //     try {
// // //       await transactionService.updateTransaction(id, updatedData);
// // //       setEditingTransaction(null); // Close the modal after editing
// // //       fetchTransactions(); // Refresh the transactions list
// // //     } catch (error) {
// // //       console.error('Error editing transaction:', error);
// // //     }
// // //   };

// // //   // Handle deleting a transaction
// // //   const handleDeleteTransaction = async (id: number) => {
// // //     try {
// // //       await transactionService.deleteTransaction(id); // API call to delete
// // //       fetchTransactions(); // Refresh transaction list
// // //     } catch (error) {
// // //       console.error('Error deleting transaction:', error);
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       {/* Display Transaction Table */}
// // //       <TransactionTable
// // //         transactions={transactions}
// // //         onEdit={(transaction) => setEditingTransaction(transaction)}
// // //         onDelete={handleDeleteTransaction} // Pass delete handler
// // //       />

// // //       {/* Edit Transaction Modal */}
// // //       {editingTransaction && (
// // //         <EditTransactionModal
// // //           transaction={editingTransaction}
// // //           onClose={() => setEditingTransaction(null)}
// // //           onSave={(updatedData) => {
// // //             if (editingTransaction?.id !== undefined) {
// // //               handleEditTransaction(editingTransaction.id, updatedData);
// // //             } else {
// // //               console.error('Editing transaction ID is undefined');
// // //             }
// // //           }}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default App;


import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
import { TransactionTable } from './components/TransactionTable';
import { Pagination } from './components/Pagination';
import { AddTransactionModal } from './components/AddTransactionModal';
import { transactionService } from './services/api';
import { Transaction, UploadStatus } from './types';
import './index.css';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getPaginatedTransactions(currentPage);
      console.log('Fetched data:', data);

      setTransactions(data.transactions); // Extract and set transactions
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Jason Lee L.W.</span>
            <span className="text-sm text-gray-500">Sales Lead</span>
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

      <TransactionTable transactions={transactions} /> {/* Pass transactions to TransactionTable */}
      
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

export default App;
