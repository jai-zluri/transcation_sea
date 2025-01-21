// // TransactionTable.tsx

// import React from 'react';
// import { Transaction } from '../types';
// import { formatters } from '../utils/formatters';

// interface TransactionTableProps {
//   transactions: Transaction[];
// }

// export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
//   // Check if transactions is an array before using map
//   if (!Array.isArray(transactions)) {
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
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };






//tuesday
// TransactionTable.tsx

import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatters } from '../utils/formatters';
import { EditTransactionModal } from './EditTransactionModal';
import { Pencil, Trash2 } from 'lucide-react'; // Import icons

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onDelete,
  onEdit 
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  if (!Array.isArray(transactions)) {
    return <div>No transactions available.</div>;
  }

  return (
    <>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    {/* <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button> */}
                    <button
  onClick={() => transaction.id !== undefined && onDelete(transaction.id)}
  className="text-red-600 hover:text-red-800"
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
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={(updatedTransaction) => {
            onEdit(updatedTransaction);
            setEditingTransaction(null);
          }}
        />
      )}
    </>
  );
};