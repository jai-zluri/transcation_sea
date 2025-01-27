// // import { Request, Response } from 'express';
// // import { Decimal } from 'decimal.js';
// // import { processCsvFile, getTransactions, getPaginatedTransactions, addTransaction, updateTransaction, deleteTransaction } from '../src/services/transactionService';
// // import { PrismaClient } from '@prisma/client';

// // jest.mock('@prisma/client', () => {
// //   const mockPrismaClient = {
// //     transaction: {
// //       createMany: jest.fn(),
// //       findMany: jest.fn(),
// //       create: jest.fn(),
// //       findUnique: jest.fn(),
// //       update: jest.fn(),
// //       delete: jest.fn(),
// //       count: jest.fn(),
// //     },
// //   };
// //   return { PrismaClient: jest.fn(() => mockPrismaClient) };
// // });

// // const mockPrisma = new PrismaClient();

// // const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

// // describe('Transaction Controller', () => {
// //   describe('processCsvFile', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = {};
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should return 400 if no file is uploaded', async () => {
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded!' });
// //     });

// //     it('should return 400 if file type is not csv', async () => {
// //       req.file = { mimetype: 'application/json', size: 0 } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Only CSV files are allowed!' });
// //     });

// //     it('should return 400 if file size exceeds limit', async () => {
// //       req.file = { mimetype: 'text/csv', size: MAX_FILE_SIZE + 1 } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'File size exceeds the limit of 1MB.' });
// //     });

// //     it('should return 400 if CSV contains malformed rows', async () => {
// //       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from('Date,Description,Amount\nmalformed,row') } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'CSV contains malformed rows. Please fix and retry.' });
// //     });

// //     it('should save transactions and return 200 on success', async () => {
// //       const csvContent = 'Date,Description,Amount,Currency\n25-02-2020,AMAZON,237,INR\n16-09-2022,GOOGLE CLOUD,310,USD';
// //       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from(csvContent) } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(mockPrisma.transaction.createMany).toHaveBeenCalled();
// //       expect(res.status).toHaveBeenCalledWith(200);
// //       expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'File processed and transactions saved successfully!' }));
// //     });
// //   });

// //   describe('getTransactions', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = {};
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should fetch transactions and return 200', async () => {
// //       (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
// //       await getTransactions(req as Request, res as Response);
// //       expect(res.json).toHaveBeenCalled();
// //     });

// //     it('should handle errors properly', async () => {
// //       (mockPrisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       await getTransactions(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
// //     });
// //   });

// //   describe('getPaginatedTransactions', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = { query: {} };
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should fetch paginated transactions and return 200', async () => {
// //       (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
// //       (mockPrisma.transaction.count as jest.Mock).mockResolvedValue(0);
// //       await getPaginatedTransactions(req as Request, res as Response);
// //       expect(res.json).toHaveBeenCalled();
// //     });

// //     it('should handle errors properly', async () => {
// //       (mockPrisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       await getPaginatedTransactions(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
// //     });
// //   });

// //   describe('addTransaction', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = { body: {} };
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should return 400 if required fields are missing', async () => {
// //       await addTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields.' });
// //     });

// //     it('should return 400 for invalid date', async () => {
// //       req.body = { date: '2021-02-30', description: 'Test', amount: 100, currency: 'USD' };
// //       await addTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date. Day should be between 1-29 for February or 1-31 for other months.' });
// //     });

// //     it('should add transaction and return 201 on success', async () => {
// //       const transaction = { id: 1, date: new Date(), description: 'Test', amount: new Decimal(100), currency: 'USD' };
// //       (mockPrisma.transaction.create as jest.Mock).mockResolvedValue(transaction);
// //       req.body = { date: '2021-02-28', description: 'Test', amount: 100, currency: 'USD' };
// //       await addTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(201);
// //       expect(res.json).toHaveBeenCalledWith(transaction);
// //     });

// //     it('should handle errors properly', async () => {
// //       (mockPrisma.transaction.create as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       req.body = { date: '2021-02-28', description: 'Test', amount: 100, currency: 'USD' };
// //       await addTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add transaction.', details: 'Database error' });
// //     });
// //   });

