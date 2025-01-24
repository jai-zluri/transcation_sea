//api.test.ts
import axios from 'axios';
import { transactionService } from '../src/services/api';
import { currencyUtils } from '../src/utils/currency';
import { formatters } from '../src/utils/formatters';

jest.mock('axios');
jest.mock('../utils/currency');
jest.mock('../utils/formatters');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCurrencyUtils = currencyUtils as jest.Mocked<typeof currencyUtils>;
const mockedFormatters = formatters as jest.Mocked<typeof formatters>;

describe('transactionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPaginatedTransactions', () => {
    it('should fetch paginated transactions successfully', async () => {
      const mockData = { data: { items: [], total: 0, page: 1, limit: 25 } };
      mockedAxios.get.mockResolvedValue(mockData);

      const result = await transactionService.getPaginatedTransactions(1, 25);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/transactions/transactions/paginated',
        { params: { page: 1, limit: 25 } }
      );
      expect(result).toEqual(mockData.data);
    });

    it('should throw an error when fetching paginated transactions fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(transactionService.getPaginatedTransactions(1, 25)).rejects.toThrow('Network error');
    });
  });

  describe('getAllTransactions', () => {
    it('should fetch all transactions successfully', async () => {
      const mockData = { data: [] };
      mockedAxios.get.mockResolvedValue(mockData);

      const result = await transactionService.getAllTransactions();

      expect(mockedAxios.get).toHaveBeenCalledWith('/transactions/transactions');
      expect(result).toEqual(mockData.data);
    });

    it('should throw an error when fetching all transactions fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(transactionService.getAllTransactions()).rejects.toThrow('Network error');
    });
  });

//   describe('addTransaction', () => {
//     it('should add a transaction successfully', async () => {
//       mockedCurrencyUtils.convertToINR.mockReturnValue(100);
//       const mockData = { data: { success: true } };
//       mockedAxios.post.mockResolvedValue(mockData);

//       const transactionData = { amount: 10, currency: 'USD', description: 'Test transaction' };

//       const result = await transactionService.addTransaction(transactionData);

//       expect(mockedCurrencyUtils.convertToINR).toHaveBeenCalledWith(10, 'USD');
//       expect(mockedAxios.post).toHaveBeenCalledWith('/transactions/transactions', {
//         ...transactionData,
//         amountInINR: 100,
//       });
//       expect(result).toEqual(mockData.data);
//     });

describe('addTransaction', () => {
    it('should add a transaction successfully', async () => {
      mockedCurrencyUtils.convertToINR.mockReturnValue(100);
      const mockData = { data: { success: true } };
      mockedAxios.post.mockResolvedValue(mockData);

      const transactionData = {
        date: '2023-01-01', // Add date as a string
        amount: 10,
        currency: 'USD',
        description: 'Test transaction',
      };

      const result = await transactionService.addTransaction(transactionData);

      expect(mockedCurrencyUtils.convertToINR).toHaveBeenCalledWith(10, 'USD');
      expect(mockedAxios.post).toHaveBeenCalledWith('/transactions/transactions', {
        ...transactionData,
        amountInINR: 100,
      });
      expect(result).toEqual(mockData.data);
    });

    it('should throw an error when adding a transaction fails', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Network error'));
  
        const transactionData = {
          date: '2023-01-01', // Add date as a string
          amount: 10,
          currency: 'USD',
          description: 'Test transaction',
        };
  
        await expect(transactionService.addTransaction(transactionData)).rejects.toThrow('Network error');
      });
    });
  describe('updateTransaction', () => {
    it('should update a transaction successfully', async () => {
      mockedCurrencyUtils.convertToINR.mockReturnValue(200);
      const mockData = { data: { success: true } };
      mockedAxios.put.mockResolvedValue(mockData);

      const result = await transactionService.updateTransaction(1, {
        amount: 20,
        currency: 'EUR',
      });

      expect(mockedCurrencyUtils.convertToINR).toHaveBeenCalledWith(20, 'EUR');
      expect(mockedAxios.put).toHaveBeenCalledWith('/transactions/transactions/1', {
        amount: 20,
        currency: 'EUR',
        amountInINR: 200,
      });
      expect(result).toEqual(mockData.data);
    });

    it('should throw an error when updating a transaction fails', async () => {
      mockedAxios.put.mockRejectedValue(new Error('Network error'));

      await expect(
        transactionService.updateTransaction(1, { amount: 20, currency: 'EUR' })
      ).rejects.toThrow('Network error');
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction successfully', async () => {
      const mockData = { data: { success: true } };
      mockedAxios.delete.mockResolvedValue(mockData);

      const result = await transactionService.deleteTransaction(1);

      expect(mockedAxios.delete).toHaveBeenCalledWith('/transactions/transactions/1');
      expect(result).toEqual(mockData.data);
    });

    it('should throw an error when deleting a transaction fails', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Network error'));

      await expect(transactionService.deleteTransaction(1)).rejects.toThrow('Network error');
    });
  });

  describe('uploadCSV', () => {
    it('should upload a CSV file successfully', async () => {
      const mockData = { data: { success: true } };
      mockedAxios.post.mockResolvedValue(mockData);

      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      const result = await transactionService.uploadCSV(file);

      expect(mockedAxios.post).toHaveBeenCalledWith('/transactions/upload', expect.any(FormData), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      expect(result).toEqual(mockData.data);
    });

    it('should throw an error when uploading a CSV file fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      await expect(transactionService.uploadCSV(file)).rejects.toThrow('Network error');
    });
  });

  describe('downloadDuplicates', () => {
    it('should generate and download a CSV for duplicate transactions', () => {
      mockedFormatters.formatDate.mockImplementation((date) => date.toString());
      mockedCurrencyUtils.convertToINR.mockImplementation((amount, currency) => amount * 10);

      const duplicates = [
        {
          date: '2023-01-01', // Use string instead of Date
          description: 'Test 1',
          amount: 10,
          currency: 'USD',
        },
      ];

      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      transactionService.downloadDuplicates(duplicates);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });
  });
});
