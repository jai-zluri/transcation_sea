

import { addTransaction, deleteTransaction } from '../src/services/transactionService';

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


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

  // New test case: Add transaction after delete

it('should delete a transaction and add a new transaction successfully', async () => {
  const initialTransaction = { id: 1, date: '2025-01-15', description: 'Old Transaction', amount: 100.5, currency: 'USD' };
  const newTransaction = { date: '2025-01-16', description: 'New Transaction', amount: 200.75, currency: 'USD' };

  // Mock the database to return the initial transaction
  (prisma.transaction.findUnique as jest.Mock).mockResolvedValueOnce(initialTransaction);

  // Mock the delete operation
  (prisma.transaction.delete as jest.Mock).mockResolvedValueOnce(initialTransaction); // Assume delete is successful

  // Mock the add (create) operation for the new transaction
  const mockNewTransaction = { id: 2, ...newTransaction }; // New transaction mock response
  (prisma.transaction.create as jest.Mock).mockResolvedValueOnce(mockNewTransaction);

  // Step 1: Delete the transaction
  req.params = { id: '1' }; // Assuming the route for delete is '/transactions/:id'
  req.query = { hard: 'true' }; // Mocking the query parameter for 'hard'
  await deleteTransaction(req as Request, res as Response);
  expect(prisma.transaction.delete).toHaveBeenCalledWith({
    where: { id: 1 },
  });

  // Step 2: Add a new transaction after deletion (same details as initialTransaction)
  req.body = newTransaction; // Sending the new transaction data
  await addTransaction(req as Request, res as Response);

  // Assert that the new transaction is saved
  expect(prisma.transaction.create).toHaveBeenCalledWith({
    data: {
      date: new Date(req.body.date as string),
      description: req.body.description,
      amount: req.body.amount,
      currency: req.body.currency,
    },
  });
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(mockNewTransaction);
});
});