// //   describe('updateTransaction', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = { params: {}, body: {} };
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should return 404 if transaction is not found', async () => {
// //       (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue(null);
// //       req.params = { id: '1' };
// //       await updateTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(404);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Transaction not found.' });
// //     });

// //     it('should update transaction and return 200 on success', async () => {
// //       const transaction = { id: 1, date: new Date(), description: 'Test', amount: new Decimal(100), currency: 'USD' };
// //       (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue(transaction);
// //       (mockPrisma.transaction.update as jest.Mock).mockResolvedValue(transaction);
// //       req.params = { id: '1' };
// //       req.body = { description: 'Updated Test', amount: 200, currency: 'EUR' };
// //       await updateTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(200);
// //       expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Transaction updated successfully!' }));
// //     });

// //     it('should handle errors properly', async () => {
// //       (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
// //       (mockPrisma.transaction.update as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       req.params = { id: '1' };
// //       req.body = { description: 'Updated Test', amount: 200, currency: 'EUR' };
// //       await updateTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update transaction.', details: 'Database error' });
// //     });
// //   });

// //   describe('deleteTransaction', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = { params: {}, query: {} };
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //         send: jest.fn(),
// //       };
// //     });

// //     it('should return 400 if transaction ID is missing', async () => {
// //       await deleteTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Missing transaction ID.' });
// //     });

// //     it('should delete transaction and return 204 on success', async () => {
// //       req.params = { id: '1' };
// //       req.query = { hard: 'true' };
// //       await deleteTransaction(req as Request, res as Response);
// //       expect(mockPrisma.transaction.delete).toHaveBeenCalled();
// //       expect(res.status).toHaveBeenCalledWith(204);
// //       expect(res.send).toHaveBeenCalled();
// //     });

// //     it('should mark transaction as deleted and return 204 on success', async () => {
// //       req.params = { id: '1' };
// //       await deleteTransaction(req as Request, res as Response);
// //       expect(mockPrisma.transaction.update).toHaveBeenCalled();
// //       expect(res.status).toHaveBeenCalledWith(204);
// //       expect(res.send).toHaveBeenCalled();
// //     });

// //     it('should handle errors properly', async () => {
// //       (mockPrisma.transaction.update as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       req.params = { id: '1' };
// //       await deleteTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete transaction.', details: 'Database error' });
// //     });
// //   });
// // });

// // import { Request, Response } from 'express';
// // import { Decimal } from 'decimal.js';
// // import { processCsvFile, getTransactions, getPaginatedTransactions, addTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';
// // import { PrismaClient } from '@prisma/client';

// // jest.mock('@prisma/client', () => {
// //   const mockPrismaClient = {
// //     transaction: {
// //       createMany: jest.fn(),
// //       findMany: jest.fn(),
// //       create: jest.fn(),
// //       findUnique: jest.fn(),
// //       update: jest.fn(),
// //       delete: jest.fn(),
// //       count: jest.fn(),
// //     },
// //   };
// //   return { PrismaClient: jest.fn(() => mockPrismaClient) };
// // });

// // const mockPrisma = new PrismaClient();

// // const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

// // describe('Transaction Controller', () => {
// //   describe('processCsvFile', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = {};
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should return 400 if no file is uploaded', async () => {
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded!' });
// //     });

// //     it('should return 400 if file type is not csv', async () => {
// //       req.file = { mimetype: 'application/json', size: 0 } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Only CSV files are allowed!' });
// //     });

// //     it('should return 400 if file size exceeds limit', async () => {
// //       req.file = { mimetype: 'text/csv', size: MAX_FILE_SIZE + 1 } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'File size exceeds the limit of 1MB.' });
// //     });

// //     it('should return 400 if CSV contains malformed rows', async () => {
// //       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from('Date,Description,Amount\nmalformed,row') } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'CSV contains malformed rows. Please fix and retry.' });
// //     });

// //     it('should return 400 if CSV file is empty', async () => {
// //       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from('') } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Uploaded CSV file is empty.' });
// //     });

// //     it('should save transactions and return 200 on success', async () => {
// //       const csvContent = 'Date,Description,Amount,Currency\n25-02-2020,AMAZON,237,INR\n16-09-2022,GOOGLE CLOUD,310,USD';
// //       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from(csvContent) } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(mockPrisma.transaction.createMany).toHaveBeenCalled();
// //       expect(res.status).toHaveBeenCalledWith(200);
// //       expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'File processed and transactions saved successfully!' }));
// //     });

