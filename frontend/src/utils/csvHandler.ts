// utils/csvHandler.ts
import { Transaction } from '../types';
import { validation } from './validation';
import { currencyUtils } from './currency';

export const csvHandler = {
  parseCSV: (fileContent: string): { 
    validTransactions: Omit<Transaction, 'id'>[],
    duplicates: Omit<Transaction, 'id'>[],
    errors: string[]
  } => {
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const validTransactions: Omit<Transaction, 'id'>[] = [];
    const duplicates: Omit<Transaction, 'id'>[] = [];
    const errors: string[] = [];
    const seen = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      const transaction = {
        date: values[headers.indexOf('date')],
        description: values[headers.indexOf('description')],
        amount: parseFloat(values[headers.indexOf('amount')]),
        currency: values[headers.indexOf('currency')] || 'USD'
      };

      // Validate transaction
      const validationResult = validation.validateTransaction(transaction);
      if (!validationResult.isValid) {
        errors.push(`Row ${i}: ${validationResult.errors.join(', ')}`);
        continue;
      }

      // Check for duplicates
      const transactionKey = `${transaction.date}-${transaction.description}-${transaction.amount}-${transaction.currency}`;
      if (seen.has(transactionKey)) {
        duplicates.push(transaction);
        continue;
      }

      seen.add(transactionKey);
      validTransactions.push({
        ...transaction,
        amountInINR: currencyUtils.convertToINR(transaction.amount, transaction.currency)
      });
    }

    return { validTransactions, duplicates, errors };
  },

  generateCSV: (transactions: Transaction[]): string => {
    const headers = ['Date', 'Description', 'Amount', 'Currency', 'Amount (INR)'];
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.amount.toString(),
      t.currency,
      (t.amountInINR || 0).toString()
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  },

  downloadCSV: (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};