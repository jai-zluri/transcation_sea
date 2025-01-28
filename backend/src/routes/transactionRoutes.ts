

import express, { Router } from 'express';
import { upload } from '../helpers/fileHelper';
import {
  processCsvFile,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getPaginatedTransactions,
  downloadFile
} from '../controllers/transactionsController';

const router: Router = express.Router();

router.post('/upload', upload.single('file'), processCsvFile);
router.get('/transactions', getTransactions);
router.get('/transactions/paginated', getPaginatedTransactions);
router.post('/transactions', addTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.get('/download/processed_transactions.csv', downloadFile);

export default router;