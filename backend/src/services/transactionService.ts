

import fs from 'fs';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

const processCSVRow = (row: any, transactionSet: Set<string>, transactions: any[], processedTransactions: any[]) => {
  let malformedRows = false;
  let duplicateCount = 0;

  const date = row.Date?.trim();
  const description = row.Description?.trim();
  const amount = parseFloat(row.Amount?.trim());

  if (date) {
    const [day, month, year] = date.split('-');
    if (day && month && year) {
      const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
      if (isNaN(formattedDate.getTime())) {
        malformedRows = true;
        processedTransactions.push({ ...row, Status: 'Malformed' });
      } else {
        const transactionKey = `${formattedDate.toISOString()}|${description}|${amount}|${row.Currency || ''}`;
        if (transactionSet.has(transactionKey)) {
          duplicateCount++;
          processedTransactions.push({ ...row, Status: 'Duplicate' });
        } else {
          transactionSet.add(transactionKey);
          transactions.push({
            date: formattedDate,
            description,
            amount,
            currency: row.Currency || null,
          });
          processedTransactions.push({ ...row, Status: 'Non-Duplicate' });
        }
      }
    } else {
      malformedRows = true;
      processedTransactions.push({ ...row, Status: 'Malformed' });
    }
  }

  if (isNaN(amount)) {
    malformedRows = true;
    processedTransactions.push({ ...row, Status: 'Malformed' });
  }

  if (!date || !description || isNaN(amount)) {
    malformedRows = true;
    processedTransactions.push({ ...row, Status: 'Malformed' });
  }

  return { malformedRows, duplicateCount };
};

export const processCsvFileService = (filePath: string) => {
  return new Promise<{ transactions: any[], processedTransactions: any[], isEmpty: boolean, malformedRows: boolean, duplicateCount: number }>((resolve, reject) => {
    const transactions: any[] = [];
    const transactionSet = new Set<string>();
    const processedTransactions: any[] = [];
    let isEmpty = true;
    let malformedRows = false;
    let duplicateCount = 0;

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        isEmpty = false;
        const result = processCSVRow(row, transactionSet, transactions, processedTransactions);
        malformedRows = malformedRows || result.malformedRows;
        duplicateCount += result.duplicateCount;
      })
      .on('end', () => {
        resolve({ transactions, processedTransactions, isEmpty, malformedRows, duplicateCount });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export const saveTransactions = async (transactions: any[]) => {
  if (transactions.length) {
    await prisma.transaction.createMany({
      data: transactions,
      skipDuplicates: true,
    });
  }
};

export const generateOutputFile = (processedTransactions: any[], outputFilePath: string) => {
  const outputStream = fs.createWriteStream(outputFilePath);
  outputStream.write('Date,Description,Amount,Currency,Status\n');
  processedTransactions.forEach(transaction => {
    outputStream.write(`${transaction.Date},${transaction.Description},${transaction.Amount},${transaction.Currency},${transaction.Status}\n`);
  });
  outputStream.end();
};

export const getTransactionsService = async () => {
  return prisma.transaction.findMany({
    orderBy: {
      date: 'desc',
    },
  });
};

export const getPaginatedTransactionsService = async (offset: number, limit: number) => {
  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({ skip: offset, take: limit, orderBy: { date: 'desc' } }),
    prisma.transaction.count(),
  ]);
  return { transactions, totalCount };
};

export const addTransactionService = async (data: { date: string, description: string, amount: number, currency?: string }) => {
  const { date, description, amount, currency } = data;

  const parsedDate = new Date(date);
  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();

  if ((month === 2 && day < 1 || day > 29) || (month !== 2 && day < 1 || day > 31)) {
      throw new Error('Invalid date. Day should be between 1-29 for February or 1-31 for other months.');
  }

  // Check for existing transaction
  const existingTransaction = await prisma.transaction.findFirst({
      where: {
          date: parsedDate,
          description,
          amount: new Decimal(amount),
          currency,
      },
  });

  if (existingTransaction) {
      throw new Error('Transaction already exists');
  }

  return prisma.transaction.create({
      data: { date: parsedDate, description, amount, currency },
  });
};

export const updateTransactionService = async (id: number, data: { date: string, description: string, amount: number, currency?: string }) => {
  const existingTransaction = await prisma.transaction.findUnique({ where: { id } });

  if (!existingTransaction) {
    throw new Error('Transaction not found.');
  }

  const { date, description, amount, currency } = data;

  const duplicateTransaction = await prisma.transaction.findFirst({
    where: {
      date: new Date(date),
      description,
      amount: new Decimal(amount),
      currency,
      id: { not: id },
    },
  });

  if (duplicateTransaction) {
    throw new Error('A transaction with the same date, description, amount, and currency already exists.');
  }

  return prisma.transaction.update({
    where: { id },
    data: {
      date: new Date(date),
      description: description || existingTransaction.description,
      amount: amount ? new Decimal(amount) : existingTransaction.amount,
      currency: currency || existingTransaction.currency,
    },
  });
};

export const deleteTransactionService = async (id: number, isHardDelete: boolean) => {
  if (isHardDelete) {
    await prisma.transaction.delete({ where: { id } });
  } else {
    await prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
};