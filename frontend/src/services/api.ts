
// import axios, { AxiosInstance } from 'axios';
// import { Transaction, PaginatedResponse, ApiResponse } from '../types';

// const API_URL = 'http://localhost:5000';

// const api: AxiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const transactionService = {
//   // Get paginated transactions
//   getPaginatedTransactions: async (
//     page = 1,
//     limit = 25
//   ): Promise<PaginatedResponse<Transaction>> => {
//     try {
//       const response = await api.get<PaginatedResponse<Transaction>>(
//         `/transactions/transactions/paginated`,
//         {
//           params: { page, limit },
//         }
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('Error fetching paginated transactions:', error);
//       throw error;
//     }
//   },

//   // Add new transaction
//   addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse> => {
//     try {
//       const response = await api.post<ApiResponse>(
//         '/transactions/transactions',
//         transactionData
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('Error adding transaction:', error);
//       throw error;
//     }
//   },

//   // Update transaction
//   updateTransaction: async (
//     id: number,
//     transactionData: Partial<Transaction>
//   ): Promise<ApiResponse> => {
//     try {
//       const response = await api.put<ApiResponse>(
//         `/transactions/transactions/${id}`,
//         transactionData
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('Error updating transaction:', error);
//       throw error;
//     }
//   },

//   // Delete transaction
//   deleteTransaction: async (id: number): Promise<ApiResponse> => {
//     try {
//       const response = await api.delete<ApiResponse>(
//         `/transactions/transactions/${id}`
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('Error deleting transaction:', error);
//       throw error;
//     }
//   },

//   async bulkDeleteTransactions(ids: number[]): Promise<void> {
//     try {
//       // Adjust the API endpoint according to your backend
//       const response = await fetch('/api/transactions/bulk-delete', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ids }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to delete transactions');
//       }
//     } catch (error) {
//       console.error('Error in bulk delete:', error);
//       throw error;
//     }
//   },


//   // Upload CSV
//   uploadCSV: async (file: File): Promise<ApiResponse> => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       const response = await api.post<ApiResponse>('/transactions/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('Error uploading CSV:', error);
//       throw error;
//     }
//   },
// };



// // services/api.ts
// import axios, { AxiosInstance } from 'axios';
// import { formatters } from '../utils/formatters'; 
// import { currencyUtils } from '../utils/currency'; 
// import { Transaction, PaginatedResponse, ApiResponse } from '../types';

// const API_URL = 'http://localhost:5000';

// const api: AxiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const transactionService = {
//   getPaginatedTransactions: async (
//     page = 1,
//     limit = 25
//   ): Promise<PaginatedResponse<Transaction>> => {
//     try {
//       const response = await api.get<PaginatedResponse<Transaction>>(
//         `/transactions/transactions/paginated`,
//         {
//           params: { page, limit },
//         }
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('Error fetching paginated transactions:', error);
//       throw error;
//     }
//   },

//   addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse> => {
//     try {
//       const response = await api.post<ApiResponse>(
//         '/transactions/transactions',
//         {
//           ...transactionData,
//           amountInINR: currencyUtils.convertToINR(
//             transactionData.amount,
//             transactionData.currency
//           )
//         }
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('Error adding transaction:', error);
//       throw error;
//     }
//   },

//   updateTransaction: async (
//     id: number,
//     transactionData: Partial<Transaction>
//   ): Promise<ApiResponse> => {
//     try {
//       const response = await api.put<ApiResponse>(
//         `/transactions/transactions/${id}`,
//         {
//           ...transactionData,
//           amountInINR: currencyUtils.convertToINR(
//             transactionData.amount!,
//             transactionData.currency!
//           )
//         }
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('Error updating transaction:', error);
//       throw error;
//     }
//   },

//   deleteTransaction: async (id: number): Promise<ApiResponse> => {
//     try {
//       const response = await api.delete<ApiResponse>(
//         `/transactions/transactions/${id}`
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error('Error deleting transaction:', error);
//       throw error;
//     }
//   },

//   uploadCSV: async (file: File): Promise<ApiResponse> => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
      
//       const response = await api.post<ApiResponse>('/transactions/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
      
//       return response.data;
//     } catch (error: any) {
//       console.error('Error uploading CSV:', error);
//       throw error;
//     }
//   },

//   downloadDuplicates: async (duplicates: Transaction[]): Promise<void> => {
//     const csv = [
//       ['Date', 'Description', 'Amount', 'Currency', 'Amount in INR'].join(','),
//       ...duplicates.map(t => [
//         formatters.formatDate(t.date),
//         `"${t.description}"`,
//         t.amount,
//         t.currency,
//         currencyUtils.convertToINR(t.amount, t.currency)
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'duplicate-transactions.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// };





// services/api.ts

import axios, { AxiosInstance } from 'axios';
import { formatters } from '../utils/formatters';
import { currencyUtils } from '../utils/currency';
import { Transaction, PaginatedResponse, ApiResponse } from '../types';

//const API_URL = 'http://localhost:5000';
//const API_URL = 'https://transcation-valley.onrender.com'; // Update to Render URL

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Fallback to localhost for local development



const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionService = {
  getPaginatedTransactions: async (
    page = 1,
    limit = 25
  ): Promise<PaginatedResponse<Transaction>> => {
    try {
      const response = await api.get<PaginatedResponse<Transaction>>(
        `/transactions/transactions/paginated`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching paginated transactions:', error);
      throw error;
    }
  },

  getAllTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get<Transaction[]>(`/transactions/transactions`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all transactions:', error);
      throw error;
    }
  },

  addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>(
        '/transactions/transactions',
        {
          ...transactionData,
          amountInINR: currencyUtils.convertToINR(
            transactionData.amount,
            transactionData.currency
          )
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  updateTransaction: async (
    id: number,
    transactionData: Partial<Transaction>
  ): Promise<ApiResponse> => {
    try {
      const response = await api.put<ApiResponse>(
        `/transactions/transactions/${id}`,
        {
          ...transactionData,
          amountInINR: currencyUtils.convertToINR(
            transactionData.amount!,
            transactionData.currency!
          )
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  deleteTransaction: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete<ApiResponse>(
        `/transactions/transactions/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  uploadCSV: async (file: File): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<ApiResponse>('/transactions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error uploading CSV:', error);
      throw error;
    }
  },

  downloadDuplicates: async (duplicates: Transaction[]): Promise<void> => {
    const csv = [
      ['Date', 'Description', 'Amount', 'Currency', 'Amount in INR'].join(','),
      ...duplicates.map(t => [
        formatters.formatDate(t.date),
        `"${t.description}"`,
        t.amount,
        t.currency,
        currencyUtils.convertToINR(t.amount, t.currency)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'duplicate-transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
