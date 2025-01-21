// // import multer from 'multer';
// // import { Request, Response } from 'express';
// // import fs from 'fs';
// // import csvParser from 'csv-parser';
// // import Decimal from 'decimal.js';
// // import { PrismaClient } from '@prisma/client';
// // const prisma = new PrismaClient();

// // // Multer Storage Configuration
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, 'uploads/'); // Folder where files will be stored
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, Date.now() + '-' + file.originalname); // File name with timestamp
// //   },
// // });

// // // Multer Setup with fileFilter and limits
// // export const upload = multer({
// //   storage: storage, // Using custom storage configuration
// //   fileFilter: (req, file, cb) => {
// //     if (file.mimetype === 'text/csv') {  // Only allow CSV files
// //       cb(null, true);  // Accept the file
// //     } else {
// //       cb(new Error('Only CSV files are allowed!') as any, false);  // Reject other file types
// //     }
// //   },
// //   limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1 MB
// // });

// // // CSV file processing function
// // export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
// //   // Using multer middleware to handle file upload
// //   upload.single('file')(req, res, (err) => {  // 'file' is the key for the uploaded file
// //     if (err) {
// //       res.status(400).json({ error: 'File upload failed.', details: err.message });
// //       return;
// //     }

// //     if (!req.file) {
// //       res.status(400).json({ error: 'No file uploaded!' });
// //       return;
// //     }

// //     const file = req.file;
// //     const filePath = file.path;
// //     const transactions: any[] = [];
// //     let isEmpty = true;
// //     let malformedRows = false;

// //     // Start parsing the CSV file
// //     fs.createReadStream(filePath)
// //       .pipe(csvParser())
// //       .on('data', (row) => {
// //         isEmpty = false;
// //         const date = row.Date?.trim();
// //         const description = row.Description?.trim();
// //         const amount = new Decimal(row.Amount?.trim());

// //         if (date) {
// //           const [day, month, year] = date.split('-');
// //           if (day && month && year) {
// //             const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
// //             if (isNaN(formattedDate.getTime())) {
// //               malformedRows = true;
// //             } else {
// //               transactions.push({
// //                 date: formattedDate,
// //                 description,
// //                 amount,
// //                 currency: row.Currency || null,
// //               });
// //             }
// //           } else {
// //             malformedRows = true;
// //           }
// //         }

// //         if (amount.isNaN()) {
// //           malformedRows = true;
// //         }

// //         if (!date || !description || amount.isNaN()) {
// //           malformedRows = true;
// //         }
// //       })
// //       .on('end', async () => {
// //         if (isEmpty) {
// //           res.status(400).json({ error: 'Uploaded CSV file is empty.' });
// //           return;
// //         }

// //         if (malformedRows) {
// //           res.status(400).json({ error: 'CSV contains malformed rows. Please fix and retry.' });
// //           return;
// //         }

// //         try {
// //           // Save the parsed transactions to the database
// //           await prisma.transaction.createMany({
// //             data: transactions,
// //             skipDuplicates: true,
// //           });
// //           res.status(200).json({
// //             message: 'File processed and transactions saved successfully!',
// //             inserted: transactions.length,
// //           });
// //         } catch (err) {
// //           if (err instanceof Error) {
// //             res.status(500).json({ error: 'Failed to save transactions.', details: err.message });
// //           } else {
// //             res.status(500).json({ error: 'An unexpected error occurred.' });
// //           }
// //         } finally {
// //           // Remove the file after processing
// //           fs.unlinkSync(filePath);
// //         }
// //       });
// //   });
// // };




// // export const getTransactions = async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const transactions = await prisma.transaction.findMany({
// //       orderBy: {
// //         date: 'desc', 
        
// //       },
// //     });
// //     res.json(transactions); 
  
// //   } catch (err) {
// //     if (err instanceof Error) {
// //       res.status(500).json({
// //         error: 'Failed to fetch transactions.',
// //         details: err.message, // Provides details about the error
// //       });
// //     } else {
// //       res.status(500).json({
// //         error: 'An unexpected error occurred.',
// //       });
// //     }
// //   }
// // };




// // // Get paginated transactions
// // export const getPaginatedTransactions = async (req: Request, res: Response): Promise<void> => {
// //   const page = parseInt(req.query.page as string) || 1;
// //   const limit = parseInt(req.query.limit as string) || 10;
// //   const offset = (page - 1) * limit;

// //   try {
// //     const [transactions, totalCount] = await Promise.all([
// //       prisma.transaction.findMany({ skip: offset, take: limit, orderBy: { date: 'desc' } }),
// //       prisma.transaction.count(),
// //     ]);
// //     res.json({ transactions, totalCount });
// //   } catch (err) {
// //     if (err instanceof Error) {
// //       res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
// //     } else {
// //       res.status(500).json({ error: 'An unexpected error occurred.' });
// //     }
// //   }
// // };


