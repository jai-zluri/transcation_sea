import { Request, Response } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import prisma from '../prisma/client';

// Process uploaded CSV file
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB



export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded!' });
    return;
  }

  // Check file type (ensure it's a CSV)
  const file = req.file;
  if (file.mimetype !== 'text/csv') {
    res.status(400).json({ error: 'Only CSV files are allowed!' });
    return;
  }

  // Check file size limit
  if (file.size > MAX_FILE_SIZE) {
    res.status(400).json({ error: 'File size exceeds the limit of 10MB.' });
    return;
  }

  const filePath = file.path;
  const transactions: any[] = [];
  
  let isEmpty = true; // To track if the file is empty
  let malformedRows = false; // Flag for malformed rows

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      isEmpty = false; // If data is found, the file isn't empty
      const date = row.Date?.trim();
      const description = row.Description?.trim();
      const amount = parseFloat(row.Amount?.trim());

      // Check for invalid date format (e.g. 'dd-mm-yyyy')
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

      // Check for valid amount (must be a number)
      if (isNaN(amount)) {
        malformedRows = true;
      }

      // Ensure all required columns exist
      if (!date || !description || isNaN(amount)) {
        malformedRows = true;
      }
    })
    .on('end', async () => {
      if (isEmpty) {
        res.status(400).json({ error: 'Uploaded CSV file is empty.' });
        return;
      }

      // Handle malformed data (no valid transactions found)
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
        // Clean up the uploaded file
        fs.unlinkSync(filePath);
      }
    })
    .on('error', (err) => {
      if (err instanceof Error) {
        res.status(500).json({ error: 'Error reading CSV file.', details: err.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    });
};



// Get all transactions
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
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

// Add a transaction
export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  const { date, description, amount, currency } = req.body;

  if (!date || !description || typeof amount !== 'number') {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    const transaction = await prisma.transaction.create({
      data: { date: new Date(date), description, amount, currency },
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

// // Update a transaction
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { date, description, amount, currency } = req.body;

  // Validate if the transaction ID is valid
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: 'Missing transaction ID.' });  // Change the error message here
    return;
  }

  try {
    // Attempt to update the transaction in the database
    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date), // Ensure date is a valid Date object
        description,
        amount,
        currency,
      },
    });

    // If transaction is not found, return 404
    if (!updatedTransaction) {
      res.status(404).json({ error: 'Transaction not found.' });
      return;
    }

    // Return the updated transaction with a 200 status code
    res.status(200).json(updatedTransaction);
  } catch (err) {
    // Handle different error types appropriately
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to update transaction.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};


export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const isHardDelete = req.query.hard === 'true';

  // Check if transaction ID is provided in params
  if (!id) {
    res.status(400).json({ error: 'Missing transaction ID.' });
    return;
  }

  try {
    // Check if hard delete or soft delete is requested
    if (isHardDelete) {
      // Hard delete
      await prisma.transaction.delete({ where: { id: parseInt(id) } });
    } else {
      // Soft delete
      await prisma.transaction.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });
    }

    // Send successful response
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error) {
      // Handle known errors
      res.status(500).json({ error: 'Failed to delete transaction.', details: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};
