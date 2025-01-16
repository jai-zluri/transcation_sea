
import { getPaginatedTransactions } from '../src/services/transactionService';
import prisma from '../src/prisma/client';
import { Request, Response } from 'express';

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
    req.query = { page: '1', limit: '2' };
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);
    (prisma.transaction.count as jest.Mock).mockResolvedValue(5);

    await getPaginatedTransactions(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ transactions: [{ id: 1 }, { id: 2 }], totalCount: 5 });
  });

  it('should handle errors while fetching paginated transactions', async () => {
    (prisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getPaginatedTransactions(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
  });
});