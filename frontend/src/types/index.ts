// // src/types/index.ts
// export interface Transaction {
//     id: number;
//     transaction_date: string;
//     description: string;
//     original_amount: number;
//     amount_inr: number;
//     is_deleted: boolean;
//     created_at: string;
//     updated_at: string;
//   }
  
//   export interface TransactionInput {
//     transaction_date: string;
//     description: string;
//     original_amount: number;
//     amount_inr: number;
//   }
  
//   export interface PaginatedResponse<T> {
//     data: T[];
//     total: number;
//     page: number;
//     totalPages: number;
//   }
  
//   export interface AlertState {
//     open: boolean;
//     message: string;
//     severity: 'success' | 'error' | 'info' | 'warning';
//   }
 
  
  
export interface Transaction {
    id?: number;
    date: string;
    description: string;
    amount: number;
    currency: string;
  }
  
  export interface PaginatedResponse<T> {
    transactions: T[];
    totalPages: number;
    currentPage: number;
  }
  
  export interface ApiResponse {
    message: string;
    transaction?: Transaction;
    error?: string;
    details?: string;
  }
  
  export type UploadStatus = 'uploading' | 'success' | 'error' | null;
  