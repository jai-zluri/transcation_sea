import * as transactionService from '../src/services/transactionService';

import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


jest.mock('../../src/prisma/client');
jest.mock('fs');
jest.mock('csv-parser');

describe('Transaction Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process CSV file', async () => {
    const mockReadStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'data') {
          callback({ date: '2023-01-01', description: 'Test', amount: '100', currency: 'USD' });
        }
        if (event === 'end') {
          callback();
        }
        return mockReadStream;
      }),
    };
    (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);
    (csv as unknown as jest.Mock).mockReturnValue({});

    const result = await transactionService.processCsvFileService('test.csv');

    expect(result).toEqual(expect.objectContaining({
      transactions: expect.any(Array),
      processedTransactions: expect.any(Array),
      isEmpty: false,
      malformedRows: 0,
      duplicateCount: 0,
    }));
  });

  it('should save transactions', async () => {
    const mockTransactions = [{ date: '2023-01-01', description: 'Test', amount: 100, currency: 'USD' }];
    (prisma.transaction.createMany as jest.Mock).mockResolvedValue({ count: 1 });

    await transactionService.saveTransactions(mockTransactions);

    expect(prisma.transaction.createMany).toHaveBeenCalledWith({ data: mockTransactions });
  });

  it('should generate output file', () => {
    const mockWriteStream = {
      write: jest.fn(),
      end: jest.fn(),
    };
    (fs.createWriteStream as jest.Mock).mockReturnValue(mockWriteStream);

    transactionService.generateOutputFile([{ date: '2023-01-01', description: 'Test', amount: 100, currency: 'USD' }], 'output.csv');

    expect(fs.createWriteStream).toHaveBeenCalledWith('output.csv');
    expect(mockWriteStream.write).toHaveBeenCalled();
    expect(mockWriteStream.end).toHaveBeenCalled();
  });

  it('should get transactions', async () => {
    const mockTransactions = [{ id: 1, date: '2023-01-01', description: 'Test', amount: 100, currency: 'USD' }];
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

    const result = await transactionService.getTransactionsService();

    expect(result).toEqual(mockTransactions);
  });

  it('should get paginated transactions', async () => {
    const mockTransactions = [{ id: 1, date: '2023-01-01', description: 'Test', amount: 100, currency: 'USD' }];
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);
    (prisma.transaction.count as jest.Mock).mockResolvedValue(1);

    const result = await transactionService.getPaginatedTransactionsService({ page: 1, pageSize: 10 });

    expect(result).toEqual({
        transactions: mockTransactions,
        total: 1,
        page: 1,
        pageSize: 10,
    });
});