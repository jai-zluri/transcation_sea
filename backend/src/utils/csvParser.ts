
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

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return reject(new Error('File not found')); // Adjusted for test expectation
    }

    // Check file size (if file exceeds 10MB, reject)
    const fileSize = fs.statSync(filePath).size;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (fileSize > MAX_FILE_SIZE) {
      return reject(new Error('File size exceeds the 10MB limit'));
    }

    // Start reading the file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const { date, description, amount, category } = row;

        // Check for missing or invalid required fields
        if (!date || !description || !amount || isNaN(parseFloat(amount))) {
          return reject(new Error('Invalid or missing required fields'));
        }

        // Create the transaction object
        const transaction: Transaction = {
          date: date.trim(),
          description: description.trim(),
          amount: parseFloat(amount),
          category: category ? category.trim() : undefined, // category is optional
        };

        transactions.push(transaction);
      })
      .on('end', () => resolve(transactions))
      .on('error', (error) => {
        // Handle errors during CSV parsing
        reject(new Error('File read error: ' + error.message)); // Adjusted error message
      });
  });
};
