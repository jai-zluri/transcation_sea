

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
  },
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
  },
  formatAmountWithCurrency(amount: number, currencyCode: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
};



// //utils/formatters.ts
// export const formatters = {
//     formatDate: (dateString: string): string => {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     },
  
//     formatCurrency: (amount: number, currency: string): string => {
//       const formatter = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: currency,
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//       });
//       return formatter.format(amount);
//     },
  
//     formatFileSize: (bytes: number): string => {
//       if (bytes === 0) return '0 Bytes';
//       const k = 1024;
//       const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//       const i = Math.floor(Math.log(bytes) / Math.log(k));
//       return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     }
//   };
