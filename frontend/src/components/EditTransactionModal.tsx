


// import React, { useState } from 'react';
// import { Transaction } from '../types';

// interface Props {
//   transaction: Transaction;
//   onClose: () => void;
//   onSave: (updatedTransaction: Transaction) => void;
// }

// export const EditTransactionModal: React.FC<Props> = ({
//   transaction,
//   onClose,
//   onSave,
// }) => {
//   const [formData, setFormData] = useState({
//     ...transaction,
//     date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0], // Format date
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
//     setFormData({ ...formData, [e.target.name]: value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Date</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <input
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Amount</label>
//             <input
//               name="amount"
//               type="number"
//               step="0.01"
//               value={formData.amount}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Currency</label>
//             <select
//               name="currency"
//               value={formData.currency || 'USD'}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//             >
//               <option value="USD">USD</option>
//               <option value="INR">INR</option>
//             </select>
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border rounded-md hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };



// EditTransactionModal Component
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
  const [formData, setFormData] = useState({
    ...transaction,
    date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0], // Format date
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, date: new Date(formData.date).toISOString() }); // Ensure ISO format
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              name="currency"
              value={formData.currency || 'USD'}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};