// //     it('should handle database errors', async () => {
// //       (mockPrisma.transaction.createMany as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       const csvContent = 'Date,Description,Amount,Currency\n25-02-2020,AMAZON,237,INR\n16-09-2022,GOOGLE CLOUD,310,USD';
// //       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from(csvContent) } as Express.Multer.File;
// //       await processCsvFile(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save transactions.', details: 'Database error' });
// //     });
// //   });

// //   describe('getTransactions', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = {};
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should fetch transactions and return 200', async () => {
// //       (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
// //       await getTransactions(req as Request, res as Response);
// //       expect(res.json).toHaveBeenCalled();
// //     });

// //     it('should handle errors properly', async () => {
// //       (mockPrisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       await getTransactions(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
// //     });
// //   });

// //   describe('getPaginatedTransactions', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = { query: {} };
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should fetch paginated transactions and return 200', async () => {
// //       (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
// //       (mockPrisma.transaction.count as jest.Mock).mockResolvedValue(0);
// //       await getPaginatedTransactions(req as Request, res as Response);
// //       expect(res.json).toHaveBeenCalled();
// //     });

// //     it('should handle errors properly', async () => {
// //       (mockPrisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       await getPaginatedTransactions(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
// //     });

// //     it('should handle invalid page and limit values', async () => {
// //       req.query = { page: 'invalid', limit: 'invalid' };
// //       await getPaginatedTransactions(req as Request, res as Response);
// //       expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({ skip: 0, take: 10, orderBy: { date: 'desc' } });
// //     });
// //   });

// //   describe('addTransaction', () => {
// //     let req: Partial<Request>;
// //     let res: Partial<Response>;

// //     beforeEach(() => {
// //       req = { body: {} };
// //       res = {
// //         status: jest.fn().mockReturnThis(),
// //         json: jest.fn(),
// //       };
// //     });

// //     it('should return 400 if required fields are missing', async () => {
// //       await addTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields.' });
// //     });

// //     it('should return 400 for invalid date', async () => {
// //       req.body = { date: '2021-02-30', description: 'Test', amount: 100, currency: 'USD' };
// //       await addTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date. Day should be between 1-29 for February or 1-31 for other months.' });
// //     });

// //     it('should add transaction and return 201 on success', async () => {
// //       const transaction = { id: 1, date: new Date(), description: 'Test', amount: new Decimal(100), currency: 'USD' };
// //       (mockPrisma.transaction.create as jest.Mock).mockResolvedValue(transaction);
// //       req.body = { date: '2021-02-28', description: 'Test', amount: 100, currency: 'USD' };
// //       await addTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(201);
// //       expect(res.json).toHaveBeenCalledWith(transaction);
// //     });

// //     it('should handle errors properly', async () => {
// //       (mockPrisma.transaction.create as jest.Mock).mockRejectedValue(new Error('Database error'));
// //       req.body = { date: '2021-02-28', description: 'Test', amount: 100, currency: 'USD' };
// //       await addTransaction(req as Request, res as Response);
// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.json).toHaveBeen
// import { Request, Response } from 'express';
// import { Decimal } from 'decimal.js';
// import { processCsvFile, getTransactions, getPaginatedTransactions, addTransaction, updateTransaction, deleteTransaction } from '../src/services/transactionService';
// import { PrismaClient } from '@prisma/client';

// jest.mock('@prisma/client', () => {
//   const mockPrismaClient = {
//     transaction: {
//       createMany: jest.fn(),
//       findMany: jest.fn(),
//       create: jest.fn(),
//       findUnique: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//       count: jest.fn(),
//     },
//   };
//   return { PrismaClient: jest.fn(() => mockPrismaClient) };
// });

// const mockPrisma = new PrismaClient();

// const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

// describe('Transaction Controller', () => {
//   describe('processCsvFile', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//       req = {};
//       res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
//     });

//     it('should return 400 if no file is uploaded', async () => {
//       await processCsvFile(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded!' });
//     });

//     it('should return 400 if file type is not csv', async () => {
//       req.file = { mimetype: 'application/json', size: 0 } as Express.Multer.File;
//       await processCsvFile(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Only CSV files are allowed!' });
//     });

