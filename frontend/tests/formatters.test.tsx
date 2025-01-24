import { formatters } from '../src/utils/formatters';

describe('formatters', () => {
  test('formatDate returns correctly formatted date', () => {
    const date = '2023-05-15T00:00:00Z';
    expect(formatters.formatDate(date)).toBe('15/05/2023');
  });

  test('formatCurrency handles different currencies', () => {
    expect(formatters.formatCurrency(100)).toBe('$ 100.00');
    expect(formatters.formatCurrency(100, 'INR')).toBe('₹ 8000.00');
  });

  test('formatAmountWithCurrency returns formatted currency', () => {
    expect(formatters.formatAmountWithCurrency(100, 'USD')).toMatch(/\$100\.00/);
    expect(formatters.formatAmountWithCurrency(100, 'EUR')).toMatch(/€100\.00/);
  });
});