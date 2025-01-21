
//with pagination
import axios, { AxiosInstance } from 'axios';
import { Transaction, PaginatedResponse, ApiResponse } from '../types';

const API_URL = 'http://localhost:5000'; // Remove trailing slash for consistency

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
        `/transactions/transactions/paginated`, // URL fixed without hardcoded values
        {
          params: { page, limit } // Dynamically send the page and limit
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching paginated transactions:', error.response?.data || error.message);
      throw error;
    }
  },

  addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/transactions', transactionData);
      return response.data;
    } catch (error: any) {
      console.error('Error adding transaction:', error.response?.data || error.message);
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
      console.error('Error uploading CSV:', error.response?.data || error.message);
      throw error;
    }
  },

  updateTransaction: async (
    id: number,
    transactionData: Partial<Transaction>
  ): Promise<ApiResponse> => {
    try {
      const response = await api.put<ApiResponse>(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating transaction:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteTransaction: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete<ApiResponse>(`/transactions/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting transaction:', error.response?.data || error.message);
      throw error;
    }
  },
};






// // //without pagination below

// // import axios, { AxiosInstance } from 'axios';
// // import { Transaction, ApiResponse } from '../types';

// // const API_URL = 'http://localhost:5000'; // Remove trailing slash for consistency

// // const api: AxiosInstance = axios.create({
// //   baseURL: API_URL,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // export const transactionService = {
// //   getTransactions: async (): Promise<Transaction[]> => {  // Removed pagination logic
// //     try {
// //       const response = await api.get<Transaction[]>('/transactions/transactions');  // Just the endpoint without pagination
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Error fetching transactions:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   },

// //   addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse> => {
// //     try {
// //       const response = await api.post<ApiResponse>('/transactions', transactionData);
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Error adding transaction:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   },

// //   uploadCSV: async (file: File): Promise<ApiResponse> => {
// //     try {
// //       const formData = new FormData();
// //       formData.append('file', file);

// //       const response = await api.post<ApiResponse>('/transactions/upload', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Error uploading CSV:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   },

// //   updateTransaction: async (
// //     id: number,
// //     transactionData: Partial<Transaction>
// //   ): Promise<ApiResponse> => {
// //     try {
// //       const response = await api.put<ApiResponse>(`/transactions/${id}`, transactionData);
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Error updating transaction:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   },

// //   deleteTransaction: async (id: number): Promise<ApiResponse> => {
// //     try {
// //       const response = await api.delete<ApiResponse>(`/transactions/${id}`);
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Error deleting transaction:', error.response?.data || error.message);
// //       throw error;
// //     }
// //   },
// // };





// // del+update+add

// import axios, { AxiosInstance } from 'axios';
// import { Transaction, PaginatedResponse, ApiResponse } from '../types';

// const API_URL = 'http://localhost:5000'; // Ensure this matches your backend URL

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
//         '/transactions/paginated', // Fixed endpoint
//         {
//           params: { page, limit },
//         }
//       );
//       return response.data;
//     } catch (error: any) {
//       console.error(
//         'Error fetching paginated transactions:',
//         error.response?.data || error.message || 'Unknown error'
//       );
//       throw error;
//     }
//   },

//   addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse> => {
//     try {
//       const response = await api.post<ApiResponse>('/transactions', transactionData);
//       return response.data;
//     } catch (error: any) {
//       console.error(
//         'Error adding transaction:',
//         error.response?.data || error.message || 'Unknown error'
//       );
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
//       console.error(
//         'Error uploading CSV:',
//         error.response?.data || error.message || 'Unknown error'
//       );
//       throw error;
//     }
//   },

//   updateTransaction: async (
//     id: number,
//     transactionData: Partial<Transaction>
//   ): Promise<ApiResponse> => {
//     try {
//       const response = await api.put<ApiResponse>(`/transactions/${id}`, transactionData); // Fixed template literal
//       return response.data;
//     } catch (error: any) {
//       console.error(
//         'Error updating transaction:',
//         error.response?.data || error.message || 'Unknown error'
//       );
//       throw error;
//     }
//   },

//   deleteTransaction: async (id: number): Promise<ApiResponse> => {
//     try {
//       const response = await api.delete<ApiResponse>(`/transactions/${id}`); // Fixed template literal
//       return response.data;
//     } catch (error: any) {
//       console.error(
//         'Error deleting transaction:',
//         error.response?.data || error.message || 'Unknown error'
//       );
//       throw error;
//     }
//   },
// };