//     it('should return 400 if file size exceeds limit', async () => {
//       req.file = { mimetype: 'text/csv', size: MAX_FILE_SIZE + 1 } as Express.Multer.File;
//       await processCsvFile(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'File size exceeds the limit of 1MB.' });
//     });

//     it('should return 400 if CSV contains malformed rows', async () => {
//       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from('Date,Description,Amount\nmalformed,row') } as Express.Multer.File;
//       await processCsvFile(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'CSV contains malformed rows. Please fix and retry.' });
//     });

//     it('should return 400 if CSV file is empty', async () => {
//       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from('') } as Express.Multer.File;
//       await processCsvFile(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Uploaded CSV file is empty.' });
//     });

//     it('should save transactions and return 200 on success', async () => {
//       const csvContent = 'Date,Description,Amount,Currency\n25-02-2020,AMAZON,237,INR\n16-09-2022,GOOGLE CLOUD,310,USD';
//       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from(csvContent) } as Express.Multer.File;
//       await processCsvFile(req as Request, res as Response);
//       expect(mockPrisma.transaction.createMany).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'File processed and transactions saved successfully!' }));
//     });

//     it('should handle database errors', async () => {
//       (mockPrisma.transaction.createMany as jest.Mock).mockRejectedValue(new Error('Database error'));
//       const csvContent = 'Date,Description,Amount,Currency\n25-02-2020,AMAZON,237,INR\n16-09-2022,GOOGLE CLOUD,310,USD';
//       req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from(csvContent) } as Express.Multer.File;
//       await processCsvFile(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save transactions.', details: 'Database error' });
//     });
//   });

//   describe('getTransactions', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//       req = {};
//       res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
//     });

//     it('should fetch transactions and return 200', async () => {
//       (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
//       await getTransactions(req as Request, res as Response);
//       expect(res.json).toHaveBeenCalled();
//     });

//     it('should handle errors properly', async () => {
//       (mockPrisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
//       await getTransactions(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
//     });
//   });

//   describe('getPaginatedTransactions', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//       req = { query: {} };
//       res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
//     });

//     it('should fetch paginated transactions and return 200', async () => {
//       (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
//       (mockPrisma.transaction.count as jest.Mock).mockResolvedValue(0);
//       await getPaginatedTransactions(req as Request, res as Response);
//       expect(res.json).toHaveBeenCalled();
//     });

//     it('should handle errors properly', async () => {
//       (mockPrisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
//       await getPaginatedTransactions(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
//     });

//     it('should handle invalid page and limit values', async () => {
//       req.query = { page: 'invalid', limit: 'invalid' };
//       await getPaginatedTransactions(req as Request, res as Response);
//       expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({ skip: 0, take: 10, orderBy: { date: 'desc' } });
//     });
//   });

//   describe('addTransaction', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//       req = { body: {} };
//       res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
//     });

//     it('should return 400 if required fields are missing', async () => {
//       await addTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields.' });
//     });

//     it('should return 400 for invalid date', async () => {
//       req.body = { date: '2021-02-30', description: 'Test', amount: 100, currency: 'USD' };
//       await addTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date. Day should be between 1-29 for February or 1-31 for other months.' });
//     });

//     it('should add transaction and return 201 on success', async () => {
//       const transaction = { id: 1, date: new Date(), description: 'Test', amount: new Decimal(100), currency: 'USD' };
//       (mockPrisma.transaction.create as jest.Mock).mockResolvedValue(transaction);
//       req.body = { date: '2021-02-28', description: 'Test', amount: 100, currency: 'USD' };
//       await addTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith(transaction);
//     });

//     it('should handle errors properly', async () => {
//       (mockPrisma.transaction.create as jest.Mock).mockRejectedValue(new Error('Database error'));
//       req.body = { date: '2021-02-28', description: 'Test', amount: 100, currency: 'USD' };
//       await addTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add transaction.', details: 'Database error' });
//     });
//   });

//   describe('updateTransaction', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//       req = { params: {}, body: {} };
//       res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
//     });

//     it('should return 404 if transaction is not found', async () => {
//       (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue(null);
//       req.params = { id: '1' };
//       await updateTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Transaction not found.' });
//     });

