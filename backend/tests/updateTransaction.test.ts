


import { updateTransaction } from '../src/services/transactionService';

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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

  it('should update a transaction successfully', async () => {
    req.params = { id: '1' };
    req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
    
    // Mocking successful database update
    (prisma.transaction.update as jest.Mock).mockResolvedValue(req.body);

    await updateTransaction(req as Request, res as Response);

    // Ensure status is called with 200 and the updated data is returned
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should handle missing transaction id in request params', async () => {
    req.params = {};  // Missing transaction ID in params

    await updateTransaction(req as Request, res as Response);

    // Expecting a 400 response with an error message
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing transaction ID.' });
  });

  it('should return an error for invalid date (February 30th)', async () => {
    req.params = { id: '1' };
    req.body = { date: '2025-02-30', description: 'Updated', amount: 200.5, currency: 'EUR' };

    await updateTransaction(req as Request, res as Response);

    // Expecting a 400 response with an error message for invalid date
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
  });

  it('should return an error for invalid date (31st February)', async () => {
    req.params = { id: '1' };
    req.body = { date: '2025-02-31', description: 'Updated', amount: 200.5, currency: 'EUR' };

    await updateTransaction(req as Request, res as Response);

    // Expecting a 400 response with an error message for invalid date
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
  });

  it('should return an error for invalid date (April 31st)', async () => {
    req.params = { id: '1' };
    req.body = { date: '2025-04-31', description: 'Updated', amount: 200.5, currency: 'EUR' };

    await updateTransaction(req as Request, res as Response);

    // Expecting a 400 response with an error message for invalid date
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
  });

  it('should return an error for invalid date (Invalid month)', async () => {
    req.params = { id: '1' };
    req.body = { date: '2025-13-15', description: 'Updated', amount: 200.5, currency: 'EUR' };

    await updateTransaction(req as Request, res as Response);

    // Expecting a 400 response with an error message for invalid month
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
  });

  it('should handle errors while updating a transaction (Database error)', async () => {
    req.params = { id: '1' };
    req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };

    // Simulating a database error
    const mockError = new Error('Database error');
    (prisma.transaction.update as jest.Mock).mockRejectedValue(mockError);

    await updateTransaction(req as Request, res as Response);

    // Expecting a 500 response with the database error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update transaction.', details: 'Database error' });
  });

  it('should handle errors while updating a transaction (Non-Error instance)', async () => {
    req.params = { id: '1' };
    req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };

    // Simulating a non-Error instance (e.g., string message)
    const mockError = 'Database error';
    (prisma.transaction.update as jest.Mock).mockRejectedValue(mockError);

    await updateTransaction(req as Request, res as Response);

    // Expecting a 500 response with a generic error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred.' });
  });
});