// // export const addTransaction = async (req: Request, res: Response): Promise<void> => {
// //   const { date, description, amount, currency } = req.body;

// //   // Check for missing required fields
// //   if (!date || !description || typeof amount !== 'number') {
// //     res.status(400).json({ error: 'Missing required fields.' });
// //     return;
// //   }

// //   // Validate the date
// //   const parsedDate = new Date(date);
// //   const month = parsedDate.getMonth() + 1; // getMonth() returns 0-based month (0 = January, 1 = February, etc.)
// //   const day = parsedDate.getDate();

// //   // Check if the day is valid based on the month
// //   if (
// //     (month === 2 && day < 1 || day > 29) || // For February, only days 1-29 are valid
// //     (month !== 2 && day < 1 || day > 31)   // For other months, only days 1-31 are valid
// //   ) {
// //     res.status(400).json({ error: 'Invalid date. Day should be between 1-29 for February or 1-31 for other months.' });
// //     return;
// //   }

// //   try {
// //     const transaction = await prisma.transaction.create({
// //       data: { date: parsedDate, description, amount, currency },
// //     });
// //     res.status(201).json(transaction);
// //   } catch (err) {
// //     if (err instanceof Error) {
// //       res.status(500).json({ error: 'Failed to add transaction.', details: err.message });
// //     } else {
// //       res.status(500).json({ error: 'An unexpected error occurred.' });
// //     }
// //   }
// // };





// // //update



// // export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
// //   const { id } = req.params;
// //   const { date, description, amount, currency } = req.body;

// //   // Check if transaction ID is valid
// //   if (!id || isNaN(Number(id))) {
// //     res.status(400).json({ error: 'Missing transaction ID.' });
// //     return;
// //   }

// //   // Validate the date format
// //   if (!isValidDate(date)) {
// //     res.status(400).json({ error: 'Invalid date format.' });
// //     return;
// //   }

// //   try {
// //     const updatedTransaction = await prisma.transaction.update({
// //       where: { id: parseInt(id) },
// //       data: {
// //         date: new Date(date),
// //         description,
// //         amount,
// //         currency,
// //       },
// //     });

// //     if (!updatedTransaction) {
// //       res.status(404).json({ error: 'Transaction not found.' });
// //       return;
// //     }

// //     res.status(200).json(updatedTransaction);
// //   } catch (err) {
// //     if (err instanceof Error) {
// //       res.status(500).json({ error: 'Failed to update transaction.', details: err.message });
// //     } else {
// //       res.status(500).json({ error: 'An unexpected error occurred.' });
// //     }
// //   }
// // };

// // // Helper function to validate the date
// // const isValidDate = (date: string): boolean => {
// //   const [year, month, day] = date.split('-').map(Number);
// //   if (month < 1 || month > 12) {
// //     return false;
// //   }
// //   const daysInMonth = new Date(year, month, 0).getDate();
// //   return day >= 1 && day <= daysInMonth;
// // };




// // // Delete a transaction
// // export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
// //   const { id } = req.params;
// //   const isHardDelete = req.query.hard === 'true';

// //   if (!id) {
// //     res.status(400).json({ error: 'Missing transaction ID.' });
// //     return;
// //   }

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

// import { Request, Response } from 'express';
// import fs from 'fs';
// import csvParser from 'csv-parser';
// import Decimal from 'decimal.js';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// // Add Transaction
// export const addTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { date, description, amount, currency } = req.body;

//     // Ensure data validity
//     if (!date || !description || !amount) {
//       res.status(400).json({ error: 'Missing required fields: date, description, amount.' });
//       return;
//     }

//     const newTransaction = await prisma.transaction.create({
//       data: {
//         date: new Date(date),
//         description,
//         amount: new Decimal(amount),
//         currency: currency || 'USD',
//       },
//     });

//     res.status(201).json({ message: 'Transaction added successfully!', transaction: newTransaction });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to add transaction.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// // Update Transaction
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

// // Delete Transaction (soft delete)
// export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const existingTransaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

//     if (!existingTransaction) {
//       res.status(404).json({ error: 'Transaction not found.' });
//       return;
//     }

//     const deletedTransaction = await prisma.transaction.update({
//       where: { id: Number(id) },
//       data: { deletedAt: new Date() },
//     });

//     res.status(200).json({ message: 'Transaction deleted successfully!', transaction: deletedTransaction });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to delete transaction.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// // Get Transactions
// export const getTransactions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const transactions = await prisma.transaction.findMany({
//       where: { deletedAt: null }, // Exclude soft-deleted transactions
//     });

//     res.status(200).json({ transactions });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// // Get Paginated Transactions
// export const getPaginatedTransactions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (Number(page) - 1) * Number(limit);

//     const transactions = await prisma.transaction.findMany({
//       where: { deletedAt: null }, // Exclude soft-deleted transactions
//       skip,
//       take: Number(limit),
//     });

