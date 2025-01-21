// import { Request, Response } from 'express';
// import { parseCSV } from '../utils/csvParserUtils'; 
// import {
//   addTransactionService,
//   getTransactionsService,
//   getPaginatedTransactionsService,
//   updateTransactionService,
//   deleteTransactionService
// } from '../services/transactionService'; 
// import { isValidDate } from '../utils/dateUtils'; 

// // Process the CSV file and insert valid data
// export const processCsvFile = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const filePath = req.file?.path;
//     if (!filePath) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const transactions = await parseCSV(filePath); 

//     for (const transaction of transactions) {
//       let date = transaction.date;

//       if (typeof date !== 'string') {
//         date = String(date); 
//       }

//       date = date.trim();

//       const dateParts = date.split('-');
//       if (dateParts.length !== 3) {
//         console.warn('Invalid date format (should be DD-MM-YYYY):', date);
//         continue;
//       }

//       const description = transaction.description?.trim() || '';
//       const amount = typeof transaction.amount === 'number' ? transaction.amount : NaN;
//       const currency = transaction.currency || 'USD';

//       if (description && !isNaN(amount)) {
//         const [day, month, year] = dateParts;
//         const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`); 

//         await addTransactionService({
//           date: formattedDate.toISOString(),
//           description,
//           amount,
//           currency,
//         });
//       }
//     }

//     return res.status(200).json({ message: 'CSV processed and transactions added successfully' });
//   } catch (err) {
//     return res.status(500).json({
//       error: 'Error processing CSV file',
//       details: err instanceof Error ? err.message : 'Unknown error',
//     });
//   }
// };

// // Get All Transactions
// export const getTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const transactions = await getTransactionsService();
//     return res.status(200).json(transactions);
//   } catch (err) {
//     return res.status(500).json({ error: 'Error fetching transactions', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };

// // Get Paginated Transactions
// export const getPaginatedTransactions = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { page, pageSize } = req.query;

//     const pageNumber = Number(page);
//     const pageSizeNumber = Number(pageSize);

//     if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
//       return res.status(400).json({ error: 'Invalid pagination parameters' });
//     }

//     const transactions = await getPaginatedTransactionsService(pageNumber, pageSizeNumber);
//     return res.status(200).json(transactions);
//   } catch (err) {
//     return res.status(500).json({ error: 'Error fetching paginated transactions', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };

// // Add a New Transaction
// export const addTransaction = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { date, description, amount, currency } = req.body;

//     if (!date || !description || typeof amount !== 'number') {
//       return res.status(400).json({ error: 'Missing required fields.' });
//     }

//     if (!isValidDate(date)) {
//       return res.status(400).json({ error: 'Invalid date.' });
//     }

//     const transaction = await addTransactionService({
//       date: new Date(date).toISOString(),
//       description,
//       amount,
//       currency,
//     });

//     return res.status(201).json(transaction);
//   } catch (err) {
//     return res.status(500).json({ error: 'Error adding transaction', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };

// // Update a Transaction
// export const updateTransaction = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id, date, description, amount, currency } = req.body;

//     if (!id || !date || !description || typeof amount !== 'number') {
//       return res.status(400).json({ error: 'Missing required fields.' });
//     }

//     if (!isValidDate(date)) {
//       return res.status(400).json({ error: 'Invalid date.' });
//     }

//     const updatedTransaction = await updateTransactionService(id, {
//       date: new Date(date).toISOString(),
//       description,
//       amount,
//       currency,
//     });

//     return res.status(200).json(updatedTransaction);
//   } catch (err) {
//     return res.status(500).json({ error: 'Error updating transaction', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };

// // Delete a Transaction
// export const deleteTransaction = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ error: 'Missing transaction ID.' });
//     }

//     await deleteTransactionService(id);

//     return res.status(200).json({ message: 'Transaction deleted successfully' });
//   } catch (err) {
//     return res.status(500).json({ error: 'Error deleting transaction', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };


