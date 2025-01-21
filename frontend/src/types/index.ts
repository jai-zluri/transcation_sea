


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
  