
import fs from 'fs';
import { parseCSV, Transaction } from '../src/utils/csvParser';
import mockfs from 'mock-fs'; // Default import for mock-fs

import request from 'supertest';
import { app } from '../src/index';

jest.mock('fs'); // Mock the fs module
jest.mock('csv-parser', () => jest.fn());
jest.mock('../src/utils/database', () => ({
  saveTransactions: jest.fn(), // Mock the database function
}));

describe('CSV Parser', () => {
  const mockFilePath = '/path/to/mock-file.csv';
  const mockInvalidFilePath = '/path/to/invalid-file.csv';

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks

    // Mock file system
    mockfs({
      'valid.csv': 'date,description,amount,category\n2025-01-15,Test 1,100.5,Food\n2025-01-16,Test 2,200.75,Travel',
      'invalid.csv': 'date,description,amount\ninvalid-date,missing-amount,missing-category', // Invalid CSV content
      'large.csv': '', // Empty file
      'nonexistent.csv': '', // Non-existent mock file for error testing
    });

    // Mock fs.createReadStream for testing
    (fs.createReadStream as jest.Mock).mockReturnValueOnce({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          const mockData = [
            { date: '2025-01-15', description: 'Test 1', amount: '100.5', category: 'Food' },
            { date: '2025-01-16', description: 'Test 2', amount: '200.75', category: 'Travel' },
          ];
          mockData.forEach((row) => callback(row));
        }
        if (event === 'end') callback();
        return this;
      }),
    });

    // Mock fs.statSync for file size
    (fs.statSync as jest.Mock).mockReturnValueOnce({ size: 5000 }); // Mock file size < 10MB
  });

  afterEach(() => {
    mockfs.restore(); // Cleanup the mocked file system
  });

  it('should parse valid CSV data successfully', async () => {
    const transactions = await parseCSV('valid.csv');
    expect(transactions).toEqual([
      { date: '2025-01-15', description: 'Test 1', amount: 100.5, category: 'Food' },
      { date: '2025-01-16', description: 'Test 2', amount: 200.75, category: 'Travel' },
    ]);
  });

  it('should reject when the file does not exist', async () => {
    await expect(parseCSV('nonexistent.csv')).rejects.toThrow('File not found');
  });

  it('should reject when file size exceeds the 10MB limit', async () => {
    // Simulate a file size > 10MB
    (fs.statSync as jest.Mock).mockReturnValueOnce({ size: 15 * 1024 * 1024 });
    await expect(parseCSV('large.csv')).rejects.toThrow('File size exceeds the 10MB limit');
  });

  it('should reject when there are invalid or missing fields', async () => {
    const transactions = await parseCSV('invalid.csv');
    expect(transactions).toEqual([]); // This test case checks for handling invalid content
  });


 

 


  // Test case for validating file type (only CSV should be allowed)
  it('should reject non-CSV files', async () => {
    const nonCsvFile = Buffer.from('This is a test file content'); // Content of the non-CSV file

    const response = await request(app)
      .post('/transactions/upload') // Adjust the endpoint path as needed
      .attach('file', nonCsvFile, 'invalid.txt'); // Attaching a non-CSV file

    // Assert that the status code is 400
    expect(response.status).toBe(400);

    // Assert that the error message is correct
    expect(response.body.error).toBe('Only CSV files are allowed!');
  });

  // Test case for validating file size (file size limit of 10MB)
  it('should handle file size limit (10MB)', async () => {
    const largeFilePath = 'large.csv';
    // Simulating file size check (mock size check, since file content is empty)
    const mockFileStats = { size: 15 * 1024 * 1024 }; // 15MB, larger than 10MB

    // Mock the fs.statSync method to return the large file size
    (fs.statSync as jest.Mock).mockReturnValueOnce(mockFileStats);

    await expect(parseCSV(largeFilePath)).rejects.toThrow('File size exceeds the 10MB limit');
  });

  it('should handle errors during file reading (Error instance)', async () => {
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

  // New test case for processing a valid CSV file and saving to the database
  it('should process a valid CSV file and save transactions to the database', async () => {
    const mockData = [
      { date: '2025-01-15', description: 'Test 1', amount: '100.5', category: 'Food' },
      { date: '2025-01-16', description: 'Test 2', amount: '200.75', category: 'Travel' },
    ];

    // Mock the database save function
    const { saveTransactions } = require('../src/utils/database');
    saveTransactions.mockResolvedValueOnce(mockData); // Mock the function to resolve with the mockData

    const response = await request(app)
      .post('/upload')
      .attach('file', './valid.csv'); // Attach the valid CSV file

    // Assert that the file was processed and transactions were saved to the database
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File processed and transactions saved successfully!');
    expect(saveTransactions).toHaveBeenCalledWith(mockData); // Check if the database save function was called with correct data
  });


  it('should handle empty CSV file gracefully', async () => {
    const emptyFilePath = 'large.csv'; // Simulate an empty file
  
    // Mock the fs.createReadStream method to simulate an empty CSV file (no data rows)
    (fs.createReadStream as jest.Mock).mockReturnValueOnce({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          // No data will be sent for an empty file
        }
        if (event === 'end') callback(); // Trigger 'end' event
        return this;
      }),
    });
  
    // Call the CSV parsing function
    await expect(parseCSV(emptyFilePath)).rejects.toThrow('CSV file is empty');
  });
});


