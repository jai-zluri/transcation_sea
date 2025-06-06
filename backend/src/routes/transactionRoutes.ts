

import express, { Router } from 'express';
import { upload } from '../helpers/fileHelper';
import {
  processCsvFile,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getPaginatedTransactions,
  downloadFile // Import the new function
} from '../services/transactionService';

const router: Router = express.Router();

// Upload and process CSV
router.post('/upload', upload.single('file'), processCsvFile);

// Fetch all transactions
router.get('/transactions', getTransactions);

// Fetch paginated transactions
router.get('/transactions/paginated', getPaginatedTransactions);

// Add a new transaction
router.post('/transactions', addTransaction);

// Update an existing transaction
router.put('/transactions/:id', updateTransaction);

// Delete a transaction (soft or hard delete)
router.delete('/transactions/:id', deleteTransaction);

// Download processed CSV file with dynamic file name
router.get('/download/:fileName', downloadFile);

export default router;