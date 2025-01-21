
import axios, { AxiosInstance } from 'axios';
import { Transaction, PaginatedResponse, ApiResponse } from '../types';

const API_URL = 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionService = {
  // Get paginated transactions
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

  // Add new transaction
  addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>(
        '/transactions/transactions',
        transactionData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  // Update transaction
  updateTransaction: async (
    id: number,
    transactionData: Partial<Transaction>
  ): Promise<ApiResponse> => {
    try {
      const response = await api.put<ApiResponse>(
        `/transactions/transactions/${id}`,
        transactionData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete transaction
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

  // Upload CSV
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
};