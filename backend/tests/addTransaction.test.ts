import { addTransaction } from '../src/services/transactionService';
import prisma from '../src/prisma/client';
import { Request, Response } from 'express';

jest.mock('../src/prisma/client');

describe('addTransaction', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mock calls after each test
  });

  it('should add a new transaction successfully', async () => {
    req.body = { date: '2025-01-15', description: 'Test Transaction', amount: 100.5, currency: 'USD' };
    const mockTransaction = { id: 1, ...req.body }; // Mock database response
    (prisma.transaction.create as jest.Mock).mockResolvedValue(mockTransaction);

    await addTransaction(req as Request, res as Response);

    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        date: new Date(req.body.date as string),
        description: req.body.description,
        amount: req.body.amount,
        currency: req.body.currency,
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTransaction);
  });

  it('should return 400 for missing required fields', async () => {
    req.body = { description: 'Test', amount: 100.5 }; // Missing 'date' and 'currency'

    await addTransaction(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields.' });
  });

  it('should handle database errors gracefully', async () => {
    req.body = { date: '2025-01-15', description: 'Error Transaction', amount: 100.5, currency: 'USD' };
    (prisma.transaction.create as jest.Mock).mockRejectedValue(new Error('Database error'));

    await addTransaction(req as Request, res as Response);

    expect(prisma.transaction.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to add transaction.',
      details: 'Database error',
    });
  });

  it('should handle unexpected errors gracefully', async () => {
    req.body = { date: '2025-01-15', description: 'Unexpected Error', amount: 100.5, currency: 'USD' };
    (prisma.transaction.create as jest.Mock).mockImplementation(() => {
      throw 'Unexpected error'; // Non-Error object
    });

    await addTransaction(req as Request, res as Response);

    expect(prisma.transaction.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An unexpected error occurred.',
    });
  });
});

  