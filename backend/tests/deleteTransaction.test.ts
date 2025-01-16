
import { deleteTransaction } from '../src/services/transactionService';
import prisma from '../src/prisma/client';
import { Request, Response } from 'express';

describe('deleteTransaction', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      query: {}  // Initialize req.query to avoid undefined error
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  it('should delete a transaction successfully (soft delete)', async () => {
    req.params = { id: '1' };
    req.query = { hard: 'false' };  // Soft delete flag
    (prisma.transaction.update as jest.Mock).mockResolvedValue({});

    await deleteTransaction(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should delete a transaction successfully (hard delete)', async () => {
    req.params = { id: '1' };
    req.query = { hard: 'true' };  // Hard delete flag
    (prisma.transaction.delete as jest.Mock).mockResolvedValue({});

    await deleteTransaction(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should handle missing transaction id in request params', async () => {
    req.params = {};  // No ID in params

    await deleteTransaction(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing transaction ID.' });
  });

  it('should handle missing "hard" query parameter (defaults to soft delete)', async () => {
    req.params = { id: '1' };
    req.query = {};  // Missing hard query parameter, should default to soft delete
    (prisma.transaction.update as jest.Mock).mockResolvedValue({});

    await deleteTransaction(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should handle errors while deleting a transaction (Database error)', async () => {
    req.params = { id: '1' };
    req.query = { hard: 'false' };  // Soft delete flag
    const mockError = new Error('Database error');
    (prisma.transaction.update as jest.Mock).mockRejectedValue(mockError);

    await deleteTransaction(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete transaction.', details: 'Database error' });
  });

  it('should handle errors while deleting a transaction (Non-Error instance)', async () => {
    req.params = { id: '1' };
    req.query = { hard: 'false' };  // Soft delete flag
    const mockError = 'Database error';  // Simulate non-Error instance
    (prisma.transaction.update as jest.Mock).mockRejectedValue(mockError);

    await deleteTransaction(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred.' });
  });
});
