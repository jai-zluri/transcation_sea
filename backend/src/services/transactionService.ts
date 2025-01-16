import { Request, Response } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import prisma from '../prisma/client';

// Process uploaded CSV file
export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded!' });
    return;
  }

  const filePath = req.file.path;
  const transactions: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      const date = row.Date?.trim();
      const description = row.Description?.trim();
      const amount = parseFloat(row.Amount?.trim());

      if (date && description && !isNaN(amount)) {
        const [day, month, year] = date.split('-');
        const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
        transactions.push({
          date: formattedDate,
          description,
          amount,
          currency: row.Currency || null,
        });
      }
    })
    .on('end', async () => {
      try {
        await prisma.transaction.createMany({
          data: transactions,
          skipDuplicates: true,
        });
        res.status(200).json({ message: 'File processed successfully!', transactions: transactions.length });
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

// Update a transaction
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { date, description, amount, currency } = req.body;

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { date: new Date(date), description, amount, currency },
    });
    res.json(updatedTransaction);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to update transaction.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

// Delete a transaction


// export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
//   const isHardDelete = req.query.hard === 'true';

//   // Check if transaction ID is provided in params
//   if (!id) {
//     res.status(400).json({ error: 'Missing transaction ID.' });
//     return;
//   }

//   try {
//     if (isHardDelete) {
//       await prisma.transaction.delete({ where: { id: parseInt(id) } });
//     } else {
//       await prisma.transaction.update({
//         where: { id: parseInt(id) },
//         data: { deletedAt: new Date() },
//       });
//     }
//     res.status(204).send();
//   } catch (err) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to delete transaction.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// // export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
// //   const { id } = req.params;
// //   const isHardDelete = req.query.hard === 'true';

// //   try {
// //     if (isHardDelete) {
// //       await prisma.transaction.delete({ where: { id: parseInt(id) } });
// //     } else {
// //       await prisma.transaction.update({
// //         where: { id: parseInt(id) },
// //         data: { deletedAt: new Date() },
// //       });
// //     }
// //     res.status(204).send();
// //   } catch (err) {
// //     if (err instanceof Error) {
// //       res.status(500).json({ error: 'Failed to delete transaction.', details: err.message });
// //     } else {
// //       res.status(500).json({ error: 'An unexpected error occurred.' });
// //     }
// //   }
// // };



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
