import { getTransactions } from '../src/services/transactionService';
import prisma from '../src/prisma/client';
import { Request, Response } from 'express';

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
  
    it('should fetch all transactions', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([{ id: 1, description: 'Test' }]);
  
      await getTransactions(req as Request, res as Response);
  
      expect(res.json).toHaveBeenCalledWith([{ id: 1, description: 'Test' }]);
    });
  
    it('should handle errors while fetching transactions', async () => {
      (prisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      await getTransactions(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
    });
  });