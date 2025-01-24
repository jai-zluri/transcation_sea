


export interface Transaction {
  

    id?: number;
    date: string;
    description: string;
    amount: number;
    currency: string;
    amountInINR?: number;
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
    duplicates?: Transaction[];
  }

  export interface PaginationConfig {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  }


  export interface TransactionTableProps {
    transactions: Transaction[];
    onDelete: (id: number) => void;
    onBulkDelete: (ids: number[]) => void;  
    onEdit: (transaction: Transaction) => void;
  }
  
  export type UploadStatus = 'uploading' | 'success' | 'error' | null;
  