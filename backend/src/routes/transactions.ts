import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import prisma from '../prisma/client';

const router: Router = express.Router();

// Set up multer for file upload
export const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!') as any, false);
    }
  },
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1 MB
});

// Upload CSV and process data
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded!' });
      return;
    }

    const filePath = req.file.path;
    const transactions: any[] = [];

    // Start processing the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        console.log('Row Data:', row); // Log the row data for debugging

        // Trim whitespace and validate row structure
        const date = row.Date ? row.Date.trim() : ''; // Ensure correct access to Date field
        const description = row.Description ? row.Description.trim() : '';
        const amount = row.Amount ? parseFloat(row.Amount.trim()) : NaN;

        // Check if date, description, and amount are valid
        if (date && description && !isNaN(amount)) {
          const [day, month, year] = date.split('-');
          const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`); // Convert to YYYY-MM-DD

          const cleanDescription = description.split(/\s+\d+\s+USD/)[0].trim(); // Extract only relevant part

          const transaction = {
            date: formattedDate,
            description: cleanDescription,
            amount: amount,
            currency: row.Currency || null,
          };

          console.log('Parsed Transaction:', transaction);
          transactions.push(transaction);
        } else {
          console.warn('Row missing required fields:', { date, description, amount });
        }
      })
      .on('end', async () => {
        const validTransactions = transactions.filter((t) => t.date && t.description && !isNaN(t.amount));
        console.log('Valid Transactions:', validTransactions);

        const uniqueTransactions = validTransactions.filter((value, index, self) =>
          index === self.findIndex((t) => t.date.getTime() === value.date.getTime() && t.description === value.description),
        );

        console.log('Unique Transactions:', uniqueTransactions);

        try {
          // Insert valid data into the database
          await prisma.transaction.createMany({
            data: uniqueTransactions.map(transaction => ({
              date: transaction.date,
              description: transaction.description,
              amount: transaction.amount,
              currency: transaction.category || null,
            })),
            skipDuplicates: true,
          });

          return res.status(200).json({
            message: 'File processed and transactions saved successfully!',
            inserted: uniqueTransactions.length,
          });
        } catch (dbError) {
          console.error('Database Error:', dbError); // Log detailed error

          const errorMessage = dbError instanceof Error ? dbError.message : 'An unknown error occurred';

          return res.status(500).json({ 
            error: 'Failed to save transactions to the database.', 
            details: errorMessage 
          });
        } finally {
          fs.unlinkSync(filePath); // Clean up uploaded file regardless of success or failure
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        res.status(500).json({ error: 'Failed to read the uploaded CSV file.' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the uploaded file.' });
  }
});

// Fetch all transactions
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany(); // Fetch all transactions
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
});

// Fetch paginated transactions
router.get('/transactions/paginated', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10; // Default limit
  const offset = (page - 1) * limit;

  try {
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        skip: offset,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.transaction.count(),
    ]);
    
    res.json({ transactions, totalCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
});

// Add a new transaction
interface TransactionRequestBody {
  date: string;
  description: string;
  amount: number;
  currency?: string; // Optional
}



router.post('/transactions', async (req: Request<{}, {}, TransactionRequestBody>, res: Response): Promise<any> => {
  const { date, description, amount, currency } = req.body;

  // Validate input
  if (!date || !description || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Check for duplicates
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        date: new Date(date),
        description,
      },
    });

    if (existingTransaction) {
      return res.status(400).json({ error: 'Duplicate transaction found.' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount,
        currency,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add transaction.' });
  }
});




// Edit an existing transaction
router.put('/transactions/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, description, amount, currency } = req.body;

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        description,
        amount,
        currency,
      },
    });

    res.json(updatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update transaction.' });
  }
});

// Delete a transaction (soft or hard delete)
router.delete('/transactions/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const isHardDelete = req.query.hard === 'true'; // Check if hard delete is requested

  try {
    if (isHardDelete) {
      // Perform hard delete
      await prisma.transaction.delete({
        where: { id: parseInt(id) },
      });
    } else {
      // Perform soft delete
      await prisma.transaction.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() }, // Soft delete by setting deletedAt timestamp
      });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete transaction.' });
  }
});

export default router;
