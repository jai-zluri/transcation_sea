
// services/api.ts

import axios, { AxiosInstance } from 'axios';
import { currencyUtils } from '../utils/currency';
import { Transaction, ApiResponse } from '../types';

const API_URL = 'https://transcation-valley.onrender.com';

//const API_URL = 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionService = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get<Transaction[]>('/transactions/transactions');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all transactions:', error);
      throw error;
    }
  },

  addTransaction: async (transactionData: Omit<Transaction, 'id'>): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>(
        '/transactions',
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

  updateTransaction: async (id: number, transactionData: Partial<Transaction>): Promise<ApiResponse> => {
    try {
      const response = await api.put<ApiResponse>(
        `/transactions/${id}`,
        transactionData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  deleteTransaction: async (id: number, hardDelete: boolean = false): Promise<void> => {
    try {
      await api.delete(`/transactions/${id}`, {
        params: { hard: hardDelete.toString() },
      });
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
};