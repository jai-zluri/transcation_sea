// tests/dbConnection.test.ts

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
    // Check if the connection is established by querying a simple operation
    const transactionCount = await prisma.transaction.count();
    expect(transactionCount).toBeGreaterThanOrEqual(0); // Expect at least 0 transactions
  });
});
