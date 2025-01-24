import { currencyUtils } from '../src/utils/currency';

describe('currencyUtils', () => {
  test('currencies array contains expected currencies', () => {
    expect(currencyUtils.currencies).toHaveLength(6);
    expect(currencyUtils.currencies.map(c => c.code)).toEqual(
      expect.arrayContaining(['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD'])
    );
  });

  test('getSymbol returns correct currency symbol', () => {
    expect(currencyUtils.getSymbol('USD')).toBe('$');
    expect(currencyUtils.getSymbol('EUR')).toBe('€');
    expect(currencyUtils.getSymbol('XYZ')).toBe('XYZ');
  });

  test('convertToINR converts currencies correctly', () => {
    expect(currencyUtils.convertToINR(100, 'USD')).toBe(8350.00);
    expect(currencyUtils.convertToINR(100, 'EUR')).toBe(9020.00);
  });

  test('convertToINR throws error for unsupported currency', () => {
    expect(() => currencyUtils.convertToINR(100, 'ABC')).toThrow('Unsupported currency: ABC');
  });
});