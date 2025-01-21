interface CurrencyConfig {
    symbol: string;
    rate: number;
  }
  
  interface CurrencyFormatConfig {
    [key: string]: CurrencyConfig;
  }
  
  const formatConfig: CurrencyFormatConfig = {
    USD: {
      symbol: '$',
      rate: 1,
    },
    INR: {
      symbol: '₹',
      rate: 80,
    }
  };
  
  export const formatters = {
    formatDate: (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
       year: 'numeric',
       
      });
    },
  
    formatCurrency: (amount: number, currency: string = 'USD'): string => {
      const config = formatConfig[currency] || formatConfig.USD;
      const value = (amount * config.rate).toFixed(2);
      return `${config.symbol} ${value}`;
    }
  };