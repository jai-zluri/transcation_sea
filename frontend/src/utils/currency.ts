// utils/currency.ts
export const currencyUtils = {
    currencies: [
      { code: 'USD', symbol: '$', name: 'US Dollar' },
      { code: 'EUR', symbol: '€', name: 'Euro' },
      { code: 'GBP', symbol: '£', name: 'British Pound' },
      { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
      { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
      { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
    ],
  
    // Mock conversion rates (in production, these should come from an API)
    conversionRates: {
      USD: 83.5,
      EUR: 90.2,
      GBP: 105.8,
      INR: 1,
      JPY: 0.56,
      AUD: 54.3
    },
    getSymbol: (currencyCode: string): string => {
        const currency = currencyUtils.currencies.find(c => c.code === currencyCode);
        return currency?.symbol || currencyCode;
      },
    convertToINR: (amount: number, fromCurrency: string): number => {
      const rate = currencyUtils.conversionRates[fromCurrency as keyof typeof currencyUtils.conversionRates];
      if (!rate) {
        throw new Error(`Unsupported currency: ${fromCurrency}`);
      }
      return Number((amount * rate).toFixed(2));
    },
  
  
  };