//     it('should update transaction and return 200 on success', async () => {
//       const transaction = { id: 1, date: new Date(), description: 'Test', amount: new Decimal(100), currency: 'USD' };
//       (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue(transaction);
//       (mockPrisma.transaction.update as jest.Mock).mockResolvedValue(transaction);
//       req.params = { id: '1' };
//       req.body = { description: 'Updated Test', amount: 200, currency: 'EUR' };
//       await updateTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Transaction updated successfully!' }));
//     });

//     it('should handle errors properly', async () => {
//       (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
//       (mockPrisma.transaction.update as jest.Mock).mockRejectedValue(new Error('Database error'));
//       req.params = { id: '1' };
//       req.body = { description: 'Updated Test', amount: 200, currency: 'EUR' };
//       await updateTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update transaction.', details: 'Database error' });
//     });

//     it('should return 400 if required fields are missing', async () => {
//       req.params = { id: '1' };
//       req.body = {};
//       await updateTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields.' });
//     });
//   });

//   describe('deleteTransaction', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;

//     beforeEach(() => {
//       req = { params: {}, query: {} };
//       res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//         send: jest.fn(),
//       };
//     });

//     it('should return 400 if transaction ID is missing', async () => {
//       await deleteTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Missing transaction ID.' });
//     });

//     it('should delete transaction and return 204 on success', async () => {
//       req.params = { id: '1' };
//       req.query = { hard: 'true' };
//       await deleteTransaction(req as Request, res as Response);
//       expect(mockPrisma.transaction.delete).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(204);
//       expect(res.send).toHaveBeenCalled();
//     });

//     it('should mark transaction as deleted and return 204 on success', async () => {
//       req.params = { id: '1' };
//       await deleteTransaction(req as Request, res as Response);
//       expect(mockPrisma.transaction.update).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(204);
//       expect(res.send).toHaveBeenCalled();
//     });

//     it('should handle errors properly', async () => {
//       (mockPrisma.transaction.update as jest.Mock).mockRejectedValue(new Error('Database error'));
//       req.params = { id: '1' };
//       await deleteTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete transaction.', details: 'Database error' });
//     });

//     it('should handle invalid transaction ID', async () => {
//       req.params = { id: 'invalid' };
//       await deleteTransaction(req as Request, res as Response);
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Invalid transaction ID.' });
//     });
//   });
// });



import { Request, Response } from 'express';
import fs from 'fs';
import Decimal from 'decimal.js';
import { processCsvFile, getTransactions, getPaginatedTransactions, addTransaction, updateTransaction, deleteTransaction } from '../src/services/transactionService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    transaction: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const mockPrisma = new PrismaClient();

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

