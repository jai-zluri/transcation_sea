import { validation } from '../src/utils/validation';

describe('validation', () => {
  describe('isValidDate', () => {
    test('accepts dates within range', () => {
      expect(validation.isValidDate('1980-01-01')).toBe(true);
      expect(validation.isValidDate('2030-12-31')).toBe(true);
    });

    test('rejects dates outside range', () => {
      expect(validation.isValidDate('1979-12-31')).toBe(false);
      expect(validation.isValidDate('2031-01-01')).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    test('accepts valid amounts', () => {
      expect(validation.isValidAmount(10.00)).toBe(true);
      expect(validation.isValidAmount(0.01)).toBe(true);
    });

    test('rejects invalid amounts', () => {
      expect(validation.isValidAmount(0)).toBe(false);
      expect(validation.isValidAmount(-10)).toBe(false);
      expect(validation.isValidAmount(10.001)).toBe(false);
    });
  });

  describe('isValidDescription', () => {
    test('accepts valid descriptions', () => {
      expect(validation.isValidDescription('Valid Description')).toBe(true);
      expect(validation.isValidDescription('a Valid 123 Description')).toBe(true);
    });

    test('rejects invalid descriptions', () => {
      expect(validation.isValidDescription('')).toBe(false);
      expect(validation.isValidDescription('a')).toBe(false);
      expect(validation.isValidDescription('!Invalid Start')).toBe(false);
    });
  });

  describe('validateTransaction', () => {
    const validTransaction = {
      date: '2023-05-15',
      description: 'Valid Transaction',
      amount: 100.00
    };

    test('validates correct transaction', () => {
      const result = validation.validateTransaction(validTransaction);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('invalidates transaction with errors', () => {
      const invalidTransaction = {
        date: '2031-01-01',
        description: '',
        amount: 0
      };

      const result = validation.validateTransaction(invalidTransaction);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('isDuplicateTransaction', () => {
    const existingTransactions = [
      {
        id: 1,
        date: '2023-05-15',
        description: 'Existing Transaction',
        amount: 100,
        currency: 'USD'
      }
    ];

    test('detects duplicate transaction', () => {
      const duplicateTransaction = {
        date: '2023-05-15',
        description: 'Existing Transaction',
        amount: 100,
        currency: 'USD'
      };

      expect(validation.isDuplicateTransaction(
        duplicateTransaction, 
        existingTransactions
      )).toBe(true);
    });

    test('allows transaction with different details', () => {
      const uniqueTransaction = {
        date: '2023-05-16',
        description: 'Different Transaction',
        amount: 200,
        currency: 'EUR'
      };

      expect(validation.isDuplicateTransaction(
        uniqueTransaction, 
        existingTransactions
      )).toBe(false);
    });
  });
});