// import { Request, Response } from 'express';
// import { parseCSV } from '../utils/csvParserUtils'; 
// import {
//   addTransactionService,
//   getTransactionsService,
//   getPaginatedTransactionsService,
//   updateTransactionService,
//   deleteTransactionService
// } from '../services/transactionService'; 
// import { isValidDate } from '../utils/dateUtils'; 

// // Process the CSV file and insert valid data
// export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const filePath = req.file?.path;
//     if (!filePath) {
//       res.status(400).json({ error: 'No file uploaded' });
//       return;
//     }

//     const transactions = await parseCSV(filePath); 

//     for (const transaction of transactions) {
//       let date = transaction.date;

//       if (typeof date !== 'string') {
//         date = String(date); 
//       }

//       date = date.trim();

//       const dateParts = date.split('-');
//       if (dateParts.length !== 3) {
//         console.warn('Invalid date format (should be DD-MM-YYYY):', date);
//         continue;
//       }

//       const description = transaction.description?.trim() || '';
//       const amount = typeof transaction.amount === 'number' ? transaction.amount : NaN;
//       const currency = transaction.currency || 'USD';

//       if (description && !isNaN(amount)) {
//         const [day, month, year] = dateParts;
//         const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`); 

//         await addTransactionService({
//           date: formattedDate.toISOString(),
//           description,
//           amount,
//           currency,
//         });
//       }
//     }

//     res.status(200).json({ message: 'CSV processed and transactions added successfully' });
//   } catch (err) {
//     res.status(500).json({
//       error: 'Error processing CSV file',
//       details: err instanceof Error ? err.message : 'Unknown error',
//     });
//   }
// };

// // Get All Transactions
// export const getTransactions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const transactions = await getTransactionsService();
//     res.status(200).json(transactions);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching transactions', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };

// // Get Paginated Transactions
// export const getPaginatedTransactions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { page, pageSize } = req.query;

//     const pageNumber = Number(page);
//     const pageSizeNumber = Number(pageSize);

//     if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
//       res.status(400).json({ error: 'Invalid pagination parameters' });
//       return;
//     }

//     const transactions = await getPaginatedTransactionsService(pageNumber, pageSizeNumber);
//     res.status(200).json(transactions);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching paginated transactions', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };

// // Add a New Transaction
// export const addTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { date, description, amount, currency } = req.body;

//     if (!date || !description || typeof amount !== 'number') {
//       res.status(400).json({ error: 'Missing required fields.' });
//       return;
//     }

//     if (!isValidDate(date)) {
//       res.status(400).json({ error: 'Invalid date.' });
//       return;
//     }

//     const transaction = await addTransactionService({
//       date: new Date(date).toISOString(),
//       description,
//       amount,
//       currency,
//     });

//     res.status(201).json(transaction);
//   } catch (err) {
//     res.status(500).json({ error: 'Error adding transaction', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };

// // Update a Transaction
// export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id, date, description, amount, currency } = req.body;

//     if (!id || !date || !description || typeof amount !== 'number') {
//       res.status(400).json({ error: 'Missing required fields.' });
//       return;
//     }

//     if (!isValidDate(date)) {
//       res.status(400).json({ error: 'Invalid date.' });
//       return;
//     }

//     const updatedTransaction = await updateTransactionService(id, {
//       date: new Date(date).toISOString(),
//       description,
//       amount,
//       currency,
//     });

//     res.status(200).json(updatedTransaction);
//   } catch (err) {
//     res.status(500).json({ error: 'Error updating transaction', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };

// // Delete a Transaction
// export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       res.status(400).json({ error: 'Missing transaction ID.' });
//       return;
//     }

//     await deleteTransactionService(id);

//     res.status(200).json({ message: 'Transaction deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Error deleting transaction', details: err instanceof Error ? err.message : 'Unknown error' });
//   }
// };
