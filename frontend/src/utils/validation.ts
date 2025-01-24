
  
//   // utils/validation.ts
//   export const validation = {
//     isValidDate: (date: string): boolean => {
//       const inputDate = new Date(date);
//       const minDate = new Date('1980-01-01');
//       const maxDate = new Date('2030-12-31');
//       return inputDate >= minDate && inputDate <= maxDate && !isNaN(inputDate.getTime());
//     },
  
//     isValidAmount: (amount: number): boolean => {
//       const amountStr = amount.toString();
//       const decimalParts = amountStr.split('.');
//       const decimalPlaces = decimalParts[1]?.length || 0;
//       return amount > 0 && decimalPlaces <= 2;
//     },
  
//     isValidDescription: (description: string): boolean => {
//       // Must contain at least one letter and no special characters at start
//     //    return /[a-zA-Z]/.test(description) && description.trim().length > 0;
//       const containsLetter = /[a-zA-Z]/.test(description);
//       const startsWithSpecial = /^[^a-zA-Z0-9\s]/.test(description);
//       const validLength = description.length >= 3 && description.length <= 100;
//       return containsLetter && !startsWithSpecial && validLength;
//     },
  
//     validateTransaction: (transaction: any) => {
//       const errors: string[] = [];
  
//       if (!transaction.date || !validation.isValidDate(transaction.date)) {
//         errors.push('Date must be between Jan 1, 1980 and Dec 31, 2030');
//       }
  
//       if (!transaction.amount || !validation.isValidAmount(transaction.amount)) {
//         errors.push('Amount must be greater than 0 and have maximum 2 decimal places');
//       }
  
//       if (!transaction.description || !validation.isValidDescription(transaction.description)) {
//         errors.push('Description must contain letters and be 3-100 characters long');
//       }
  
//       return {
//         isValid: errors.length === 0,
//         errors
//       };
//     }
//   };



// utils/validation.ts
export const validation = {
    isValidDate: (date: string): boolean => {
      const inputDate = new Date(date);
      const minDate = new Date('1980-01-01');
      const maxDate = new Date('2030-12-31');
      return inputDate >= minDate && inputDate <= maxDate && !isNaN(inputDate.getTime());
    },
  
    isValidAmount: (amount: number): boolean => {
      const amountStr = amount.toString();
      const decimalParts = amountStr.split('.');
      const decimalPlaces = decimalParts[1]?.length || 0;
      return amount > 0 && decimalPlaces <= 2;
    },
  
    isValidDescription: (description: string): boolean => {
      // Must contain at least one letter and no special characters at start
      const containsLetter = /[a-zA-Z]/.test(description);
      const startsWithSpecial = /^[^a-zA-Z0-9\s]/.test(description);
      const validLength = description.length >= 3 && description.length <= 100;
      return containsLetter && !startsWithSpecial && validLength;
    },
  
    validateTransaction: (transaction: any) => {
      const errors: string[] = [];
  
      if (!transaction.date || !validation.isValidDate(transaction.date)) {
        errors.push('Date must be between Jan 1, 1980 and Dec 31, 2030');
      }
  
      if (!transaction.amount || !validation.isValidAmount(transaction.amount)) {
        errors.push('Amount must be greater than 0 and have maximum 2 decimal places');
      }
  
      if (!transaction.description || !validation.isValidDescription(transaction.description)) {
        errors.push('Description must contain letters and be 3-100 characters long');
      }
  
      return {
        isValid: errors.length === 0,
        errors,
      };
    },
  
    isDuplicateTransaction: (
      transaction: any,
      existingTransactions: any[],
      excludeId?: number
    ): boolean => {
      return existingTransactions.some(
        (t) =>
          t.id !== excludeId &&
          t.date === transaction.date &&
          t.amount === transaction.amount &&
          t.description.toLowerCase() === transaction.description.toLowerCase() &&
          t.currency === transaction.currency
      );
    },
  
    validateAndCheckDuplicate: (
      transaction: any,
      existingTransactions: any[],
      excludeId?: number
    ) => {
      const validationResult = validation.validateTransaction(transaction);
      const isDuplicate = validation.isDuplicateTransaction(
        transaction,
        existingTransactions,
        excludeId
      );
  
      if (isDuplicate) {
        validationResult.errors.push('Duplicate transaction detected');
      }
  
      return {
        ...validationResult,
        isDuplicate,
      };
    },
  };
  