//     const totalTransactions = await prisma.transaction.count({ where: { deletedAt: null } });

//     res.status(200).json({
//       transactions,
//       totalPages: Math.ceil(totalTransactions / Number(limit)),
//       currentPage: page,
//     });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to fetch paginated transactions.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// // Process CSV File and Save Transactions
// export const processCsvFile = async (req: Request, res: Response): Promise<void> => {
//   const file = req.file;
//   if (!file) {
//     res.status(400).json({ error: 'No file uploaded.' });
//     return;
//   }

//   const filePath = file.path;
//   const transactions: any[] = [];
//   let isEmpty = true;
//   let malformedRows = false;

//   // Start CSV parsing
//   fs.createReadStream(filePath)
//     .pipe(csvParser())
//     .on('data', (row) => {
//       isEmpty = false;
//       const date = row.Date?.trim();
//       const description = row.Description?.trim();
//       const amount = new Decimal(row.Amount?.trim());

//       if (date) {
//         const [day, month, year] = date.split('-');
//         if (day && month && year) {
//           const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
//           if (isNaN(formattedDate.getTime())) {
//             malformedRows = true;
//           } else {
//             transactions.push({
//               date: formattedDate,
//               description,
//               amount,
//               currency: row.Currency || null,
//             });
//           }
//         } else {
//           malformedRows = true;
//         }
//       }

//       if (amount.isNaN()) {
//         malformedRows = true;
//       }

//       if (!date || !description || amount.isNaN()) {
//         malformedRows = true;
//       }
//     })
//     .on('end', async () => {
//       if (isEmpty) {
//         res.status(400).json({ error: 'Uploaded CSV file is empty.' });
//         return;
//       }

//       if (malformedRows) {
//         res.status(400).json({ error: 'CSV contains malformed rows. Please fix and retry.' });
//         return;
//       }

//       try {
//         await prisma.transaction.createMany({
//           data: transactions,
//           skipDuplicates: true,
//         });

//         res.status(200).json({
//           message: 'File processed and transactions saved successfully!',
//           inserted: transactions.length,
//         });
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           res.status(500).json({ error: 'Failed to save transactions.', details: err.message });
//         } else {
//           res.status(500).json({ error: 'An unexpected error occurred.' });
//         }
//       } finally {
//         fs.unlinkSync(filePath); // Remove the file after processing
//       }
//     })
//     .on('error', (err: unknown) => {
//       if (err instanceof Error) {
//         res.status(500).json({ error: 'Failed to process CSV file.', details: err.message });
//       } else {
//         res.status(500).json({ error: 'An unexpected error occurred.' });
//       }
//     });
// };


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

    res.status(201).json({ message: 'Transaction added successfully!', transaction: newTransaction });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: 'Failed to add transaction.', details: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};

// Update Transaction
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, description, amount, currency } = req.body;

    // Validate ID
    const existingTransaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

    if (!existingTransaction) {
      res.status(404).json({ error: 'Transaction not found.' });
      return;
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        date: new Date(date),
        description,
        amount: new Decimal(amount),
        currency: currency || 'USD',
      },
    });

    res.status(200).json({ message: 'Transaction updated successfully!', transaction: updatedTransaction });
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
// export const getTransactions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const transactions = await prisma.transaction.findMany({
//       where: { deletedAt: null }, // Exclude soft-deleted transactions
//     });

//     res.status(200).json({ transactions });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

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


// Get Paginated Transactions
// export const getPaginatedTransactions = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const pageNum = Number(page);
//     const limitNum = Number(limit);

//     if (isNaN(pageNum) || isNaN(limitNum)) {
//      res.status(400).json({ error: 'Invalid page or limit' });
//      return;
//     }

//     const skip = (pageNum - 1) * limitNum;

//     const transactions = await prisma.transaction.findMany({
//       where: { deletedAt: null }, // Exclude soft-deleted transactions
//       skip,
//       take: limitNum,
//     });

//     const totalTransactions = await prisma.transaction.count({ where: { deletedAt: null } });

//     res.status(200).json({
//       transactions,
//       totalPages: Math.ceil(totalTransactions / limitNum),
//       currentPage: pageNum,
//     });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: 'Failed to fetch paginated transactions.', details: err.message });
//     } else {
//       res.status(500).json({ error: 'An unexpected error occurred.' });
//     }
//   }
// };

// Get Paginated Transactions
// Get Paginated Transactions
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

    // Fetch the paginated transactions from the database
    const transactions = await prisma.transaction.findMany({
      where: { deletedAt: null }, // Exclude soft-deleted transactions
      skip, // Number of records to skip based on the current page
      take: limitNumber, // Number of records to fetch based on the limit
    });

    // Get the total count of transactions (without pagination)
    const totalTransactions = await prisma.transaction.count({ where: { deletedAt: null } });

    // Send the response with paginated transactions
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
