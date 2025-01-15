
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Database Connection', () => {
  beforeAll(async () => {
    // Attempt to connect to the database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Disconnect from the database after tests
    await prisma.$disconnect();
  });

  it('should connect to the database', async () => {
    const transactionCount = await prisma.transaction.count();
    expect(transactionCount).toBeGreaterThanOrEqual(0); // Expect at least 0 transactions
  });

  it('should retrieve a list of transactions', async () => {
    const transactions = await prisma.transaction.findMany();
    expect(Array.isArray(transactions)).toBe(true);
  });

  it('should handle empty transactions gracefully', async () => {
    const transactions = await prisma.transaction.findMany({
      where: { description: 'Non-existent Transaction' },
    });
    expect(transactions).toEqual([]); // Expect an empty array for no matches
  });

  it('should create a new transaction', async () => {
    const newTransaction = await prisma.transaction.create({
      data: {
        date: new Date().toISOString(),
        description: 'Test Transaction',
        amount: 100,
        currency: 'USD',
      },
    });

    expect(newTransaction).toHaveProperty('id');
    expect(newTransaction.description).toBe('Test Transaction');
  });

  it('should update an existing transaction', async () => {
    const transactionToUpdate = await prisma.transaction.create({
      data: {
        date: new Date().toISOString(),
        description: 'Transaction to Update',
        amount: 50,
        currency: 'USD',
      },
    });

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionToUpdate.id },
      data: { description: 'Updated Transaction' },
    });

    expect(updatedTransaction.description).toBe('Updated Transaction');
  });

  it('should delete a transaction', async () => {
    const transactionToDelete = await prisma.transaction.create({
      data: {
        date: new Date().toISOString(),
        description: 'Transaction to Delete',
        amount: 25,
        currency: 'USD',
      },
    });

    await prisma.transaction.delete({
      where: { id: transactionToDelete.id },
    });

    const deletedTransaction = await prisma.transaction.findUnique({
      where: { id: transactionToDelete.id },
    });

    expect(deletedTransaction).toBeNull();
  });

  it('should handle database disconnection gracefully', async () => {
    await prisma.$disconnect();
    await expect(prisma.transaction.findMany()).rejects.toThrow();
    await prisma.$connect(); // Reconnect for subsequent tests
  });

  it('should handle invalid query gracefully', async () => {
    await expect(
      prisma.transaction.findUnique({ where: { id: -1 } }) // Invalid ID
    ).resolves.toBeNull();
  });

  it('should retrieve transactions with pagination', async () => {
    const transactions = await prisma.transaction.findMany({
      skip: 0,
      take: 5, // Fetch first 5 transactions
    });

    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeLessThanOrEqual(5);
  });

  it('should check if a specific field exists in a transaction', async () => {
    const transaction = await prisma.transaction.findFirst();
    if (transaction) {
      expect(transaction).toHaveProperty('description');
    } else {
      expect(transaction).toBeNull(); // No transactions in the database
    }
  });
});
