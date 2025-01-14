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
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded!' });
      return;
    }

    const transactions: any[] = [];
    let isCSVError = false;

    // Process the CSV file
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath!)
        .pipe(csvParser())
        .on('data', (row) => {
          try {
            const date = row.Date?.trim();
            const description = row.Description?.trim();
            const amount = parseFloat(row.Amount?.trim() || '');

            // Validate and parse the date
            if (date && description && !isNaN(amount)) {
              const [day, month, year] = date.split('-');
              const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

              if (!isNaN(formattedDate.getTime())) {
                transactions.push({
                  date: formattedDate,
                  description,
                  amount,
                  currency: row.Currency?.trim() || null,
                });
              }
            }
          } catch (parseError) {
            console.error('Error parsing row:', parseError);
            isCSVError = true;
          }
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    // Handle empty or invalid CSV files
    if (transactions.length === 0) {
      res.status(400).json({ error: 'CSV file is empty or contains invalid data!' });
      return;
    }

    if (isCSVError) {
      res.status(400).json({ error: 'CSV contains malformed rows. Please fix and retry.' });
      return;
    }

    // Insert transactions into the database
    try {
      const inserted = await prisma.transaction.createMany({
        data: transactions,
        skipDuplicates: true,  // Skips duplicate transactions
      });

      res.status(200).json({
        message: 'File processed and transactions saved successfully!',
        inserted: inserted.count,
      });
      return;
    } catch (dbError) {
      console.error('Database Error:', dbError);
      res.status(500).json({
        error: 'Failed to save transactions to the database.',
        details: dbError instanceof Error ? dbError.message : 'Unknown error',
      });
      return;
    }
  } catch (error) {
    console.error('Processing Error:', error);
    res.status(500).json({ error: 'Failed to process the uploaded file.' });
    return;
  } finally {
    // Clean up uploaded file
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
  }
});






// Fetch all transactions
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
});

// Fetch paginated transactions
router.get('/transactions/paginated', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
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
    console.error(error);
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
      where: { date: new Date(date), description },
    });

    if (existingTransaction) {
      return res.status(400).json({ error: 'Duplicate transaction found.' });
    }

    const transaction = await prisma.transaction.create({
      data: { date: new Date(date), description, amount, currency },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add transaction.' });
  }
});




// Edit an existing transaction
router.put('/transactions/:id', async (req: Request, res: Response) : Promise<any>  => {
  const { id } = req.params;
  const { date, description, amount, currency } = req.body;

  try {
    // Validate that all necessary fields are provided
    if (!date || !description || !amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
       // Ensure the 'id' is valid
       const transactionId = parseInt(id, 10);
       if (isNaN(transactionId)) {
         return res.status(400).json({ error: 'Invalid transaction ID' });
       }



    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { 
        date: new Date(date), 
        description, 
        amount, 
        currency 
      },
    });

    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(updatedTransaction);
  } catch (error) {
    let errorMessage = "Failed to update transaction";
    
    // Enhance error handling to capture different error types
    if (error instanceof Error) {
      // Standard error handling
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'customMessage' in error) {
      // Handle custom error messages if present
      errorMessage = (error as { customMessage: string }).customMessage;
    }

    console.error(errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});


// Delete a transaction (soft or hard delete)

router.delete('/transactions/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  // Validate the id
  const transactionId = parseInt(id, 10);
  if (isNaN(transactionId)) {
    return res.status(400).json({ error: 'Invalid transaction ID' });
  }

  try {
    // Perform soft delete
    const deletedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { deletedAt: new Date() }, // Mark as deleted with current timestamp
    });

    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete transaction.' });
  }
});


export default router;

