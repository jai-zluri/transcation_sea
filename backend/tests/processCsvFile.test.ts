
import fs from 'fs';
import { parseCSV, Transaction } from '../src/utils/csvParser';
import mockfs from 'mock-fs'; // Import mockfs to mock file system

jest.mock('fs');
jest.mock('csv-parser', () => jest.fn());

describe('CSV Parser', () => {
  const mockFilePath = '/path/to/mock-file.csv'; // You can use any mock path
  const mockInvalidFilePath = '/path/to/invalid-file.csv'; // Invalid file path for error tests

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks

    // Mock the file system before each test to simulate file existence and contents
    mockfs({
      'valid.csv': 'date,description,amount,category\n2025-01-15,Test 1,100.5,Food\n2025-01-16,Test 2,200.75,Travel',
      'csv_with_missing_fields.csv': 'date,description,amount\n2025-01-15,Test 1,100.5', // Missing category
      'large.csv': '', // Simulate large file (or mock an empty file)
    });
  });

  afterEach(() => {
    mockfs.restore(); // Clean up mocked file system after each test
  });

  it('should parse valid CSV data successfully', async () => {
    // Mock valid data in the file
    const mockData = [
      { date: '2025-01-15', description: 'Test 1', amount: '100.5', category: 'Food' },
      { date: '2025-01-16', description: 'Test 2', amount: '200.75', category: 'Travel' },
    ];

    // Mock the file stream and CSV parser behavior
    (fs.createReadStream as jest.Mock).mockReturnValueOnce({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          mockData.forEach((row) => callback(row)); // Mock CSV rows being read
        }
        if (event === 'end') callback();
        return this;
      }),
    });

    const transactions = await parseCSV('valid.csv'); // Use the mocked file path

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
        if (event === 'error') callback(mockError); // Trigger the error event
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
        if (event === 'error') callback(mockError); // Trigger non-Error event
        return this;
      }),
    });

    await expect(parseCSV(mockFilePath)).rejects.toThrow('Non-error string');
  });

  it('should reject if file does not exist', async () => {
    const invalidFilePath = 'invalid.csv'; // Path that doesn’t exist in mockfs
    await expect(parseCSV(invalidFilePath)).rejects.toThrow('File not found');
  });

  it('should parse rows with missing optional fields gracefully', async () => {
    // Mock data with missing optional fields (category)
    const mockData = [
      { date: '2025-01-15', description: 'Test 1', amount: '100.5' }, // No category
    ];

    (fs.createReadStream as jest.Mock).mockReturnValueOnce({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          mockData.forEach((row) => callback(row)); // Send mock data
        }
        if (event === 'end') callback();
        return this;
      }),
    });

    const transactions = await parseCSV('csv_with_missing_fields.csv');

    expect(transactions).toEqual([
      { date: '2025-01-15', description: 'Test 1', amount: 100.5, category: null }, // Handle missing category gracefully
    ]);
  });

  it('should handle file size limit (10MB)', async () => {
    // Mocking large file to simulate file size rejection (optional, if your function handles file size)
    const largeFilePath = 'large.csv';
    await expect(parseCSV(largeFilePath)).rejects.toThrow('File size exceeds the 10MB limit');
  });
});
