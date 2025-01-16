import { updateTransaction } from '../src/services/transactionService';
import prisma from '../src/prisma/client';
import { Request, Response } from 'express';



describe('updateTransaction', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should update a transaction', async () => {
    req.params = { id: '1' };
    req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
    (prisma.transaction.update as jest.Mock).mockResolvedValue(req.body);

    await updateTransaction(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should handle errors while updating a transaction', async () => {
    (prisma.transaction.update as jest.Mock).mockRejectedValue(new Error('Database error'));

    await updateTransaction(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update transaction.', details: 'Database error' });
  });
});
