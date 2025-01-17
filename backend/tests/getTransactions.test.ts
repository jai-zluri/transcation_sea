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
      // Mock detailed transaction data
      const mockTransactions = [
        { id: 1, description: 'Transaction 1', amount: 100, date: '2025-01-10', currency: 'USD' },
        { id: 2, description: 'Transaction 2', amount: 200, date: '2025-01-11', currency: 'USD' },
      ];
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);
  
      await getTransactions(req as Request, res as Response);
  
      // Ensure the response contains the full transaction details
      expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });



    // Add test case for empty response- done
    it('should return an empty array when no transactions exist', async () => {
      // Mock an empty response from the database
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);
    
      await getTransactions(req as Request, res as Response);
    
      expect(res.json).toHaveBeenCalledWith([]); // Ensure it returns an empty array
    });
    
  
    it('should handle errors while fetching transactions', async () => {
      (prisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      await getTransactions(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
    });
  });