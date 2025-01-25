

// import { Transaction } from '../types/index';
// import { validation } from './validation';
// import { currencyUtils } from './currency';

// export const csvHandler = {
//   parseCSV: (
//     fileContent: string,
//     globalSeen: Set<string>
//   ): {
//     validTransactions: Omit<Transaction, 'id'>[];
//     duplicates: Omit<Transaction, 'id'>[];
//     errors: string[];
//   } => {
//     const lines = fileContent.split('\n');
//     const headers = lines[0].split(',').map(h => h.trim());
//     const validTransactions: Omit<Transaction, 'id'>[] = [];
//     const duplicates: Omit<Transaction, 'id'>[] = [];
//     const errors: string[] = [];
//     const seen = globalSeen || new Set<string>();

//     for (let i = 1; i < lines.length; i++) {
//       const line = lines[i].trim();
//       if (!line) continue;

//       const values = line.split(',').map(v => v.trim());
//       const transaction = {
//         date: values[headers.indexOf('date')],
//         description: values[headers.indexOf('description')],
//         amount: parseFloat(values[headers.indexOf('amount')]),
//         currency: values[headers.indexOf('currency')] || 'USD',
//       };

//       const validationResult = validation.validateTransaction(transaction);
//       if (!validationResult.isValid) {
//         errors.push(`Row ${i + 1}: ${validationResult.errors.join(', ')}`);
//         continue;
//       }

//       const transactionKey = `${transaction.date}-${transaction.description}-${transaction.amount}-${transaction.currency}`;
//       if (seen.has(transactionKey)) {
//         duplicates.push(transaction);
//         continue;
//       }

//       seen.add(transactionKey);
//       validTransactions.push({
//         ...transaction,
//         amountInINR: currencyUtils.convertToINR(transaction.amount, transaction.currency),
//       });
//     }

//     return { validTransactions, duplicates, errors };
//   },
// };


import { Transaction } from '../types/index';
import { validation } from './validation';
import { currencyUtils } from './currency';
export const csvHandler = {
  parseCSV: (
    fileContent: string,
    globalSeen: Set<string>
  ): {
    validTransactions: Omit<Transaction, 'id'>[];
    duplicates: Omit<Transaction, 'id'>[];
    errors: string[];
  } => {
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      return {
        validTransactions: [],
        duplicates: [],
        errors: ['CSV must have at least a header and one data row.'],
      };
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const validTransactions: Omit<Transaction, 'id'>[] = [];
    const duplicates: Omit<Transaction, 'id'>[] = [];
    const errors: string[] = [];
    const seen = globalSeen || new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count does not match headers.`);
        continue;
      }

      const transaction = {
        date: values[headers.indexOf('date')] || '',
        description: values[headers.indexOf('description')] || '',
        amount: parseFloat(values[headers.indexOf('amount')]) || NaN,
        currency: values[headers.indexOf('currency')] || 'USD',
      };

      const validationResult = validation.validateTransaction(transaction);
      if (!validationResult.isValid) {
        errors.push(`Row ${i + 1}: ${validationResult.errors.join(', ')}`);
        continue;
      }

      const transactionKey = `${transaction.date}-${transaction.description}-${transaction.amount}-${transaction.currency}`;
      if (seen.has(transactionKey)) {
        duplicates.push(transaction);
        continue;
      }

      seen.add(transactionKey);
      validTransactions.push({
        ...transaction,
        amountInINR: currencyUtils.convertToINR(transaction.amount, transaction.currency),
      });
    }

    return { validTransactions, duplicates, errors };
  },
};