describe('Transaction Controller', () => {
  describe('processCsvFile', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should return 400 if no file is uploaded', async () => {
      await processCsvFile(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded!' });
    });

    it('should return 400 if file type is not csv', async () => {
      req.file = { mimetype: 'application/json', size: 0 } as Express.Multer.File;
      await processCsvFile(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Only CSV files are allowed!' });
    });

    it('should return 400 if file size exceeds limit', async () => {
      req.file = { mimetype: 'text/csv', size: MAX_FILE_SIZE + 1 } as Express.Multer.File;
      await processCsvFile(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'File size exceeds the limit of 1MB.' });
    });

    it('should return 400 if CSV contains malformed rows', async () => {
      req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from('Date,Description,Amount\nmalformed,row') } as Express.Multer.File;
      await processCsvFile(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'CSV contains malformed rows. Please fix and retry.' });
    });

    it('should return 400 if CSV file is empty', async () => {
      req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from('') } as Express.Multer.File;
      await processCsvFile(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Uploaded CSV file is empty.' });
    });

    it('should save transactions and return 200 on success', async () => {
      const csvContent = 'Date,Description,Amount,Currency\n25-02-2020,AMAZON,237,INR\n16-09-2022,GOOGLE CLOUD,310,USD';
      req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from(csvContent) } as Express.Multer.File;
      await processCsvFile(req as Request, res as Response);
      expect(mockPrisma.transaction.createMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'File processed and transactions saved successfully!' }));
    });

    it('should handle database errors', async () => {
      (mockPrisma.transaction.createMany as jest.Mock).mockRejectedValue(new Error('Database error'));
      const csvContent = 'Date,Description,Amount,Currency\n25-02-2020,AMAZON,237,INR\n16-09-2022,GOOGLE CLOUD,310,USD';
      req.file = { mimetype: 'text/csv', size: 100, buffer: Buffer.from(csvContent) } as Express.Multer.File;
      await processCsvFile(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save transactions.', details: 'Database error' });
    });
  });

  describe('getTransactions', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should fetch transactions and return 200', async () => {
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      await getTransactions(req as Request, res as Response);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      (mockPrisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
      await getTransactions(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
    });
  });

  describe('getPaginatedTransactions', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = { query: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should fetch paginated transactions and return 200', async () => {
      (mockPrisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.transaction.count as jest.Mock).mockResolvedValue(0);
      await getPaginatedTransactions(req as Request, res as Response);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      (mockPrisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
      await getPaginatedTransactions(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
    });

    it('should handle invalid page and limit values', async () => {
      req.query = { page: 'invalid', limit: 'invalid' };
      await getPaginatedTransactions(req as Request, res as Response);
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({ skip: 0, take: 10, orderBy: { date: 'desc' } });
    });
  });

  describe('addTransaction', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should return 400 if required fields are missing', async () => {
      await addTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields.' });
    });

    it('should return 400 for invalid date', async () => {
      req.body = { date: '2021-02-30', description: 'Test', amount: 100, currency: 'USD' };
      await addTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date. Day should be between 1-29 for February or 1-31 for other months.' });
    });

    it('should add transaction and return 201 on success', async () => {
      const transaction = { id: 1, date: new Date(), description: 'Test', amount: new Decimal(100), currency: 'USD' };
      (mockPrisma.transaction.create as jest.Mock).mockResolvedValue(transaction);
      req.body = { date: '2021-02-28', description: 'Test', amount: 100, currency: 'USD' };
      await addTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(transaction);
    });

    it('should handle errors properly', async () => {
      (mockPrisma.transaction.create as jest.Mock).mockRejectedValue(new Error('Database error'));
      req.body = { date: '2021-02-28', description: 'Test', amount: 100, currency: 'USD' };
      await addTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add transaction.', details: 'Database error' });
    });
  });

  describe('updateTransaction', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = { params: {}, body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should return 404 if transaction is not found', async () => {
      (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue(null);
      req.params = { id: '1' };
      await updateTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Transaction not found.' });
    });

    it('should update transaction and return 200 on success', async () => {
      const transaction = { id: 1, date: new Date(), description: 'Test', amount: new Decimal(100), currency: 'USD' };
      (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue(transaction);
      (mockPrisma.transaction.update as jest.Mock).mockResolvedValue(transaction);
      req.params = { id: '1' };
      req.body = { description: 'Updated Test', amount: 200, currency: 'EUR' };
      await updateTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Transaction updated successfully!' }));
    });

    it('should handle errors properly', async () => {
      (mockPrisma.transaction.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrisma.transaction.update as jest.Mock).mockRejectedValue(new Error('Database error'));
      req.params = { id: '1' };
      req.body = { description: 'Updated Test', amount: 200, currency: 'EUR' };
      await updateTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update transaction.', details: 'Database error' });
    });

    it('should return 400 if required fields are missing', async () => {
      req.params = { id: '1' };
      req.body = {};
      await updateTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields.' });
    });
  });

  describe('deleteTransaction', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = { params: {}, query: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
    });

    it('should return 400 if transaction ID is missing', async () => {
      await deleteTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing transaction ID.' });
    });

    it('should delete transaction and return 204 on success', async () => {
      req.params = { id: '1' };
      req.query = { hard: 'true' };
      await deleteTransaction(req as Request, res as Response);
      expect(mockPrisma.transaction.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should mark transaction as deleted and return 204 on success', async () => {
      req.params = { id: '1' };
      await deleteTransaction(req as Request, res as Response);
      expect(mockPrisma.transaction.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      (mockPrisma.transaction.update as jest.Mock).mockRejectedValue(new Error('Database error'));
      req.params = { id: '1' };
      await deleteTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete transaction.', details: 'Database error' });
    });

    it('should handle invalid transaction ID', async () => {
      req.params = { id: 'invalid' };
      await deleteTransaction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid transaction ID.' });
    });
  });
});