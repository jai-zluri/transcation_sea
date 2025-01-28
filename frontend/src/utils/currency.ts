import { toast } from 'react-hot-toast'; // Import the toast function

export const currencyUtils = {
  currencies: [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'SSD', symbol: '£', name: 'South Sudanese Pound' },
    { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
  ],

  // Mock conversion rates (in production, these should come from an API)
  conversionRates: {
    USD: 83.5,
    EUR: 90.2,
    GBP: 105.8,
    INR: 1,
    JPY: 0.56,
    AUD: 54.3,
    MYR: 3.45,
    SSD: 15.2,
    SGD: 0.68,
  },

  getSymbol: (currencyCode: string): string => {
    const currency = currencyUtils.currencies.find((c) => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  },

  convertToINR: (amount: number, fromCurrency: string): number => {
    const rate = currencyUtils.conversionRates[fromCurrency as keyof typeof currencyUtils.conversionRates];
    if (!rate) {
     // toast.error(`Unsupported currency: ${fromCurrency}`); // Show toast notification for unsupported currency
      return amount; // Return the amount as is if the currency is unsupported
    }
    return Number((amount * rate).toFixed(2));
  },
};