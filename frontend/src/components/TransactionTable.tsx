// TransactionTable.tsx

import React from 'react';
import { Transaction } from '../types';
import { formatters } from '../utils/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  // Check if transactions is an array before using map
  if (!Array.isArray(transactions)) {
    return <div>No transactions available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transaction Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Original Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount in INR
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {formatters.formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4">{transaction.description}</td>
              <td className="px-6 py-4">
                {formatters.formatCurrency(transaction.amount, transaction.currency)}
              </td>
              <td className="px-6 py-4">
                {formatters.formatCurrency(transaction.amount, 'INR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};




// // // // del+edit

// // // import React from 'react';
// // // import { Transaction } from '../types';
// // // import { formatters } from '../utils/formatters';

// // // interface TransactionTableProps {
// // //   transactions: Transaction[];
// // //   onEdit: (transaction: Transaction) => void;
// // // }

// // // export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit }) => {
// // //   if (!Array.isArray(transactions) || transactions.length === 0) {
// // //     return <div>No transactions available.</div>;
// // //   }

// // //   return (
// // //     <div className="overflow-x-auto">
// // //       <table className="min-w-full bg-white">
// // //         <thead className="bg-gray-50">
// // //           <tr>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //               Date
// // //             </th>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //               Transaction Description
// // //             </th>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //               Original Amount
// // //             </th>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //               Amount in INR
// // //             </th>
// // //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //               Actions
// // //             </th>
// // //           </tr>
// // //         </thead>
// // //         <tbody className="divide-y divide-gray-200">
// // //           {transactions.map((transaction) => (
// // //             <tr key={transaction.id} className="hover:bg-gray-50">
// // //               <td className="px-6 py-4 whitespace-nowrap">
// // //                 {formatters.formatDate(transaction.date)}
// // //               </td>
// // //               <td className="px-6 py-4">{transaction.description}</td>
// // //               <td className="px-6 py-4">
// // //                 {formatters.formatCurrency(transaction.amount, transaction.currency)}
// // //               </td>
// // //               <td className="px-6 py-4">
// // //                 {formatters.formatCurrency(transaction.amount, 'INR')}
// // //               </td>
// // //               <td className="px-6 py-4">
// // //                 <button
// // //                   onClick={() => onEdit(transaction)}
// // //                   className="text-blue-600 hover:underline"
// // //                 >
// // //                   Edit
// // //                 </button>
// // //               </td>
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // };



// // // TransactionTable.tsx
// // import React from 'react';
// // import { Transaction } from '../types';
// // import { formatters } from '../utils/formatters';

// // interface TransactionTableProps {
// //   transactions: Transaction[];
// //   onEdit: (transaction: Transaction) => void;
// // }

// // export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit }) => {
// //   if (!Array.isArray(transactions) || transactions.length === 0) {
// //     return <div>No transactions available.</div>;
// //   }

// //   return (
// //     <div className="overflow-x-auto">
// //       <table className="min-w-full bg-white">
// //         <thead className="bg-gray-50">
// //           <tr>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //               Date
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //               Transaction Description
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //               Original Amount
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //               Amount in INR
// //             </th>
// //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //               Actions
// //             </th>
// //           </tr>
// //         </thead>
// //         <tbody className="divide-y divide-gray-200">
// //           {transactions.map((transaction) => (
// //             <tr key={transaction.id} className="hover:bg-gray-50">
// //               <td className="px-6 py-4 whitespace-nowrap">
// //                 {formatters.formatDate(transaction.date)}
// //               </td>
// //               <td className="px-6 py-4">{transaction.description}</td>
// //               <td className="px-6 py-4">
// //                 {formatters.formatCurrency(transaction.amount, transaction.currency)}
// //               </td>
// //               <td className="px-6 py-4">
// //                 {formatters.formatCurrency(transaction.amount, 'INR')}
// //               </td>
// //               <td className="px-6 py-4">
// //                 <button
// //                   onClick={() => onEdit(transaction)}
// //                   className="text-blue-600 hover:underline"
// //                 >
// //                   Edit
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };




// //del too

// import React from 'react';
// import { Transaction } from '../types';
// import { formatters } from '../utils/formatters';

// interface TransactionTableProps {
//   transactions: Transaction[];
//   onEdit: (transaction: Transaction) => void;
//   onDelete: (id: number) => void; // New prop for delete
// }

// export const TransactionTable: React.FC<TransactionTableProps> = ({
//   transactions,
//   onEdit,
//   onDelete,
// }) => {
//   // Check if transactions array is valid and has data
//   if (!Array.isArray(transactions) || transactions.length === 0) {
//     return <div>No transactions available.</div>;
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Date
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Transaction Description
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Original Amount
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Amount in INR
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {transactions.map((transaction) => (
//             <tr key={transaction.id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {formatters.formatDate(transaction.date)}
//               </td>
//               <td className="px-6 py-4">{transaction.description}</td>
//               <td className="px-6 py-4">
//                 {formatters.formatCurrency(transaction.amount, transaction.currency)}
//               </td>
//               <td className="px-6 py-4">
//                 {formatters.formatCurrency(transaction.amount, 'INR')}
//               </td>
//               <td className="px-6 py-4 flex gap-2">
//                 {/* Edit Button */}
//                 <button
//                   onClick={() => onEdit(transaction)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Edit
//                 </button>

//                 {/* Delete Button */}
//                 <button
//                   onClick={() => {
//                     if (transaction.id !== undefined) {
//                       onDelete(transaction.id);
//                     } else {
//                       console.error('Transaction ID is undefined');
//                     }
//                   }}
//                   className="text-red-600 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
