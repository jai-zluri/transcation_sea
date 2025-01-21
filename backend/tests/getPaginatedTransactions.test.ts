
import { getPaginatedTransactions } from '../src/services/transactionService';

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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


  it('should fetch paginated transactions', async () => {
    // Mock query parameters
    req.query = { page: '1', limit: '2' };

    // Mock database response
    const mockTransactions = [
      { id: 1, description: 'Transaction 1', amount: 100, date: '2025-01-10', currency: 'USD' },
      { id: 2, description: 'Transaction 2', amount: 200, date: '2025-01-11', currency: 'USD' },
    ];
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);
    (prisma.transaction.count as jest.Mock).mockResolvedValue(5);

    // Call the service
    await getPaginatedTransactions(req as Request, res as Response);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({
      transactions: mockTransactions, // Returning detailed transactions instead of just IDs
      totalCount: 5,
    });
  });

  it('should handle errors while fetching paginated transactions', async () => {
    (prisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getPaginatedTransactions(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
  });
});