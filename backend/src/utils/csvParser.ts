import fs from 'fs';
import csv from 'csv-parser';

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
}

// Function to parse CSV
export const parseCSV = (filePath: string): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const transactions: Transaction[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const transaction: Transaction = {
          date: row.date,
          description: row.description,
          amount: parseFloat(row.amount),
          category: row.category || null,
        };
        transactions.push(transaction);
      })
      .on('end', () => resolve(transactions))
      .on('error', (error) => reject(error));
  });
};
