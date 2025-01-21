

import { Request, Response } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import Decimal from 'decimal.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



// Add Transaction
export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, description, amount, currency } = req.body;

    // Ensure data validity
    if (!date || !description || !amount) {
      res.status(400).json({ error: 'Missing required fields: date, description, amount.' });
      return;
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount: new Decimal(amount),
        currency: currency || 'USD',
      },
    });

    // Ensure newly added transactions are sorted by date descending
    const transactions = await prisma.transaction.findMany({
      where: { deletedAt: null },
      orderBy: {
        date: 'desc', // Sort by date descending
      },
    });

    res.status(201).json({ message: 'Transaction added successfully!', transactions });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to add transaction.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};


// Update Transaction
// export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { date, description, amount, currency } = req.body;

//     // Validate ID
//     const existingTransaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

//     if (!existingTransaction) {
//       res.status(404).json({ error: 'Transaction not found.' });
//       return;
//     }

//     const updatedTransaction = await prisma.transaction.update({
//       where: { id: Number(id) },
//       data: {
//         date: new Date(date),
//         description,
//         amount: new Decimal(amount),
//         currency: currency || 'USD',
//       },
//     });

//     res.status(200).json({ message: 'Transaction updated successfully!', transaction: updatedTransaction });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to update transaction.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// Update Transaction
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


// Delete Transaction (soft delete)
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingTransaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

    if (!existingTransaction) {
      res.status(404).json({ error: 'Transaction not found.' });
      return;
    }

    const deletedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: 'Transaction deleted successfully!', transaction: deletedTransaction });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to delete transaction.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};


// Get Transactions
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { deletedAt: null }, // Exclude soft-deleted transactions
    });

    // Now return the transactions directly as an array
    res.status(200).json(transactions); // Send transactions array directly
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};





// Get Paginated Transactions with sorting by date and time
// Get Paginated Transactions with sorting by date and time
export const getPaginatedTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destructure page and limit from the query parameters
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // If page or limit are invalid, respond with an error
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
      res.status(400).json({ error: 'Invalid page or limit value.' });
      return;
    }

    // Calculate the number of items to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch the paginated and sorted transactions by date and time
    const transactions = await prisma.transaction.findMany({
      where: { deletedAt: null }, // Exclude soft-deleted transactions
      skip, // Number of records to skip based on the current page
      take: limitNumber, // Number of records to fetch based on the limit
      orderBy: {
        date: 'desc', // Sort by date in descending order
       
      },
    });

    // Get the total count of transactions (without pagination)
    const totalTransactions = await prisma.transaction.count({ where: { deletedAt: null } });

    // Send the response with paginated and sorted transactions
    res.status(200).json({
      transactions,
      totalPages: Math.ceil(totalTransactions / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to fetch paginated transactions.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};





// Process CSV File and Save Transactions
export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  const filePath = file.path;
  const transactions: any[] = [];
  let isEmpty = true;
  let malformedRows = false;

  // Start CSV parsing
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      isEmpty = false;
      const date = row.Date?.trim();
      const description = row.Description?.trim();
      const amount = new Decimal(row.Amount?.trim());

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

      if (amount.isNaN()) {
        malformedRows = true;
      }

      if (!date || !description || amount.isNaN()) {
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          res.status(500).json({ error: 'Failed to save transactions.', details: err.message });
        } else {
          res.status(500).json({ error: 'An unexpected error occurred.' });
        }
      } finally {
        fs.unlinkSync(filePath); // Remove the file after processing
      }
    })
    .on('error', (err: unknown) => {
      if (err instanceof Error) {
        res.status(500).json({ error: 'Failed to process CSV file.', details: err.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    });
};
