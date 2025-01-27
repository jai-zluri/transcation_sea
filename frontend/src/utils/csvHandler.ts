import { Transaction } from '../types/index';
import { currencyUtils } from './currency';

export const csvHandler = {
  parseCSV: (
    fileContent: string
  ): {
    validTransactions: Omit<Transaction, 'id'>[];
    errors: string[];
  } => {
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      return {
        validTransactions: [],
        errors: [],
      };
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const validTransactions: Omit<Transaction, 'id'>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());

      const transaction = {
        date: values[headers.indexOf('date')] || '',
        description: values[headers.indexOf('description')] || '',
        amount: parseFloat(values[headers.indexOf('amount')]) || 0,
        currency: values[headers.indexOf('currency')] || 'USD',
      };

      validTransactions.push({
        ...transaction,
        amountInINR: currencyUtils.convertToINR(transaction.amount, transaction.currency),
      });
    }

    return { validTransactions, errors: [] };
  },
};