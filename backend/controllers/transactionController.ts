// // File: controllers/transactionsController.js
// import { Request, Response } from 'express';
// import { MulterRequest } from '../types/multerRequest';
// import Decimal from 'decimal.js';
// import { PrismaClient } from '@prisma/client';
// import { processCsvFileService } from '../src/services/csvService';
// import { 
//   addTransactionService, 
//   updateTransactionService, 
//   deleteTransactionService,
//   getTransactionsService,
//   getPaginatedTransactionsService
// } from '../src/services/transactionService';

// const prisma = new PrismaClient();

// export const addTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { date, description, amount, currency } = req.body;

//     if (!date || !description || !amount) {
//       res.status(400).json({ error: 'Missing required fields: date, description, amount.' });
//       return;
//     }

//     const result = await addTransactionService(date, description, amount, currency);
//     res.status(201).json(result);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to add transaction.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { description, amount, currency } = req.body;

//     const result = await updateTransactionService(Number(id), description, amount, currency);
//     res.status(200).json(result);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to update transaction.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const result = await deleteTransactionService(Number(id));
//     res.status(200).json(result);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to delete transaction.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// export const getTransactions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const transactions = await getTransactionsService();
//     res.status(200).json(transactions);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// export const getPaginatedTransactions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const pageNumber = Number(page);
//     const limitNumber = Number(limit);

//     if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
//       res.status(400).json({ error: 'Invalid page or limit value.' });
//       return;
//     }

//     const result = await getPaginatedTransactionsService(pageNumber, limitNumber);
//     res.status(200).json(result);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to fetch paginated transactions.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const file = req.file;
//     if (!file) {
//       res.status(400).json({ error: 'No file uploaded.' });
//       return;
//     }

//     const result = await processCsvFileService(file);
//     res.status(200).json(result);
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to process CSV file.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };