


import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 
import Decimal from 'decimal.js';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const MAX_FILE_SIZE = 1 * 1024 * 1024;  // 1MB

export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded!' });
    return;
  }

  const file = req.file;

  // Check file type (ensure it's a CSV)
  if (file.mimetype !== 'text/csv') {
    res.status(400).json({ error: 'Only CSV files are allowed!' });
    return;
  }

  // Check file size limit
  if (file.size > MAX_FILE_SIZE) {
    res.status(400).json({ error: 'File size exceeds the limit of 1MB.' });
    return;
  }

  const filePath = file.path;
  const transactions: any[] = [];
  const transactionSet = new Set<string>(); // To track unique transactions
  const processedTransactions: any[] = []; // To store transactions with status
  
  let isEmpty = true; // To track if the file is empty
  let malformedRows = false; // Flag for malformed rows
  let duplicateCount = 0; // Counter for duplicate transactions

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      isEmpty = false; 
      const date = row.Date?.trim();
      const description = row.Description?.trim();
      const amount = parseFloat(row.Amount?.trim());

      if (date) {
        const [day, month, year] = date.split('-');
        if (day && month && year) {
          const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
          if (isNaN(formattedDate.getTime())) {
            malformedRows = true;
            processedTransactions.push({ ...row, Status: 'Malformed' });
          } else {
            const transactionKey = `${formattedDate.toISOString()}|${description}|${amount}|${row.Currency || ''}`;
            if (transactionSet.has(transactionKey)) {
              duplicateCount++;
              processedTransactions.push({ ...row, Status: 'Duplicate' });
            } else {
              transactionSet.add(transactionKey);
              transactions.push({
                date: formattedDate,
                description,
                amount,
                currency: row.Currency || null,
              });
              processedTransactions.push({ ...row, Status: 'Non-Duplicate' });
            }
          }
        } else {
          malformedRows = true;
          processedTransactions.push({ ...row, Status: 'Malformed' });
        }
      }

      if (isNaN(amount)) {
        malformedRows = true;
        processedTransactions.push({ ...row, Status: 'Malformed' });
      }

      if (!date || !description || isNaN(amount)) {
        malformedRows = true;
        processedTransactions.push({ ...row, Status: 'Malformed' });
      }
    })
    .on('end', async () => {
      if (isEmpty) {
        res.status(400).json({ error: 'Uploaded CSV file is empty.' });
        return;
      }

      if (malformedRows) {
        res.status(400).json({ error: 'CSV contains malformed rows. Please fix and retry.' });
        return;
      }

      // Create a new CSV file with a unique name and status column
      const outputFileName = `processed_transactions_${uuidv4()}.csv`;
      const outputFilePath = path.join(__dirname, outputFileName);
      const outputStream = fs.createWriteStream(outputFilePath);
      outputStream.write('Date,Description,Amount,Currency,Status\n');
      processedTransactions.forEach(transaction => {
        outputStream.write(`${transaction.Date},${transaction.Description},${transaction.Amount},${transaction.Currency},${transaction.Status}\n`);
      });
      outputStream.end();

      try {
        if (transactions.length) {
          await prisma.transaction.createMany({
            data: transactions,
            skipDuplicates: true,
          });
        }
        res.status(200).json({
          message: `File processed successfully! ${duplicateCount} duplicate transactions were found and ignored.`,
          inserted: transactions.length,
          duplicates: duplicateCount,
          downloadLink: `http://localhost:5000/transactions/download/${outputFileName}`
        });
      } catch (err) {
        if (err instanceof Error) {
          res.status(500).json({ error: 'Failed to save transactions.', details: err.message });
        } else {
          res.status(500).json({ error: 'An unexpected error occurred.' });
        }
      } finally {
        fs.unlinkSync(filePath);
      }
    });
};

// Endpoint to handle file download
export const downloadFile = (req: Request, res: Response): void => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, fileName);
  res.download(filePath, fileName, (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to download file.' });
    }
  });
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc', 
      },
    });
    res.json(transactions); 
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        error: 'Failed to fetch transactions.',
        details: err.message, // Provides details about the error
      });
    } else {
      res.status(500).json({
        error: 'An unexpected error occurred.',
      });
    }
  }
};

// Get paginated transactions
export const getPaginatedTransactions = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({ skip: offset, take: limit, orderBy: { date: 'desc' } }),
      prisma.transaction.count(),
    ]);
    res.json({ transactions, totalCount });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  const { date, description, amount, currency } = req.body;

  // Check for missing required fields
  if (!date || !description || typeof amount !== 'number') {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  // Validate the date
  const parsedDate = new Date(date);
  const month = parsedDate.getMonth() + 1; // getMonth() returns 0-based month (0 = January, 1 = February, etc.)
  const day = parsedDate.getDate();

  // Check if the day is valid based on the month
  if (
    (month === 2 && day < 1 || day > 29) || // For February, only days 1-29 are valid
    (month !== 2 && day < 1 || day > 31)   // For other months, only days 1-31 are valid
  ) {
    res.status(400).json({ error: 'Invalid date. Day should be between 1-29 for February or 1-31 for other months.' });
    return;
  }

  try {
    const transaction = await prisma.transaction.create({
      data: { 
        date: parsedDate, 
        description: description.trim(), // Trim spaces from description
        amount, 
        currency 
      },
    });
    res.status(201).json(transaction);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to add transaction.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, description, amount, currency } = req.body;

    // Validate if the transaction exists
    const existingTransaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

    if (!existingTransaction) {
      res.status(404).json({ error: 'Transaction not found.' });
      return;
    }

    // Check for duplicate transaction
    const duplicateTransaction = await prisma.transaction.findFirst({
      where: {
        date: new Date(date),
        description: description.trim(), // Trim spaces from description
        amount: new Decimal(amount),
        currency,
        id: { not: Number(id) }, // Exclude the current transaction being updated
      },
    });

    if (duplicateTransaction) {
      res.status(400).json({ error: 'A transaction with the same date, description, amount, and currency already exists.' });
      return;
    }

    // Update the fields
    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        date: new Date(date),
        description: description.trim() || existingTransaction.description, // Trim spaces from description
        amount: amount ? new Decimal(amount) : existingTransaction.amount,
        currency: currency || existingTransaction.currency,
      },
    });

    res.status(200).json({
      message: 'Transaction updated successfully!',
      transaction: updatedTransaction,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to update transaction.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const isHardDelete = req.query.hard === 'true';

  if (!id) {
    res.status(400).json({ error: 'Missing transaction ID.' });
    return;
  }

  try {
    if (isHardDelete) {
      await prisma.transaction.delete({ where: { id: parseInt(id) } });
    } else {
      await prisma.transaction.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });
    }

    res.status(204).send();
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to delete transaction.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};