

// utils/validation.ts
export const validation = {
  formatDate: (date: string): string => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`; // Convert to dd/mm/yyyy
  },

  isValidDate: (date: string): boolean => {
    if (!date) return false; // Handle empty date
    const inputDate = new Date(date);
    const minDate = new Date('1980-01-01');
    const maxDate = new Date('2030-12-31');
    return !isNaN(inputDate.getTime()) && inputDate >= minDate && inputDate <= maxDate;
  },

  isValidAmount: (amount: number): boolean => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return false;
    }

    const amountStr = amount.toFixed(2); // Ensures only 2 decimal places
    return amount > 0 && /^\d+(\.\d{1,2})?$/.test(amountStr);
  },

  isValidDescription: (description: string): boolean => {
    if (typeof description !== 'string' || description.trim() === '') {
      return false;
    }

    // Must contain at least one letter, no special characters at start, and valid length
    const containsLetter = /[a-zA-Z]/.test(description);
    const startsWithSpecial = /^[^a-zA-Z0-9\s]/.test(description);
    const validLength = description.length >= 3 && description.length <= 100;
    return containsLetter && !startsWithSpecial && validLength;
  },

  validateTransaction: (transaction: any) => {
    const errors: string[] = [];

    if (!transaction.date || !validation.isValidDate(transaction.date)) {
      errors.push(
        `Invalid date. Ensure the date is between Jan 1, 1980, and Dec 31, 2030, and is in a valid format (e.g., YYYY-MM-DD).`
      );
    }

    if (
      transaction.amount === undefined ||
      transaction.amount === null ||
      !validation.isValidAmount(transaction.amount)
    ) {
      errors.push('Invalid amount. Must be a positive number with up to 2 decimal places.');
    }

    if (
      !transaction.description ||
      !validation.isValidDescription(transaction.description)
    ) {
      errors.push(
        'Invalid description. Must contain at least one letter, no special characters at the start, and be 3-100 characters long.'
      );
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
      validationResult.errors.push('Duplicate transaction detected.');
    }

    return {
      ...validationResult,
      isDuplicate,
    };
  },
};
