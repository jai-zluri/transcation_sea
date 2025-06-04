import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import Decimal from 'decimal.js'

async function addTransaction() {
  try {
   
    const newTransaction = await prisma.transaction.create({
        data: {
          date: new Date('2025-01-20'),
          description: 'Test Transaction',
          amount: 100.50,  
          currency: 'USD',
        },
      });
      
    console.log('Transaction added:', newTransaction);
  } catch (err) {
    console.error('Error inserting transaction:', err);
  }
}

addTransaction();
