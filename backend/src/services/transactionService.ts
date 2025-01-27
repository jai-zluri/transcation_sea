

import { Request, Response } from 'express';
import fs from 'fs';
import Decimal from 'decimal.js';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const MAX_FILE_SIZE = 1 * 1024 * 1024; 

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
  
  let isEmpty = true; // To track if the file is empty
  let malformedRows = false; // Flag for malformed rows

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
          } else {
            transactions.push({
              date: formattedDate,
              description,
              amount,
              currency: row.Currency || null,
            });
          }
        } else {
          malformedRows = true;
        }
      }

      if (isNaN(amount)) {
        malformedRows = true;
      }

      if (!date || !description || isNaN(amount)) {
        malformedRows = true;
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

      try {
        await prisma.transaction.createMany({
          data: transactions,
          skipDuplicates: true,
        });
        res.status(200).json({
          message: 'File processed and transactions saved successfully!',
          inserted: transactions.length,
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
    })
  
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
      data: { date: parsedDate, description, amount, currency },
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
    const { description, amount, currency } = req.body;

    // Validate if the transaction exists
    const existingTransaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

    if (!existingTransaction) {
      res.status(404).json({ error: 'Transaction not found.' });
      return;
    }

    // Update the fields and set the date to the current date
    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        description: description || existingTransaction.description,
        amount: amount ? new Decimal(amount) : existingTransaction.amount,
        currency: currency || existingTransaction.currency,
        date: new Date(), // Update the date to the current date
      },
    });

    // Fetch all transactions sorted by date descending
    const transactions = await prisma.transaction.findMany({
      where: { deletedAt: null },
      orderBy: {
        date: 'desc',
      },
    });

    res.status(200).json({
      message: 'Transaction updated successfully!',
      transaction: updatedTransaction,
      transactions, // Return sorted transactions
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

