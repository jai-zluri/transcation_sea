import fs from 'fs';
import { parseCSV, Transaction } from '../src/utils/csvParser';
import csv from 'csv-parser';

jest.mock('fs');
jest.mock('csv-parser', () => jest.fn());

describe('CSV Parser', () => {
  const mockFilePath = '/path/to/mock-file.csv';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse valid CSV data successfully', async () => {
    // Mock data
    const mockData = [
      { date: '2025-01-15', description: 'Test 1', amount: '100.5', category: 'Food' },
      { date: '2025-01-16', description: 'Test 2', amount: '200.75', category: 'Travel' },
    ];

    // Mock the file stream and CSV parser behavior
    (fs.createReadStream as jest.Mock).mockReturnValueOnce({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          mockData.forEach((row) => callback(row));
        }
        if (event === 'end') callback();
        return this;
      }),
    });

    const transactions = await parseCSV(mockFilePath);

    expect(transactions).toEqual([
      { date: '2025-01-15', description: 'Test 1', amount: 100.5, category: 'Food' },
      { date: '2025-01-16', description: 'Test 2', amount: 200.75, category: 'Travel' },
    ]);
  });

  it('should handle errors during file reading (Error instance)', async () => {
    // Mock an error during file reading
    const mockError = new Error('File read error');
    (fs.createReadStream as jest.Mock).mockReturnValueOnce({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'error') callback(mockError);
        return this;
      }),
    });

    await expect(parseCSV(mockFilePath)).rejects.toThrow('File read error');
  });

  it('should handle errors during file reading (non-Error instance)', async () => {
    // Mock a non-Error instance during file reading
    const mockError = 'Non-error string';
    (fs.createReadStream as jest.Mock).mockReturnValueOnce({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'error') callback(mockError);
        return this;
      }),
    });

    await expect(parseCSV(mockFilePath)).rejects.toThrow('Non-error string');
  });

  it('should parse rows with missing optional fields gracefully', async () => {
    // Mock data with missing optional fields
    const mockData = [
      { date: '2025-01-15', description: 'Test 1', amount: '100.5' }, // No category
    ];

    (fs.createReadStream as jest.Mock).mockReturnValueOnce({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          mockData.forEach((row) => callback(row));
        }
        if (event === 'end') callback();
        return this;
      }),
    });

    const transactions = await parseCSV(mockFilePath);

    expect(transactions).toEqual([
      { date: '2025-01-15', description: 'Test 1', amount: 100.5, category: null },
    ]);
  });
});

