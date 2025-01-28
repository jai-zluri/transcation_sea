


// import { Request, Response } from 'express';
// import path from 'path';
// import {
//   processCsvFileService,
//   saveTransactions,
//   generateOutputFile,
//   getTransactionsService,
//   getPaginatedTransactionsService,
//   addTransactionService,
//   updateTransactionService,
//   deleteTransactionService
// } from '../services/transactionService';
// export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const file = req.file;
//     if (!file) {
//       res.status(400).json({ error: 'No file uploaded.' });
//       return;
//     }

//     const result = await processCsvFileService(file.path);
//     await saveTransactions(result.transactions);
//     generateOutputFile(result.processedTransactions, path.join(__dirname, '../processed_transactions.csv'));

//     res.status(200).json({
//       message: 'File processed successfully',
//       isEmpty: result.isEmpty,
//       malformedRows: result.malformedRows,
//       duplicateCount: result.duplicateCount
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to process CSV file.' });
//   }
// };
// export const getTransactions = async (req: Request, res: Response) => {
//   try {
//     const transactions = await getTransactionsService();
//     res.status(200).json(transactions);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch transactions.' });
//   }
// };

// export const getPaginatedTransactions = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const offset = (page - 1) * limit;

//     const result = await getPaginatedTransactionsService(offset, limit);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch paginated transactions.' });
//   }
// };



// export const addTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//       const transaction = await addTransactionService(req.body);
//       res.status(201).json(transaction);
//   } catch (err) {
//       if (err instanceof Error) {
//           if (err.message === 'Transaction already exists') {
//               res.status(409).json({ error: err.message });
//           } else {
//               res.status(500).json({ error: 'Error adding transaction', details: err.message });
//           }
//       } else {
//           res.status(500).json({ error: 'An unknown error occurred.' });
//       }
//   }
// };

// export const updateTransaction = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const { date, description, amount, currency } = req.body;
//     const result = await updateTransactionService(id, { date, description, amount, currency });
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update transaction.' });
//   }
// };

// export const deleteTransaction = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const isHardDelete = req.query.hard === 'true';
//     await deleteTransactionService(id, isHardDelete);
//     res.status(200).json({ message: 'Transaction deleted successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete transaction.' });
//   }
// };

// export const downloadFile = async (req: Request, res: Response) => {
//   const filePath = path.join(__dirname, '../processed_transactions.csv');
//   res.download(filePath, 'processed_transactions.csv');
// };