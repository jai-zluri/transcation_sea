


// // import React from 'react';
// // import { Transaction } from '../types';
// // import { RotateCw, XCircle } from 'lucide-react';
// // import { currencyUtils } from '../utils/currency'; // Make sure to import your currency utility

// // interface RestoreTableProps {
// //   restoreTransactions: Transaction[];
// //   onUndo: (id: number) => Promise<void>;
// //   onRestoreAll: () => void;
// //   onDeletePermanently: (id: number) => Promise<void>;
// //   onClose: () => void;
// //   currentPage: number;
// //   totalPages: number;
// //   pageSize: number;
// //   onPageChange: (page: number) => void;
// //   onPageSizeChange: (size: number) => void;
// // }

// // const RestoreTable: React.FC<RestoreTableProps> = ({
// //   restoreTransactions,
// //   onUndo,
// //   onRestoreAll,
// //   onDeletePermanently,
// //   onClose,
// //   currentPage,
// //   totalPages,
// //   pageSize,
// //   onPageChange,
// //   onPageSizeChange,
// // }) => {
// //   const handleDeletePermanently = (id: number) => {
// //     if (
// //       window.confirm(
// //         `Are you sure you want to delete the transaction permanently?`
// //       )
// //     ) {
// //       onDeletePermanently(id);
// //     }
// //   };

// //   return (
// //     <div className="mt-8">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-xl font-semibold">Restore Table</h2>
// //         {restoreTransactions.length > 0 && (
// //           <div className="flex justify-end mt-4">
// //             <button
// //               onClick={onRestoreAll}
// //               className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
// //             >
// //               Restore All
// //             </button>
// //           </div>
// //         )}
// //         <button
// //           onClick={onClose}
// //           className="text-red-600 hover:text-red-800 flex items-center gap-1"
// //         >
// //           <XCircle size={20} /> Close
// //         </button>
// //       </div>
// //       <div className="overflow-x-auto mt-4">
// //         <table className="min-w-full bg-white">
// //           <thead className="bg-gray-700">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-white">Date</th>
// //               <th className="px-6 py-3 text-left text-white">Description</th>
// //               <th className="px-6 py-3 text-right text-white">Original Amount</th>
// //               <th className="px-6 py-3 text-right text-white">Amount in INR</th>
// //               <th className="px-6 py-3 text-right text-white">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-gray-200">
// //             {restoreTransactions.map((transaction) => (
// //               <tr key={transaction.id}>
// //                 <td className="px-6 py-4">
// //                   {new Date(transaction.date).toLocaleDateString()}
// //                 </td>
// //                 <td className="px-6 py-4 max-w-xs truncate">
// //                   {transaction.description}
// //                 </td>
// //                 <td className="px-6 py-4 text-right">
// //                   {`${currencyUtils.getSymbol(transaction.currency)}${transaction.amount}`}
// //                 </td>
// //                 <td className="px-6 py-4 text-right">
// //                   {`${currencyUtils.getSymbol('INR')}${currencyUtils.convertToINR(transaction.amount, transaction.currency)}`}
// //                 </td>
// //                 <td className="px-6 py-4 text-right">
// //                   <div className="flex justify-end gap-2">
// //                     <button
// //                       onClick={() => onUndo(transaction.id!)}
// //                       className="text-green-600 hover:text-green-800 flex items-center gap-1"
// //                     >
// //                       <RotateCw size={16} /> Undo
// //                     </button>
// //                     <button
// //                       onClick={() => handleDeletePermanently(transaction.id!)}
// //                       className="text-red-600 hover:text-red-800 flex items-center gap-1"
// //                     >
// //                       <XCircle size={16} /> Delete Permanently
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       <div className="flex justify-between items-center mt-4">
// //         <div className="flex items-center gap-4">
// //           <select
// //             value={pageSize}
// //             onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
// //             className="px-4 py-2 border rounded-md"
// //           >
// //             {[5, 10, 15, 20, 25].map((size) => (
// //               <option key={size} value={size}>
// //                 {size}
// //               </option>
// //             ))}
// //           </select>
// //           <span className="text-sm text-gray-600">
// //             Page {currentPage} of {totalPages}
// //           </span>
// //         </div>

// //         <div className="flex gap-2">
// //           <button
// //             onClick={() => onPageChange(currentPage - 1)}
// //             disabled={currentPage === 1}
// //             className="px-4 py-2 bg-gray-300 rounded-md disabled:bg-gray-400"
// //           >
// //             Previous
// //           </button>
// //           <button
// //             onClick={() => onPageChange(currentPage + 1)}
// //             disabled={currentPage === totalPages}
// //             className="px-4 py-2 bg-gray-300 rounded-md disabled:bg-gray-400"
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RestoreTable;



// import React from 'react';
// import { Transaction } from '../types';
// import { RotateCw, XCircle } from 'lucide-react';
// import { currencyUtils } from '../utils/currency'; // Make sure to import your currency utility

// interface RestoreTableProps {
//   restoreTransactions: Transaction[];
//   onUndo: (id: number) => Promise<void>;
//   onRestoreAll: () => void;
//   onDeletePermanently: (id: number) => Promise<void>;
//   onClose: () => void;
//   currentPage: number;
//   totalPages: number;
//   pageSize: number;
//   onPageChange: (page: number) => void;
//   onPageSizeChange: (size: number) => void;
// }

// const RestoreTable: React.FC<RestoreTableProps> = ({
//   restoreTransactions,
//   onUndo,
//   onRestoreAll,
//   onDeletePermanently,
//   onClose,
//   currentPage,
//   totalPages,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
// }) => {
//   const handleDeletePermanently = async (id: number) => {
//     if (
//       window.confirm(
//         `Are you sure you want to delete the transaction permanently?`
//       )
//     ) {
//       try {
//         await onDeletePermanently(id);
//         alert('Transaction deleted successfully');
//       } catch (error) {
//         console.error('Error deleting transaction:', error);
//         alert('Failed to delete transaction');
//       }
//     }
//   };

//   return (
//     <div className="mt-8">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Restore Table</h2>
//         {restoreTransactions.length > 0 && (
//           <div className="flex justify-end mt-4">
//             <button
//               onClick={onRestoreAll}
//               className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
//             >
//               Restore All
//             </button>
//           </div>
//         )}
//         <button
//           onClick={onClose}
//           className="text-red-600 hover:text-red-800 flex items-center gap-1"
//         >
//           <XCircle size={20} /> Close
//         </button>
//       </div>
//       <div className="overflow-x-auto mt-4">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="px-6 py-3 text-left text-white">Date</th>
//               <th className="px-6 py-3 text-left text-white">Description</th>
//               <th className="px-6 py-3 text-right text-white">Original Amount</th>
//               <th className="px-6 py-3 text-right text-white">Amount in INR</th>
//               <th className="px-6 py-3 text-right text-white">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {restoreTransactions.map((transaction) => (
//               <tr key={transaction.id}>
//                 <td className="px-6 py-4">
//                   {new Date(transaction.date).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 max-w-xs truncate">
//                   {transaction.description}
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   {`${currencyUtils.getSymbol(transaction.currency)}${transaction.amount}`}
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   {`${currencyUtils.getSymbol('INR')}${currencyUtils.convertToINR(transaction.amount, transaction.currency)}`}
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => onUndo(transaction.id!)}
//                       className="text-green-600 hover:text-green-800 flex items-center gap-1"
//                     >
//                       <RotateCw size={16} /> Undo
//                     </button>
//                     <button
//                       onClick={() => handleDeletePermanently(transaction.id!)}
//                       className="text-red-600 hover:text-red-800 flex items-center gap-1"
//                     >
//                       <XCircle size={16} /> Delete Permanently
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center mt-4">
//         <div className="flex items-center gap-4">
//           <select
//             value={pageSize}
//             onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
//             className="px-4 py-2 border rounded-md"
//           >
//             {[5, 10, 15, 20, 25].map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//           <span className="text-sm text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-300 rounded-md disabled:bg-gray-400"
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-300 rounded-md disabled:bg-gray-400"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RestoreTable;




import React from 'react';
import { Transaction } from '../types';
import { RotateCw, XCircle } from 'lucide-react';
import { currencyUtils } from '../utils/currency'; // Make sure to import your currency utility

interface RestoreTableProps {
  restoreTransactions: Transaction[];
  onUndo: (id: number) => Promise<void>;
  onRestoreAll: () => void;
  onDeletePermanently: (id: number) => Promise<void>;
  onClose: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const RestoreTable: React.FC<RestoreTableProps> = ({
  restoreTransactions,
  onUndo,
  onRestoreAll,
  onDeletePermanently,
  onClose,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const handleDeletePermanently = async (id: number) => {
    if (
      window.confirm(
        `Are you sure you want to delete the transaction permanently?`
      )
    ) {
      try {
        await onDeletePermanently(id);
        alert('Transaction deleted successfully');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
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
              onClick={onRestoreAll}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Restore All
            </button>
          </div>
        )}
        <button
          onClick={onClose}
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
                  {`${currencyUtils.getSymbol(transaction.currency)}${transaction.amount}`}
                </td>
                <td className="px-6 py-4 text-right">
                  {`${currencyUtils.getSymbol('INR')}${currencyUtils.convertToINR(transaction.amount, transaction.currency)}`}
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

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-4">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
            className="px-4 py-2 border rounded-md"
          >
            {[5, 10, 15, 20, 25].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreTable;